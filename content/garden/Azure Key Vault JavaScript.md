# Azure Key Vault JavaScript
Recently created a project that used Azure AD for single sign-on, and I set up [[Cypress and MSAL SSO]] and came across a classic problem - how do I store and share the secrets across the team?

I've used Azure Key Vault before on a C# project and it worked really well, as it used your Microsoft account to check your permissions in the Azure AD and could automatically inject env variables into your code when running it.

Luckily there are some Azure provided libraries to handle this in JavaScript, and below is the file I used to grab and set some environment variables when running Cyoress.

```ts
import { SecretClient } from "@azure/keyvault-secrets";
import { DefaultAzureCredential } from "@azure/identity";

const { execSync } = require("child_process");

// Azure KV Secret names
const AZURE_AD_CLIENT_SECRET_NAME = "test-ad-client-secret";
const AZURE_AD_PASSWORD_NAME = "test-ad-password";

// Azure KV URL
const AZURE_KV_URL = "https://my-kv.vault.azure.net/";

async function main() {
  const credential = new DefaultAzureCredential();
  const client = new SecretClient(AZURE_KV_URL, credential);

  // get the secrets
  const { value: AZURE_AD_CLIENT_SECRET } = await client.getSecret(
    AZURE_AD_CLIENT_SECRET_NAME
  );
  const { value: AZURE_AD_PASSWORD } = await client.getSecret(
    AZURE_AD_PASSWORD_NAME
  );

  const ENV_VARS = {
    AZURE_AD_CLIENT_SECRET,
    AZURE_AD_PASSWORD,
  };

  const ENV_STRING = Object.keys(ENV_VARS)
    .map((key) => `${key}=${ENV_VARS[key]}`)
    .join(",");

  // run cypress with secrets
  execSync(`npm run cypress:open -- --env ${ENV_STRING}`);
}

main().catch((error) => {
  console.error("An error occurred:", error);
  process.exit(1);
});

```

I was also considering writing a `preinstall` script which just writes the variables to a file, but that comes with the risk of them being accidentally committed.