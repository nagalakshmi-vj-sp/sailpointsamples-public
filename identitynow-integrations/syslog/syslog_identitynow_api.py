#!/usr/bin/env python

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

import logging
import logging.handlers
import argparse
import sys
import os
import sys
import time
import datetime
import requests
import json
import base64
import syslog
import yaml

INETRVAL = 3600 # default value 1 hr

configFile = os.path.join('/', 'etc', 'sailpoint_syslog.yaml')

tenant = {
  "url" : "",
  "clientId" : "",
  "clientSecret" : "",
  "interval" : ""
}

config = yaml.load(open(configFile))

if config:
  tenant = {
    "url" : config["url"],
    "clientId" : config["clientId"],
    "clientSecret" : config["clientSecret"]
  }
  INTERVAL = config["interval"]

# Define and parse command line arguments, override configuration read from the file
parser = argparse.ArgumentParser(description="IdentityNow Audit to Syslog Service")
parser.add_argument("-u", "--url", help="IdentityNow URL [ https://myorg.identitynow.com ]")
parser.add_argument("-i", "--client_id", help="Client ID for OAuth")
parser.add_argument("-s", "--client_secret", help="Client Secret for OAuth")
parser.add_argument("-t", "--interval", help="Polling interval in seconds")

args = parser.parse_args()
if args.url:
  tenant["url"] = args.url
if args.client_id:
  tenant["clientId"] = args.client_id
if args.client_secret:
  tenant["clientSecret"] = args.client_secret
if args.interval:
  INTERVAL = args.interval

# TODO:
# Need to check and make sure we have valid config variables, otherwise syslog an error

TEMP_FILENAME = os.path.join('/', 'tmp', tenant["clientId"]+"_tmp.txt")
CHECKPOINT_FILENAME = os.path.join('/', 'tmp', tenant["clientId"]+"_checkpoint.txt")
LOG_FILENAME = os.path.join('/', 'var', 'log', tenant["clientId"]+"_sailpoint.log")
LOG_LEVEL = logging.INFO

logger = logging.getLogger(__name__)
logger.setLevel(LOG_LEVEL)

handler = logging.handlers.TimedRotatingFileHandler('/var/log/sailpoint.log', when="midnight", backupCount=3)
formatter = logging.Formatter()
handler.setFormatter(formatter)
logger.addHandler(handler)

class Logger(object):
  def __init__(self, logger, level):
    """Needs a logger and a logger level."""
    self.logger = logger
    self.level = level

  def write(self, message):
    if message.rstrip() != "":
      self.logger.log(self.level, message.rstrip())

  def flush(self):
    pass

sys.stdout = Logger(logger, logging.INFO)
sys.stderr = Logger(logger, logging.ERROR)

# Create a temp file where we can temporarily hold the data
tempFile = TEMP_FILENAME
try:
  file = open(tempFile, 'r')
except IOError:
  try:
    file = open(tempFile, 'w')
  except IOError:
    os.makedirs(os.path.dirname(tempFile))
    file = open(tempFile, 'w')
    
with open(tempFile) as f:
  f.readlines()

# Create a syslog file for the events returned from the API
logFile = LOG_FILENAME
try:
  file = open(logFile, 'r')
except IOError:
  try:
    file = open(logFile, 'w')
  except IOError:
    os.makedirs(os.path.dirname(logFile))
    file = open(logFile, 'w')
    
with open(logFile) as f:
  f.readlines()

# Read the timestamp from the checkpoint file, and create the checkpoint file if necessary
# - The checkpoint file contains the timestamp of the last audit log event that was collected.
# - Note the filename is prepended with the clientId value, so a new or different client will 
#   have a different checkpoint file

checkpointFile = CHECKPOINT_FILENAME
try:
  file = open(checkpointFile, 'r')
except IOError:
  try:
    file = open(checkpointFile, 'w')
  except IOError:
    os.makedirs(os.path.dirname(checkpointFile))
    file = open(checkpointFile, 'w')

# Get initial checkpoint data before entering the main loop
with open(checkpointFile) as f:
  content = f.readlines()
content = [x.strip() for x in content]

checkpointTime = 1000*(int(time.time()) - 3600) # default an hour if no checkpoint time is provided
checkpointId = ""
if len(content) == 2:
  checkpointId= content[0]
  checkpointTime = int(content[1])

# This is the main loop.
while True:
  print(str(datetime.datetime.now()).split('.')[0]+" top of loop")
  found_id = False
  # Build headers and query for API call
  auth_string = base64.b64encode((tenant["clientId"]+":"+tenant["clientSecret"]).encode('UTF-8')).decode('ascii').rstrip()
  headers = {
    'Accept' : 'application/json',
    'authorization' : "Basic " + auth_string 
  }

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

    with open(logFile, 'r+') as f:
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
  # Note that IdentityNow streams back audit data in the order of newest-first
  # This means the last event we want to log will be the index previous to the one with the checkpointId
  newCheckpointId = ""
  foundEnd = False
  maxIdx = 0
  i = 0
  for s in events:
    if i == 0: # Collect the new ID and timestamp to store
      newCheckpointId = s["id"]
      newCheckpointTime = s["created"]
    if s["id"] == checkpointId: # This is the last event we logged on the previous call
      maxIdx=i-1
      foundEnd = True
    i=i+1
  if not foundEnd:
    maxIdx = len(events)

  # post the events to syslog
  for i in reversed(range(maxIdx)): # reverse so you write them to the file so the most recent entry is last, per syslog convention
    # add a datetime timestamp for the SEIM to read based on the 'created' time which is milliseconds from the epoch
    epochTimestamp = int(events[i]["created"])/1000
    events[i]['datetime'] = datetime.datetime.fromtimestamp(epochTimestamp).strftime('%Y-%m-%d %H:%M:%S')
    logTimestamp = datetime.datetime.fromtimestamp(epochTimestamp).isoformat()
    data = json.dumps(events[i])
    # Log the event in pseudo-syslog format
    with open(logFile, 'r+') as f:
      f.readlines()
      f.write(str(logTimestamp))
      f.write(" ")
      f.write(tenant["url"])
      f.write(" ")
      f.write(data)
      f.write("\n")

  # Update the checkpoint file with the data from the latest event that was streamed to Splunk
  with open(checkpointFile, 'r+') as f:
    f.seek(0)
    f.write(newCheckpointId+"\n")
    f.write(str(newCheckpointTime))
    f.truncate()

  print(str(datetime.datetime.now()).split('.')[0]+" sleeping "+str(INTERVAL)+" seconds")
  time.sleep(int(INTERVAL))
