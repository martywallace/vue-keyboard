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

## Props:

The possible component properties are:

* `chars` - The character list (explained above).
* `maxlength` - The maximum length of `value`.

> Note: Because `maxlength` is a `Number` you must provide it with the Vue dynamic syntax e.g. `<keyboard :maxlength="10">` not `<keyboard maxlength="10">` (the latter will be interpreted as a `String`).

## Interacting:

In regards to styling and interacting with the component, there are several routes:

* Buttons rendered with the `{text:action}` syntax will include a class name `action-x` where `x` is the name of the action e.g. `action-clear`.
* General buttons will include a class name `char-x` where `x` is the text content e.g. `char-a`, `char-b`.
* You can use `v-model="input"` to sync the keyboard value with a value in the parent Vue instance (named `input` in this case).

## Example:

Here is an example application containing a `keyboard` component:

JavaScript:

```
var app = new Vue({
	el: 'main',
	data: {
		input: '',
		layouts: [
			'1234567890{delete:backspace}|qwertyuiop|asdfghjkl|{shift:goto:1}zxcvbnm|{space:space}{custom:custom}',
			'!@#$%^&*(){delete:backspace}|QWERTYUIOP|ASDFGHJKL|{shift:goto:0}ZXCVBNM|{space:space}{custom:custom}'
		]
	},
	methods: {
		changed: function(value) {
			console.log('Value ' + value);
		},

		custom: function(keyboard) {
			console.log(keyboard.value);
		}
	}
});
```

Markup:

```
<keyboard v-model="input" @input="change" @custom="custom" chars="qwertyuiop{backspace:backspace}|asdfghjkl|zxcvbnm|{space:space}{custom:custom}" :maxlength="16"></keyboard>
```

This keeps the `input` value in the main application in sync with the value of the keyboard, limits that value to 16 characters and triggers the 'custom' function in the main application when the "custom" button in the keyboard is clicked.