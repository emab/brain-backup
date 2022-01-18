# Redux Observable Ajax

#react #redux-observable #rxjs 

If you're using `redux-observable` you may want to use it's built in methods for sending HTTP requests asyncronously.  

I'm using [The One API](https://the-one-api.dev/) for my data. I have a mapper function which switches from `_id` to `id`.

```ts
// api.ts

import { Observable } from "rxjs";
import { Character } from "../../types";
import { ajax } from "rxjs/ajax";
import { map } from "rxjs/operators";
import dataMapper from "./dataMapper";

const BASE_URL = "https://the-one-api.dev/v2";

const createAuthHeader = () => ({
  Authorization: `Bearer ${process.env.REACT_APP_API_KEY}`,
});

type ApiResponse<Data> = {
  docs: Data;
  limit: number;
  offset: number;
  page: number;
  pages: number;
  total: number;
};

type ApiData<Type> = Type & { _id: string };

export const getCharacters = (): Observable<Character[]> =>
  ajax
    .get<ApiResponse<ApiData<Character>[]>>(`${BASE_URL}/character`, {
      ...createAuthHeader(),
    })
    .pipe(
      map((res) => res.response.docs),
      map(dataMapper)
    );

```

***Note:*** * see [[Redux Observable Ajax Default Header Hack]] for setting the authorization token for all `ajax` methods.

Here's the data mapper:

```ts
const dataMapper = <Data extends { _id: string }>(data: Data[]) =>
  data.map((item) => ({
    ...item,
    id: item._id,
  }));

export default dataMapper;
```

We can then consume `getCharacters` in an Epic:

```ts
export const getCharactersEpic: Epic = (action$) =>
  action$.pipe(
    ofType(CharacterActionType.GET_CHARACTERS),
    switchMap(getCharacters),
    // this is plain redux action which takes an array of Characters
    map(setCharactersAction)
  );
```