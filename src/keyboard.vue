<script>
	export default {
		name: 'keyboard',
		
		props: {
			value: {
				type: String,
				default: ''
			},
			layouts: {
				type: [String, Array],
				required: true
			},
			maxlength: {
				type: Number,
				default: 0,
				validator(value) { return value >= 0; }
			},
			pattern: {
				type: String,
				default: null
			}
		},

		data() {
			return {
				layout: 0
			};
		},

		computed: {
			/**
			 * Whether or not the keyboard input has hit its maximum length.
			 * @returns {Boolean}
			 */
			full() {
				return this.maxlength > 0 && this.value.length >= this.maxlength;
			},

			/**
			 * Whether or not the keyboard input is empty.
			 * @return {Boolean}
			 */
			empty() {
				return this.value.length === 0;
			},

			/**
			 * Returns an array of buttons to render in the component.
			 * @returns {Array[]}
			 */
			buttons() {
				let lines = (Array.isArray(this.layouts) ? this.layouts : [this.layouts])[this.layout].split('|');

				return lines.map(chars => {
					let stream = chars.split('');
					let buttons = [];
					let token = null;

					stream.forEach(char => {
						if (char === '{') {
							token = '';
						} else if (char === '}') {
							let command = token.split(':');
							let text = command.length > 1 ? command[0] : '';
							let action = command.length > 1 ? command[1] : command[0];
							let args = command.length > 2 ? command[2] : null;
							let method = null;

							if (['append', 'backspace', 'space', 'clear', 'goto'].indexOf(action) >= 0) method = this[action].bind(this, args);
							else method = this.$emit.bind(this, action, this);

							buttons.push({
								type: 'action',
								action: { name: action.replace(/\s+/g, '-').toLowerCase(), callable: method },
								value: text,
								args: args
							});
							
							token = null;
						} else {
							if (token !== null) {
								token += char;
							} else {
								buttons.push({
									type: 'char',
									action: { name: null, callable: this.append.bind(this, char) },
									value: char,
									args: null
								});
							}
						}
					});

					return buttons;
				});
			},

			/**
			 * Whether or not the current value matches the regex provided to pattern. Always
			 * returns true if no pattern was provided.
			 * @returns {Boolean}
			 */
			valid() {
				return !this.pattern || this.value.match(new RegExp(this.pattern));
			}
		},

		methods: {
			/**
			 * Mutates the keyboard value to a new value.
			 * @param {String} value The new value.
			 */
			mutate(value) {
				if (this.maxlength > 0) {
					value = value.slice(0, this.maxlength);
				}

				this.$emit('input', value);
			},

			/**
			 * Appends a new value to the end of the current keyboard value.
			 * @param {String} char The character(s) to append.
			 */
			append(char) {
				this.mutate(this.value + char);
			},

			/**
			 * Remove the last character from the current keyboard value.
			 */
			backspace() {
				this.mutate(this.value.slice(0, this.value.length - 1));
			},

			/**
			 * Add one whitespace character to the current keyboard value.
			 */
			space() {
				this.append(' ');
			},

			/**
			 * Go to a new layout.
			 * @param {Number} The layout index.
			 */
			goto(layout) {
				if (Array.isArray(this.layouts)) {
					if (layout >= 0 && layout < this.layouts.length) {
						this.layout = layout;
					} else {
						throw new Error('The requested layout does not exist.');
					}
				} else {
					throw new Error('A single non-array layout was provided.');
				}
			},

			/**
			 * Clear the entire keyboard value.
			 */
			clear() {
				this.mutate('');
			}
		}
	}
</script>

<template>
	<aside class="vue-keyboard" role="application" :class="{ full: full, empty: empty, valid: valid, invalid: !valid }" :data-value="value" :data-layout="layout">
		<div role="row" class="row" v-for="row in buttons" :data-keys="row.length">
			<button
				v-for="btn in row"
				role="button"
				:class="btn.type"
				:data-args="btn.args"
				:data-text="btn.value"
				:data-action="btn.action.name"
				@click.prevent="btn.action.callable"
			>{{ btn.value }}</button>
		</div>
	</aside>
</template>

<style lang="scss" scoped>
	.vue-keyboard {
		.row {
			padding: 2px 0;
			text-align: center;
		}

		button {
			border: none;
			outline: none;
			padding: 8px 10px;
			min-width: 40px;
			margin: 0 2px;
			background: #EEE;
			color: #666;
			cursor: pointer;
			font-family: inherit;
			font-size: inherit;
			border-radius: 2px;

			&:hover {
				background: #E0E0E0;
			}

			&:active {
				background: #777;
				color: #FFF;
				box-shadow: inset 0 1px 4px rgba(#000, 0.1);
			}

			&[data-action="space"] {
				padding: 8px 60px;
			}
		}
	}
</style>