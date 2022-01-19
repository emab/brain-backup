# Union Array to Array Union
I didn't come up with this one, but it was used on a project and was useful at some point.

```ts
type A = string[] | number[] | object[]
type Unioniser<T extends Array<unknown>> = T[number][];
type B = Unioniser<A>
// type B = (string | number | object)[]
```