
// Copyright 2018 SailPoint Technologies, Inc.

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

//     http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

var request = require("request");

export default class IDNClient {

  static createAccount( tenant, source, values, callback ) {

    console.log( "Calling createAccount" );

    var options = {
      method: 'POST',
      url: `https://${tenant.name}.api.identitynow.com/v2/accounts`,
      headers: {
        'Content-Type': 'application/json'
      },
      auth: {
        user: `${tenant.clientId}`,
        password: `${tenant.clientSecret}`
      },
      qs: {
        sourceId: `${source}`,
        org: `${tenant.name}`
      },
      body: values,
      json: true
    };

    request( options, function(error, response, body) {

        console.log(`Reponse: ${JSON.stringify(response)}`);
        console.log(`Error: ${error}`);

        if (error) {
            callback('danger', "Error", String(error));
        }
        else {
            callback('success', "Success", "Your request has been submitted!");
        }

        return error;
    });
  }

}
