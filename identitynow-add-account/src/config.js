export const config = {
    source: "123456",
    title: "IdentityNow Add User",
    tenant: {
        name: "my-org",
        url: "https://my-org.identitynow.com",
        clientId: "the_clientId_string",
        clientSecret: "the_clientSecret_string"
    },
    formElements: [{
            name: "id",
            displayName: "Unique Identifier",
            tooltip: "Enter a unique identifier for the user, such as employee number. This must be unique among all identities.",
            required: true,
            type: "string"
        },
        {
            name: "givenName",
            displayName: "First Name",
            tooltip: "Enter the person's first or given name.",
            required: true,
            type: "string"
        },
        {
            name: "middleName",
            displayName: "Middle Name",
            tooltip: "Enter the person's middle name or initial.",
            required: false,
            type: "string"
        },
        {
            name: "familyName",
            displayName: "Last Name",
            tooltip: "Enter the person's last or family name.",
            required: true,
            type: "string"
        },
        {
            name: "displayName",
            displayName: "Display Name",
            tooltip: "Enter a display name of the person. Usually First Last or First.Last.",
            required: false,
            type: "string"
        },
        {
            name: "email",
            displayName: "Email Address",
            tooltip: "Enter the person's primary email address.",
            required: false,
            type: "string"
        },
        {
            name: "phoneNumber",
            displayName: "Phone Number",
            tooltip: "Enter the person's primary phone number.",
            required: false,
            type: "string"
        },
        {
            name: "location",
            displayName: "Location",
            tooltip: "Enter the person's location.",
            required: false,
            type: "string"
        },
        {
            name: "country",
            displayName: "Country",
            tooltip: "Enter the person's country.",
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
        },
        {
            name: "lcs",
            displayName: "Life Cycle State",
            tooltip: "Enter the IdentityNow life cycle state for this user.",
            required: false,
            type: "list",
            options: [
              {
                label: 'Active',
                value: 'active'
              }, {
                label: 'Inactive',
                value: 'inactive'
              }
            ]
        }
    ]
};

export default config;
