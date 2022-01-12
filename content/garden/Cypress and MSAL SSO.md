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
  "apiScopes": ["api://api-client-id/Data.Read"],
  "username": "user@yourcompany.onmicrosoft.com",
	
  // These are both very secret
  "clientSecret": "app-client-secret",
  "password": "password"
}
```

**WARNING**
You should **not** check in the test users `clientSecret` or `password` into VCS. See [[Azure Key Vault JavaScript]] for a way to inject these variables, or share them in some other secure way.

Along with the following support file:

```ts
// support/auth.ts

import { decode } from "jsonwebtoken";  
import * as authSettings from "./authsettings.json";  
import Chainable = Cypress.Chainable;  
import AUTWindow = Cypress.AUTWindow;  
  
/*  
 * Adapted from https://github.com/juunas11/AzureAdUiTestAutomation 
 */  

type TokenResponseBody = {  
  access_token: string;  
  expires_in: number;  
  ext_expires_in: number;  
  id_token: string;  
};  
  
type TokenResponse = {  
  body: TokenResponseBody;  
  status: number;  
};  
  
const { 
	authority, 
	clientId, 
	apiScopes, 
	username, 
	clientSecret, 
	password } = authSettings;  
const environment = "login.windows.net";  
  
const buildAccountEntity = (  
  homeAccountId,  
 realm,  
 localAccountId,  
 username,  
 name  
) => ({  
  authorityType: "MSSTS",  
  clientInfo: "",  
  homeAccountId,  
  environment,  
  realm,  
  localAccountId,  
  username,  
  name,  
});  
  
const buildIdTokenEntity = (homeAccountId, idToken, realm) => ({  
  credentialType: "IdToken",  
  homeAccountId,  
  environment,  
  clientId,  
  secret: idToken,  
  realm,  
});    
  
const buildAccessTokenEntity = (  
  homeAccountId,  
 accessToken,  
 expiresIn,  
 extExpiresIn,  
 realm,  
 scopes  
) => {  
  const now = Math.floor(Date.now() / 1000);  
   return {  
    homeAccountId,  
     credentialType: "AccessToken",  
     secret: accessToken,  
     cachedAt: now.toString(),  
     expiresOn: (now + expiresIn).toString(),  
     extendedExpiresOn: (now + extExpiresIn).toString(),  
     environment,  
     clientId,  
     realm,  
     target: scopes.map((s) => s.toLowerCase()).join(" "),  
   };  
};  
  
const injectTokens = (tokenResponse) => {  
  const idToken = decode(tokenResponse.id_token);  
  const localAccountId = idToken.oid || idToken.sid;  
  const realm = idToken.tid;  
    const homeAccountId = `${localAccountId}.${realm}`;  
    const username = idToken.preferred_username;  
    const name = idToken.name;  
  
    const accountKey = `${homeAccountId}-${environment}-${realm}`;  
    const accountEntity = buildAccountEntity(  
      homeAccountId,  
      realm,  
      localAccountId,  
      username,  
      name  
     );  
  
 const idTokenKey = 
	   `${homeAccountId}-${environment}-idtoken-${clientId}-${realm}-`;  
 const idTokenEntity = buildIdTokenEntity(  
    homeAccountId,  
    tokenResponse.id_token,  
    realm  
  );  
  
 const accessTokenKey = 
	   `${homeAccountId}-${environment}-accesstoken-${clientId}-${realm}-${apiScopes.join(  
    " ")}`;  
 const accessTokenEntity = buildAccessTokenEntity(  
    homeAccountId,  
    tokenResponse.access_token,  
    tokenResponse.expires_in,  
    tokenResponse.ext_expires_in,  
    realm,  
    apiScopes  
  );  
  
 sessionStorage.setItem(accountKey, JSON.stringify(accountEntity));  
 sessionStorage.setItem(idTokenKey, JSON.stringify(idTokenEntity));  
 sessionStorage.setItem(accessTokenKey, JSON.stringify(accessTokenEntity));  
};  
  
export const login = (  
  cachedTokenResponse: TokenResponse  
): Chainable<Cypress.Response<any>> => {  
  let tokenResponse = null;  
  let chainable: Chainable<AUTWindow> | Chainable<Cypress.Response<any>> =  
    cy.visit("/");  
  
  if (!cachedTokenResponse) {  
     chainable = chainable.request({  
       url: authority + "/oauth2/v2.0/token",  
       method: "POST",  
       body: {  
         grant_type: "password",  
         client_id: clientId,  
         client_secret: clientSecret,  
         scope: ["openid profile"].concat(apiScopes).join(" "),  
         username,  
         password,  
       },  
       form: true,  
     });  
   } else {  
     chainable.then(() => {  
       return {  
         body: cachedTokenResponse,  
       };  
   });  
 }  
  (chainable as Chainable<Cypress.Response<any>>)  
    .then((response: TokenResponse) => {  
      injectTokens(response.body);  
   tokenResponse = response.body;  
   })  
   .reload()  
   .then(() => {  
     return tokenResponse;  
 });  
  
 return chainable as Chainable<Cypress.Response<any>>;  
};
```

This file is responsible for making a `POST` request to Azure AD and setting the session storage with your credentials.

We can now add the exposed `login` function to Cypress:

```ts
// support/commands.ts

let cachedTokenExpiryTime = new Date().getTime();  
let cachedTokenResponse = null;  
  
Cypress.Commands.add("login", () => {  
  // Clear our cache if tokens are expired  
 if (cachedTokenExpiryTime <= new Date().getTime()) {  
    cachedTokenResponse = null;  
 }  
  
  return login(cachedTokenResponse).then((tokenResponse) => {  
    cachedTokenResponse = tokenResponse;  
    // Set expiry time to 50 minutes from now  
    cachedTokenExpiryTime = new Date().getTime() + 50 * 60 * 1000;  
  });  
});
```

You should also add a type:

```ts
// support/index.ts

// ***********************************************************  
// This example support/index.js is processed and  
// loaded automatically before your test files.  
//  
// This is a great place to put global configuration and  
// behavior that modifies Cypress.  
//  
// You can change the location of this file or turn off  
// automatically serving support files with the  
// 'supportFile' configuration option.  
//  
// You can read more here:  
// https://on.cypress.io/configuration  
// ***********************************************************  
  
// Import commands.js using ES2015 syntax:  
import "./commands";  
  
// Alternatively you can use CommonJS syntax:  
// require('./commands')  
declare global {  
  namespace Cypress {  
    interface Chainable {  
      login(): Chainable<Cypress.Response<any>>;  
 }  
  }  
}
```

Now you can use the `login` command to skip your splash screen and authenticated a user! 🎉

Example usage:
```ts
cy.login().visit("/secure");
```