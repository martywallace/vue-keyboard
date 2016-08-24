# vue-keyboard

A simple virtual keyboard for Vue.js.

## Install:

This component is available through [Bower](https://bower.io/search/?q=vue-keyboard):

    $ bower install --save vue-keyboard

## Usage:

Simply add the `keyboard` component to your Vue application:

```
<keyboard chars="abc123|xyz456|{space:space}"></keyboard>
```

The `chars` property accepts a pipe `|` delimited string of characters to use as the keyboard buttons. You can include special function characters with the `{text:action}` syntax, where `text` is the text that will be rendered in the button and `action` is the action within the keyboard component to be called when that button is pressed. The inbuilt actions are:

* `backspace` - Remove one character from the end of the current value.
* `space` - Insert one whitespace character.
* `clear` - Clear the entire input value.

If the `action` does not match any of these inbuilt actions, an event will be dispatched by the keyboard component instead, using the action name as the event name. The keyboard component will be provided to the listener as the first argument.

> Note: You can simply use `{action}` which will create a button with no text content. This is useful for things like `space` which you may just want to render as a wide empty button.

## Interacting:

In regards to styling and interacting with the component, there are several routes:

* Buttons rendered with the `{text:action}` syntax will include a class name `action-x` where `x` is the name of the action e.g. `action-clear`.
* General buttons will include a class name `char-x` where `x` is the text content e.g. `char-a`, `char-b`.
* A `mutate` event is dispatched by the component whenever the `value` changes. The keyboard component will be provided to the listener as the first argument.
* You can use `:value.sync="x"` to sync the keyboard value with a value in the parent Vue instance.

## Example:

Here is an example application containing a `keyboard` component:

JavaScript:

```
var app = new Vue({
	el: 'body',
	data: {
		input: ''
	},
	events: {
		mutate: function(keyboard) {
			// Limit to 16 chars.
			keyboard.value = keyboard.value.slice(0, 16);
		},
		custom: function(keyboard) {
			console.log('Custom button pressed. The current value is ' + keyboard.value);
		}
	}
});
```

Markup:

```
<keyboard chars="qwertyuiop{backspace:backspace}|asdfghjkl|zxcvbnm|{space:space}{custom:custom}" :value.sync="input"></keyboard>
```

This keeps the `input` value in the main application in sync with the value of the keyboard, limits that value to 16 characters and triggers the 'custom' function in the main application when the "custom" button in the keyboard is clicked.