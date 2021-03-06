# Time Complexity

See also: [[Space Complexity]]

Describes the amount of computer time it takes to run an algorithm. It is usually estimated by counting the number of elementary operations performed.

Since an algorithms running time may different depending on a certain input, you'd usually consider the **worst-case** time complexity i.e the **maximum** amount of time. Another option is to use **average-case** complexity.

Commonly expressed in **big O notation**: $O(n)$, $O(n \log n)$, $O(n ^a)$, $O(2^n)$, etc...

Complexities are classified according to the big O notation, for example an algorithm with time complexity is a **linear time algorithm**.

## Constant time

An algorithm is constant time ($O(1)$) if the computer time does not depend on the size of the input. For example, accessing a single element in an array takes constant time as only one operation is performed to locate it. Similarly, finding the smallest value in a **sorted** array also takes $O(n)$ time as we know it is the first element.

Despite being called constant time, the time doesn't have to be completely independent of problem size - but the upper bound running time has to be bounded independently of the problem size.

```
int index = 5;
int item = list[index];
if (condition true) then
    perform some operation that runs in constant time
else
    perform some other operation that runs in constant time
for i = 1 to 100
    for j = 1 to 200
        perform some operation that runs in constant time
```
*[Source](https://en.wikipedia.org/wiki/Time_complexity)*

## Logarithmic time

An algorithm takes logarithmic time when its big O notation is $O(\log n)$. Algorithms that take logarithmic time are considered to be highly efficient as the ratio of operations to the size of input decreases as $n$ increases.

Examples of logarithmic algorithms are often found in operations on binary tress or when using binary search, since these algorithms do not need to access all elements in order to finish.

For example, a search for a number in a sorted list of numbers:

```
int searchNumber = 50;
boolean found = false;
int index = Math.floor(list.length / 2);

while (not found) then
    int nextIndex;
    if (list[index] equals searchNumber) then
        found = true
    else if (list[index] is greater than searchNumber) then
        nextIndex = Math.floor(index / 2)
    else if (list[index] is less than searchNumber) then
        nextIndex = index + Math.floor(index / 2);
    
    if (nextIndex equals index) then
        was not found

if (found) then
    return index
```

## Quadratic time

A quadratic algorithm has a big O notation of $O(n^2)$. Simple comparison based sorting algorithms are quadratic (e.g. insertion sort).

An example of searching for duplicate names in a string array:

```
for (i = 0; i < input length; i++) do
    String name = input[i];

    for (j = i + 1; j < input.length; j++) do
        if (name equals input[j]) then
            return true;

return false;
```

> There are $n-1$ iterations of the outer loop. On each iteration, the inner loop iterates $n-i-1$ times. So in total the inner loop iterates $n-1 + n-2 + ... + 1$ times. So the number of times that [the inner function] executes is equal to the sum of the numbers from 1 to n-1. That sum is $n*(n-1)/2$ , which is in $T(n^2)$ and thus also in $O(n^2)$ .
> 
> [*Source*](https://stackoverflow.com/questions/18459727/big-o-time-complexity-for-nested-j-i-1-loop)

## Exponential time

An example of an algorithm that has a big O of $O(2^n)$ is a recursive Fibonacci function:

```
fibbonaci(int x)
    if (x is less than or equal to 1) then
        return 0;
    if (x equals 2) then
        return 1;
    
    return fibbonacci(x - 1) + fibbonacci(x - 2);
```

