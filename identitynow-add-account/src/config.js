
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

// you must edit the config constant below with your org's data and preferred form fields.
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
