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
