# Java Maps

Common implementations: **HashMap**, **LinkedHashMap**, **TreeMap**

An object that maps keys to maps.

## Basic methods

### `put(K key, V value) : V`

Associates specified key with specified value in this map.

### `get(K key) : V`

Returns the value to which the key is mapped, or `null` if there is no mapping.

### `remove(K key) : V`

Removes the mapping from this map if it is present. Returns the value or `null` if it wasn't present.

### `remove(K key, V value) : boolean`

Removes the mapping from this map only if it is mapped to the specified value.

### `replace(K key, V value) : V`

Replaces the mapping at the key if it is mapped to some value (including a `null` value).

Returns the previously assigned value, or `null` if it does not exist.

### `replace(K key, V oldValue, V newValue) : boolean`

Replaces the mapping at the key with `newValue` if it is currently mapped to `oldValue`.

Returns `true` if the value was replaced.

### `clear() : void`

Removes all mappings from the map.

### `containsKey(K key) : boolean`

Returns `true` if map contains specified key.

### `containsValue(K value) : boolean`

Returns `true` if map maps one or more keys to the specified value.

### `entrySet() : Set<Map.Entry<K,V>>`

Returns a `Set` of mappings.

### `keySet() : Set<K>`

Returns a set of the key values.

### `values() : Collection<V>`

Returns a `Collection` of the values contained in the map.

### `isEmpty() : boolean`

Returns `true` if the map contains no key-value mappings.

## Useful methods

### `getOrDefault(K key, V defaultValue) : V`

Returns the value to which the key is mapped, or `defaultValue` if there is no mapping.

```java
Map<String, Integer> freqMap = new HashMap<>();

// will place 1 at "a" with zero as a default value
freqMap.put("a", freqMap.getOrDefault("a", 0) + 1);
```

### `compute(K key, Function(K key, V value) : V) : V`

Computes mapping for specified key and its currently mapped value. If there is no mapping, `value` is mapped to `null`.

Returns the computed value.

```java
Map<String, Integer> intMap = new HashMap<>();

// will place 1 at key "a"
intMap.compute("a", (key, value) -> value == null ? 1 : value + 1);

// will place 2 at key "a"
intMap.compute("a", (key, value) -> value == null ? 1 : value + 1);
```

### `computeIfAbsent(K key, Function(K key) : V) : V`

If the specified key is not associated with a value (or is `null`) it will compute value using mapping function and enter into the map.

Returns the computed value.

```java
Map<String, Integer> intMap = new HashMap<>();

// will place 1 at key "a" and return 1
intMap.computeIfAbsent("a", (key) -> 1);

// will not change the value at "a" and return 1
intMap.computeIfAbsent("a", (key) -> 5);
```

### `computeIfPresent(K key, Function(K key, V value) : V) : V`

If the specified key is present and non-null, it will compute the new value using the mapping function (unless the mapping function returns `null`).

Returns the computed value;

```java
Map<String, Integer> intMap = new HashMap<>();

// will do nothing
intMap.computeIfPresent("a", (key, value) -> 1);

intMap.put("a", 5);

// will change value at key "a" to 10 and return 10
intMap.computeIfAbsent("a", (key, value) -> value + 5);
```

