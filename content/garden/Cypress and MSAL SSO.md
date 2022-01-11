# Cypress and MSAL SSO

Created an application that used [[Azure SSO Integration]] and wanted to test with Cypress. I was thinking about bypassing the login altogether but the doucmentation advised against this.

Instead of skipping authentication or manually typing in a username and password each time, you should inject the relevant information into `sessionStorage` or `localStorage`.


### Requirements:

1. Azure AD Tenant
	1. Worth creating a seperate one for testing environment
2. Create the API / App applications as described in [[Azure SSO Integration]]


## Cypress Setup

First you'll need to store some secrets in Cypress to be used when getting auth details:

```json
// support/authSettings.json
{
  "authority": "https://login.microsoftonline.com/your-aad-tenant-id",
  "clientId": "app-client-id",
  "clientSecret": "app-client-secret",
  "apiScopes": ["api://api-client-id/Data.Read"],
  "username": "user@yourcompany.onmicrosoft.com",
  "password": "password"
}
```

Along with the following support file:

``````