# Redux Observable Ajax Default Header Hack
Ever wanted to use `ajax.get()`, `ajax.post()`, `ajax.put()` and the rest without having to set the authorization header every time? Welcome to the future!

This is an annoying problem since the parameters for `get`, `getJSON`, and `delete` are not the same as `patch`, `post`, and `put`.

In the example below a Proxy is used to take the ajax method and then grab the position of the `header` object. The object then has a the token added to it, and is then called with the modified arguments.

This is working with **TS 4.5.4**, however I did sneak an `any` in... would love to get rid of that if anyone has any suggestions.

```ts
import { ajax as Ajax } from 'rxjs/ajax';
import { Observable } from 'rxjs';

// a proxy for the default ajax function
// adapted from https://stackoverflow.com/questions/45778994/rxjs-how-to-set-default-request-headers

export type AuthenticatedRequest<ResponseType> = (
  ajax: typeof Ajax
) => Observable<ResponseType>;

const createAuthorizationHeader = (token: string) => ({
  Authorization: `Bearer ${token}`,
});

const getHeadersPos = (ajaxMethod: string): number => {
  switch (ajaxMethod) {
    case 'get':
    case 'getJSON':
    case 'delete':
      return 1;
    case 'patch':
    case 'post':
    case 'put':
      return 2;
    default:
      return -1;
  }
};

const ajaxProxy =
  (token: string, ajaxCreationMethod: typeof Ajax) => {
    return new Proxy(ajaxCreationMethod, {
      get(ajax, requestType: keyof typeof Ajax) {
        const ajaxMethod = ajax[requestType];
        const headersPos = getHeadersPos(requestType);

        if (headersPos === -1 || typeof ajaxMethod !== 'function') {
          return ajaxMethod;
        }

        return (...args: Parameters<typeof ajaxMethod>) => {
          args[headersPos] = {
            ...args[headersPos] as Record<string, string>,
            ...createAuthorizationHeader(token),
          };

          return ajaxMethod.apply(this, args as any);
        };
      },
    });
  };

export const ajax = (token: string) => ajaxProxy(token, Ajax);
```

You can use [[Custom Operators]] to wrap this new authenticated ajax function to use easily in existing Epics.