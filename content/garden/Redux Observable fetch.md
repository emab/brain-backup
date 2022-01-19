# Redux Observable fetch

As an alternative to the `ajax` methods provided by [[Redux Observable]], you can use the more familiar `fetch`
implementation called `fromFetch`:

```ts
const data$ = fromFetch('https://api.github.com/users?per_page=5').pipe(
  switchMap(response => {
    if (response.ok) {
      // OK return data
      return response.json();
    } else {
      // Server is returning a status requiring the client to try something else.
      return of({ error: true, message: `Error ${response.status}` });
    }
  }),
  catchError(err => {
    // Network or other error, handle appropriately
    console.error(err);
    return of({ error: true, message: err.message })
  })
);
```

You could use this inside an epic:

```ts
const getDataEpic: Epic = (action$) =>
  action$.pipe(
    ofType(ActionType.GET_DATA),
    // switch map will cancel last request if it is pending
    // use mergeMap if you'd like all requests of this data type to continue
    switchMap(({ url }) => fromFetch(url)),
    map((response) => {
      if (response.ok) {
        return [of(response.json()).pipe(
          // we use a mergeMap here to resolve the .json() promise
          mergeMap(json => json),
          map(data => ({ type: ActionType.DATA_RECEIVED, data }))
        )];
      } else {
        return of({ error: true, message: `Error ${response.status}` });
      }
    })
  );
```

Alternatively, you could create a wrapper that handles some of this logic for you:

```ts
// This is the response shape from the API
type ApiResponse<Data> = {
  docs: Data;
  limit: number;
  offset: number;
  page: number;
  pages: number;
  total: number;
};

// The response uses _id instead of id
type ApiData<Type> = Type & { _id: string };

export const fetch =
  <Data>(
    url: string,
    mapResponse: (value: ApiResponse<Data>) => Action,
    options: RequestInit = {}
  ) =>
    (): Observable<Action> =>
      fromFetch(url, {
        ...options,
        headers: {
          ...options.headers,
          ...createAuthHeader(),
        },
      }).pipe(
        switchMap((res) => {
          if (res.ok) {
            return of(res.json()).pipe(
              mergeMap((json) => json),
              map(mapResponse)
            );
          }
          return [{ type: "SERVER_FETCH_ERROR", message: res.statusText }];
        }),
        catchError((err) => {
          console.error(err);
          return [{ type: "FETCH_ERROR", message: err.message }];
        })
      );

// usage
export const getCharacterList = fetch<ApiData<Character>[]>(
  `${BASE_URL}/character`,
  ({ docs }) => setCharactersAction(dataMapper(docs))
);

// Epic usage
export const getCharactersEpic: Epic = (action$) =>
  action$.pipe(
    ofType(CharacterActionType.GET_CHARACTERS),
    // this will either output a setCharactersAction or a FETCH_ERROR/SERVER_FETCH_ERROR action
    switchMap(() => getCharactersFetch()),
  );
```