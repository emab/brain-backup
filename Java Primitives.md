# Java Primitives

**Note**: *byte*, *short*, *int* and long are [two's compliment](https://en.wikipedia.org/wiki/Two%27s_complement) integers.

- **byte**: 8-bit signed  integer
  - minimum value of `-128` and a maximum value of `127`
  - useful in large arrays when saving memory matters, or for deliberately setting a limit on a value range
- **short**: 16-bit signed two's compliment integer
  - minimum value of `-32,768` and a maximum value of `32,767`
  - useful in large arrays when saving memory matters, or for deliberately setting a limit on a value range
- **int**: 32-bit signed integer (by default)
  - minimum value of `-2^31` and a maximum value of `2^31 -1`
  - can use as unsigned `2^32` int in Java SE 8+
- **long**: 64-bit signed integer (by default)
  - minimum value of `-2^63` and a maximum value of `2^63 -1`
  - can use as unsigned `2^64` long in Java SE 8+
  - only use if you're going to use numbers larger range of int
- **float**: [single-precision](https://en.wikipedia.org/wiki/Single-precision_floating-point_format) 32-bit floating point
  - use if you need to save memory in a large array, otherwise use double
  - should **never** be used for precise values such as currency, use BigDecimal instead
- **double**: [double-precision](https://en.wikipedia.org/wiki/Double-precision_floating-point_format) 64-bit floating point
  - generally the default choice for decimal values
  - should **never** be used for precise values such as currency, use BigDecimal instead
- **boolean**: two possible values: `true` and `false`
- **char**: single 16-bit Unicode character
  -  minimum value of `\u0000` (or `0`) and a maximum value of `\uffff` (or `65,535` inclusive)

In addition to the 8 primitives above, Java also provides special support for character strings via the `java.lang.String` class. Enclosing a string in double quotes `"` will automatically create a new `String` object, whereas single quotes `'` create a `char` type. A `String` is **immutable**.