# Copyright 2018 SailPoint Technologies, Inc.

# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at

#     http://www.apache.org/licenses/LICENSE-2.0

# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.


# encoding = utf-8

import os
import sys
import time
import datetime
import requests
import json
import base64

def validate_input(helper, definition):
  pass

def collect_events(helper, ew):
  # Get information about IdentityNow from the input configuration
  tenant = {
    "url" : helper.get_arg('identitynow_url'), 
    "clientId" : helper.get_arg('client_id'),
    "clientSecret" : helper.get_arg('client_secret')
  }

  # Create a log file where we can temporarily hold the data
  log_file = os.path.join(os.environ['SPLUNK_HOME'], 'etc', 'apps', 'IdentityNow_Audit', 'tmp', tenant["clientId"]+"_log.txt")
  try:
    file = open(log_file, 'r')
  except IOError:
    try:
      file = open(log_file, 'w')
    except IOError:
      os.makedirs(os.path.dirname(log_file))
      file = open(log_file, 'w')
      
  with open(log_file) as f:
    f.readlines()

  # Read the id and timestamp from the checkpoint file, and create the checkpoint file if necessary
  # - The checkpoint file contains the ID and timestamp of the last audit log event that was collected by 
  #   Splunk using this plugin.
  # - Note the filename is prepended with the clientId value, so a new or different client will 
  #   have a different checkpoint file
  
  checkpoint_file = os.path.join(os.environ['SPLUNK_HOME'], 'etc', 'apps', 'IdentityNow_Audit', 'tmp', tenant["clientId"]+"_checkpoint.txt")
  try:
    file = open(checkpoint_file, 'r')
  except IOError:
    try:
      file = open(checkpoint_file, 'w')
    except IOError:
      os.makedirs(os.path.dirname(checkpoint_file))
      file = open(checkpoint_file, 'w')

      
  with open(checkpoint_file) as f:
    content = f.readlines()
  content = [x.strip() for x in content]
  
  checkpointTime = 1000*(int(time.time()) - 86400) # default limit one day
  checkpointId = ""
  if len(content) == 2:
    checkpointId= content[0]
    checkpointTime = int(content[1])
  
  # Read the most recent audit data into a list.
  found_id = False

  auth_string = base64.b64encode((tenant["clientId"]+":"+tenant["clientSecret"]).encode('UTF-8')).decode('ascii').rstrip()
  headers = {'Accept' : 'application/json', 'authorization' : "Basic " + auth_string }

  ctr = 0
  events = []
  while True:
    if found_id == True:
      break
    epoch_timestamp = int(checkpointTime/1000) - 1 # overlap one second to ensure we get all of the data, we will not stream duplicates
    sinceTime = datetime.datetime.fromtimestamp(epoch_timestamp).isoformat()
    querystring = {
      "start":str(1000*ctr),
      "limit":str((1000*ctr)+999),
      "since":sinceTime
    }
    response = requests.request( "GET", tenant["url"] + '/api/v2/audit/auditEvents', data="", headers=headers, params=querystring )
    log_string = json.dumps(response.json())

    with open(log_file, 'r+') as f:
      f.write(str(datetime.datetime.now()).split('.')[0])
      f.write(" API RESPONSE (json): ")
      f.write(log_string)
      f.write("\n\n")
    results = response.json()["items"]
    for s in results:
      if s["id"] == checkpointId:
        found_id = True
    if checkpointId == "":
      found_id = True
    events.extend(results)
    ctr = ctr+1

  # Find the index of the line with the checkpointId
  # - This is the last data we streamed to Splunk on the previous API call.
  new_checkpointId = ""
  found_end = False
  max_idx = 0
  i = 0
  for s in events:
    if i == 0:
      new_checkpointId = s["id"]
      new_checkpointTime = s["created"]
    if s["id"] == checkpointId:
      max_idx=i-1
      found_end = True
    i=i+1
  if not found_end:
    max_idx = len(events)

  # Stream the events from the latest (index 0) to the oldest that were not yet streamed to Splunk
  for i in range(max_idx):
    # add a datetime timestamp for Splunk to read based on the 'created' time which is milliseconds from the epoch
    epoch_timestamp = int(events[i]["created"])/1000
    events[i]['datetime'] = datetime.datetime.fromtimestamp(epoch_timestamp).strftime('%Y-%m-%d %H:%M:%S')
    data = json.dumps(events[i])
    event = helper.new_event(data, time=None, host=None, index=None, source=None, sourcetype='_json', done=True, unbroken=True)
    ew.write_event(event)

  # Update the checkpoint file with the data from the latest event that was streamed to Splunk
  with open(checkpoint_file, 'r+') as f:
    f.seek(0)
    f.write(new_checkpointId+"\n")
    f.write(str(new_checkpointTime))
    f.truncate()