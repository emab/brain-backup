# Java Primitives

Sourced from [Orcacle docs](https://docs.oracle.com/javase/tutorial/java/nutsandbolts/datatypes.html)

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

## Default values

| Data Type | Default value |
|-----------|---------------|
| byte	| `0` |
| short |	`0` |
| int |	`0` |
| long |	`0L` |
| float |	`0.0f` |
| double | `0.0d` |
| char | `\u0000` |
| String (or any object) | 	`null` |
| boolean |	`false` |

## Character and String Literals

May contain any Unicode characters. Always `'` for `char` and `"` for `String` types.

The Java programming language also supports a few special escape sequences for char and String literals: `\b` (backspace), `\t` (tab), `\n` (line feed), `\f` (form feed), `\r` (carriage return), `\"` (double quote), `\'` (single quote), and `\\` (backslash).

Also a `null` literal, which can be used as a value for any reference type. 

Also a `class` literal, which is formed by taking a type name and appending `.class`, for example `String.class` refers to the object that represents the type.

## Integer Literals
An integer literal is of type long if it ends with the letter L or l; otherwise it is of type int. It is recommended that you use the upper case letter L because the lower case letter l is hard to distinguish from the digit 1.

Values of the integral types byte, short, int, and long can be created from int literals. Values of type long that exceed the range of int can be created from long literals. Integer literals can be expressed by these number systems:

Decimal: Base 10, whose digits consists of the numbers 0 through 9; this is the number system you use every day
Hexadecimal: Base 16, whose digits consist of the numbers 0 through 9 and the letters A through F
Binary: Base 2, whose digits consists of the numbers 0 and 1 (you can create binary literals in Java SE 7 and later)
For general-purpose programming, the decimal system is likely to be the only number system you'll ever use. However, if you need to use another number system, the following example shows the correct syntax. The prefix 0x indicates hexadecimal and 0b indicates binary:

```java
// The number 26, in decimal
int decVal = 26;
//  The number 26, in hexadecimal
int hexVal = 0x1a;
// The number 26, in binary
int binVal = 0b11010;
```

## Floating-Point Literals
A floating-point literal is of type float if it ends with the letter F or f; otherwise its type is double and it can optionally end with the letter D or d.

The floating point types (float and double) can also be expressed using E or e (for scientific notation), F or f (32-bit float literal) and D or d (64-bit double literal; this is the default and by convention is omitted).

```java
double d1 = 123.4;
// same value as d1, but in scientific notation
double d2 = 1.234e2;
float f1  = 123.4f;
```

## Underscore Characters

In Java SE 7+ you can use any number of `_` characters between digits to improve readability:

```java
long creditCardNumber = 1234_5678_9012_3456L;
long socialSecurityNumber = 999_99_9999L;
float pi =  3.14_15F;
long hexBytes = 0xFF_EC_DE_5E;
long hexWords = 0xCAFE_BABE;
long maxLong = 0x7fff_ffff_ffff_ffffL;
byte nybbles = 0b0010_0101;
long bytes = 0b11010010_01101001_10010100_10010010;
```