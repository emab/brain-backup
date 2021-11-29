# Event Listener Handler Map React

A nice way of creating a map of `EventListener` events and handlers for a react component.

In this example, it includes the input element which the events come from:

```ts
type InputListeners = {
    [eventType in keyof Parial<WindowEventMap>]: (
        input: HTMLInputElement
    ) => {
        handler: (event: WIndowEventMap[eventType]) => void;
    };
};

// usage

const listeners: InputListeners = {
    keydown: (input) => ({
        // event will be infered as KeyboardEvent
        handler: (event) => {
            if (e.key === 'Escape') {
                input.blur();
            }
        }
    })
}
```