# Redux Observable Setup

#rxjs #redux-observable #react

When setting up [Redux Observable](redux-observable.js.org), it's really important to get the global error handler. I often forget to do this, and it means that if an error from an epic bubbles up to the root epic, the entire stream terminates.

**This isn't good!**

If you're expecting errors to be thrown, it's good practice to catch and handle / log them when they occur, but errors can happen that you don't expect. The documentation recommends setting up a **global error handler** when setting up the middleware. It's right there in the docs, why do I always forget?!

Here's what you need to add to your root epic:

```ts
const rootEpic = (action$, store$, dependencies) =>
  combineEpics(...epics)(action$, store$, dependencies).pipe(
    catchError((error, source) => {
      console.error(error);
      return source;
    })
  );
  ```
  