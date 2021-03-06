# Space Complexity

See also: [[Time Complexity]]

Similarly to time complexity, space complexity describes the amount of memory space required by an algorithm to solve a given problem.

## Constant space

A constant space ( $O(1)$ ) algorithm uses the same amount of memory no matter what the input size is.

```
sum (int a, int b)
    return a + b;
```

In this example, three variables are used and allocated in memory (3 int values). Therefore, this algorithm will take 12 bytes of memory to complete. No matter what inputs are used, this will always be the case, hence a constant space is used.

## Linear space

Linear space ( $O(n)$ ) algorithms use a linear amount of memory in relation to the input.

```
sumArray (int[] arr)
    int size = array.length;
    int sum = 0;

    for (int i = 0; i < size; i++) do
        sum += array[i];
    
    return sum;
```

In this example we have 4 variables:

- **arr**: an array - $4 * n$ bytes, where $n$ is the length of the array
- **size**: int - 4 bytes
- **sum**: int - 4 bytes
- **iterator**: int - 4 bytes

This gives us a total of $4n + 4 + 4 + 4$ . This therefore gives us the value $O(n)$ . 
