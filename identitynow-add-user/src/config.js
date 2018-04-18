export const config = {
    source: "62863",
    title: "IdentityNow Registration",
    tenant: {
        name: "neil-test",
        url: "https://neil-test.identitynow.com",
        clientId: "MKsZwbEt4L82mY6u",
        clientSecret: "5XzbTuusVoOGGyubCc6yhlmQLof1Fnru"
    },
    formElements: [{
            name: "id",
            displayName: "Unique Identifier",
            tooltip: "This is the unique identifier of the person.",
            required: true,
            type: "string"
        },
        {
            name: "givenName",
            displayName: "First Name",
            tooltip: "This is the first or given name of the person.",
            required: true,
            type: "string"
        },
        {
            name: "middleName",
            displayName: "Middle Name",
            tooltip: "This is the middle name or initial of the person.",
            required: false,
            type: "string"
        },
        {
            name: "familyName",
            displayName: "Last Name",
            tooltip: "This is the last or family name of the person.",
            required: true,
            type: "string"
        },
        {
            name: "displayName",
            displayName: "Display Name",
            tooltip: "This is the display name of the person.  Usually first and last.",
            required: false,
            type: "string"
        },
        {
            name: "email",
            displayName: "Email Address",
            tooltip: "This is the contact email address of the person.",
            required: false,
            type: "string"
        },
        {
            name: "phoneNumber",
            displayName: "Phone Number",
            tooltip: "This is the person's contact phone number.",
            required: false,
            type: "string"
        },
        {
            name: "location",
            displayName: "Location",
            tooltip: "This is the location of the person.",
            required: false,
            type: "string"
        },
        {
            name: "country",
            displayName: "Country",
            tooltip: "This is the person's country.",
            required: false,
            type: "list",
            options: [
              {
                label: 'United States of America',
                value: 'US'
              }, {
                label: 'United Kingdom',
                value: 'UK'
              },{
                label: 'Germany',
                value: 'DE'
              }
            ]
        }
    ]
};

export default config;
