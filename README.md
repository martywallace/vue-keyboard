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