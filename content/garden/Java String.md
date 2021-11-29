# Java String

Is not a primitive type, but is sometimes treated as such in Java as the language provides some special support out of the box. Strings can be created using `"` around characters.

Strings are constant - their value cannot be changed after they are created.

```java
String str = "abc";
```

is equivalent to:

```java
char data[] = {'a', 'b', 'c'};
String str = new String(data);
```

Here are some more examples of how strings can be used:

```java
System.out.println("abc");
String cde = "cde";
System.out.println("abc" + cde);
String c = "abc".substring(2,3);
```

## Useful methods

### `indexOf`

Multiple versions of this method, but can be useful for code wars style questions when working with strings.

Both of these methods also allow you to supply a second argument `int fromIndex` to specify the start point of the search.

#### `indexOf(String str) : int`

Returns the index of the substring `str` within the string.

#### `indexOf(int ch) : int`

Returns the index of the first occurrence of `ch` in the String, returns `-1` if it doesn't exist. 


### `lastIndexOf`

Similarly to the method above, but returns the last index of a substring or character within a string. This is useful when you want to check if a substring / character only appears in the string once:

```java
boolean appearsOnce(String str, char ch) {
    return str.indexOf(ch) == str.lastIndexOf(ch);
}
```

Can also use `int fromIndex` to specify a certain index to search from.



