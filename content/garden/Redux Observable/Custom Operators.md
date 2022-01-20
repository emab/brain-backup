# Custom Operators

Using custom operators in Epics can help to make them more readable, as well as helping with types.

For example, here's an Epic that gets some data and filters it by a given predicate:

```ts
type ReturnType = (string | number)[];

const isNumberReturn = (value: ReturnType): value is number[] =>
  value.some(v => !(typeof v !== 'number'));

const getDataEpic: Epic = (action$, state$) =>
  action$.pipe(
    ofType(ActionTypes.GET_DATA),
    fetchData('https://some-url.com/v2/endpoint'),
    filter(isNumberReturn),
    // at this point we know it's a number due to type guard
    map((numbers) => {
      return {
        type: ActionTypes.GET_DATA_SUCCESS,
        payload: numbers,
      };
    }),
  )
```

This is a simple example, but often you may have a chain of filters and maps applied to something.

What if we wanted to filter by numbers, perform some calculation on the numbers, and add them together and return that
value? If we did this a lot, we'd have to write a lot of code to do this.

Here's an example of how we can use custom operators to make this more readable:

```ts
import { Observable } from "rxjs"

type ReturnType = (string | number)[];

const isNumberReturn = (value: ReturnType): value is number[] =>
  value.some(v => !(typeof v !== 'number'));

const mapThenSum = (mapper: (number) => number) => (source: Observable<ReturnType>): Observable<number> =>
  source.pipe(
    filter(isNumberReturn),
    map(mapper),
    map((numbers) => numbers.reduce((a, b) => a + b, 0)),
  );

// use in epic
const getDataEpic: Epic = (action$, state$) =>
  action$.pipe(
    ofType(ActionTypes.GET_DATA),
    fetchData('https://some-url.com/v2/endpoint'),
    mapThenSum((n) => n * 2),
    map((total) => {
      return {
        type: ActionTypes.GET_DATA_SUCCESS,
        payload: total,
      };
    }),
  )
```

When used properly it helps make the code more testable and readable, as some Epics can be very long and complex.