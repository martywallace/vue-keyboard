# vue-keyboard

A simple virtual keyboard for Vue.js.

## Usage:

Simply add the `keyboard` component to your Vue application:

```
<keyboard chars="abc123|xyz456|{space:space}"></keyboard>
```

The `chars` property accepts a pipe `|` delimited string of characters to use as the keyboard buttons. You can include special function characters with the `{text:action}` syntax, where `text` is the text that will be rendered in the button and `action` is the action within the keyboard component to be called when that button is pressed. The actions are:

* `backspace` - Remove one character from the end of the current value.
* `space` - Insert one whitespace character.
* `clear` - Clear the entire input value.

> If the `action` does not match any of these inbuilt actions, an event will be dispatched by the keyboard component instead, using the action name. The keyboard component will be provided to the listener as the first argument.

Buttons rendered with this syntax will include a class name `action-<x>` where `<x>` is the name of the action e.g. `action-clear`.