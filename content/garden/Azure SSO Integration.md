# Azure SSO Integration

Done with a React front-end application and a Spring Boot back-end.

Implementation was quite straight forward, and enabled a JWT token to be used to authorize requests from the front-end to the back-end.

## Requirements

### Cloud

You'll need an Active Directory initially. From here you create two app registrations, one for the API and one for the App.

#### API

In the API configuration you should add scopes via `Expose an API`. Add an Application URI here then add a scope such as `User.Access`. This should give you something like this:

```
api://0000000-0000-0000-0000-0000000/User.Access
```

Below this you should also add the App as a client application.

#### App

The App authentication should be set up to use `Access Tokens (used for implicit flows)` and include suitable redirect URIs for login callbacks.

You should then go to `API Permissions` and add the scope we saw above as a permission.

This should now allow a token to be created from the front-end using the scope defined in the API, which will then be decoded by Spring Boot.

### Front-end

Used the new provided packages from Azure, which provide some handy hooks for authentication if you're using functional components.

- `@azure/msal-browser`
- `@azure/msal-react`

Also provide some basic auth config:

```ts
export const msalConfig = {
  auth: {
    clientId: '<app-registration-client-id>',
    authority:
      'https://login.microsoftonline.com/<AAD-resource-id>',
  },
  cache: {
    cacheLocation: 'sessionStorage',
  },
};

export const loginRequest = {
  // this corresponds to the User.Read scope for accessing the
  // Azure Graph API which holds user info 
  scopes: ['User.Read'],
};

// this scope comes from the Azure App Registration setup
// This will be the API app url and scope which the front-end will try
// to use when authenticating with token
export const USER_API_SCOPE =
  'api://<api-url-from-azure>/<Some.Scope>';
```

Getting and using a token is also straightforward. The below example uses the scope from the file above to request a token - different tokens could be substituted here:

```ts
export default async (
  instance: IPublicClientApplication,
  account: AccountInfo
): Promise<string> => {
  const tokenResult = await instance.acquireTokenSilent({
    scopes: [USER_API_SCOPE],
    account,
  });

  return tokenResult.accessToken;
};
```

### Back-end

You'll need a couple of dependencies for Spring Boot and Azure to work nicely:

- `org.springframework.boot:spring-boot-starter-security`
- `com.azure.spring:azure-spring-boot-starter-active-directory`
- `org.springframework.boot:spring-boot-starter-oauth2-resource-server`

The configuration is minimal for newer versions of Spring Boot:

```java
import com.azure.spring.aad.webapi.AADResourceServerWebSecurityConfigurerAdapter;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;

@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class AADOAuth2ResourceServerSecurityConfig extends AADResourceServerWebSecurityConfigurerAdapter {
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        super.configure(http);
    }
}
```

Remember to add this to your main application if you didn't already:

```java
// Web security
@EnableWebSecurity
@SpringBootApplication
public class ApiApplication {
    public static void main(String[] args) {
        SpringApplication.run(ApiApplication.class, args);
    }
}
```

You can then check for authorities like this:

```java
@RestController
public class HelloController {

    @GetMapping("/hello")
    @PreAuthorize("hasAuthority('SCOPE_User.Access')")
    public MessageResponse authenticated() {
        return new MessageResponse("Authenticated with API with correct scope!");
    }
}
```

I needed the following in `application.properties` in order for this to work properly:

```properties
azure.activedirectory.tenant-id=<azure-active-directory-tenant-id>
azure.activedirectory.client-id=<the-id-of-the-frontend-application>
# looks like api://0000000-0000-0000-0000-0000000
# we put it before the scope used in the front-end earlier
azure.activedirectory.app-id-uri=<the-app-uri-created-in-api-app-registration-page>
```