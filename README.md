# vue-keyboard

A virtual keyboard for Vue 2.

## Install:

```
$ npm install --save vue-keyboard
```

## Resources:

* [Guide](https://martywallace.com/projects/vue-keyboard/guide).
* [Demo](http://vue-keyboard.martywallace.com).

## Usage:

```
<keyboard layouts="abc123|xyz456|{space:space}"></keyboard>
```

Each layout accepts a pipe `|` delimited string of characters to use as the keyboard buttons. You can include special function characters with the `{text:action}` syntax, where `text` is the text that will be rendered in the button and `action` is the action within the keyboard component to be called when that button is pressed. The inbuilt actions are:

* `backspace` - Remove one character from the end of the current value.
* `space` - Insert one whitespace character.
* `clear` - Clear the entire input value.
* `goto:n` - Go to a new keyboard layout, replacing `n` with the index of the layout to load.

If the `action` does not match any of these inbuilt actions, an event will be dispatched by the keyboard component instead, using the action name as the event name. The keyboard component will be provided to the listener as the first argument.

> Note: You can simply use `{action}` which will create a button with no text content. This is useful for things like `space` which you may just want to render as a wide empty button.

You can use the pipe `|`, open curly brace `{` or close curly brace `}` characters in your keyboard by doubling up, e.g.

    <keyboard layouts="||{{}}"></keyboard>

Will output a keyboard with the characters `|{}`.

## Props:

<table>
	<thead>
		<tr>
			<th>Prop</th>
			<th>Type</th>
			<th>Description</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td><code>layouts</code></td>
			<td><code>string|string[]</code></td>
			<td>One or more keyboard layouts, explained above.</td>
		</tr>
		<tr>
			<td><code>maxlength</code></td>
			<td><code>number</code></td>
			<td>The maximum input length.</td>
		</tr>
		<tr>
			<td><code>pattern</code></td>
			<td><code>string</code></td>
			<td>A regex pattern to apply to the keyboard value. If provided, an invalid match will add the <code>invalid</code> class to the keyboard component. If not provided or if the value matches, the <code>valid</code> class is added.</td>
		</tr>
	</tbody>
</table>


## Example:

Here is an example application containing a `keyboard` component:

JavaScript:

```
import Vue from 'vue';
import keyboard from 'vue-keyboard';

new Vue({
	el: '#app',
	components: { keyboard },

	data: {
		input: '',
	},

	methods: {
		changed(value) {
			console.log('Value ' + value);
		},

		custom(keyboard) {
			console.log(keyboard.value);
		}
	}
});
```

Markup:

```
<keyboard
	v-model="input"
	@custom="custom"
	@input="changed"
	:layouts="[
		'1234567890{delete:backspace}|qwertyuiop|asdfghjkl|{shift:goto:1}zxcvbnm|{space:space}{custom:custom}',
		'!@#$%^&*(){delete:backspace}|QWERTYUIOP|ASDFGHJKL|{shift:goto:0}ZXCVBNM|{space:space}{custom:custom}'
	]"
	:maxlength="16"
></keyboard>
```

This keeps the `input` value in the main application in sync with the value of the keyboard, limits that value to 16 characters and triggers the 'custom' function in the main application when the "custom" button in the keyboard is clicked.