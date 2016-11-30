(() => {
	Vue.component('keyboard', {
		template: `<aside class="vue-keyboard" role="application" :class="{ full: full, empty: empty }" :data-value="value" :data-layout="layout">
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
		</aside>`,

		props: {
			layouts: {
				type: [String, Array],
				required: true
			},
			maxlength: {
				type: Number,
				default: 0,
				validator(value) { return value >= 0; }
			}
		},

		data() {
			return {
				value: '',
				layout: 0
			};
		},

		computed: {
			/**
			 * Whether or not the keyboard input has hit its maximum length.
			 * @returns {Boolean}
			 */
			full() {
				return this.value.length >= this.maxlength;
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
			}
		},

		methods: {
			/**
			 * Mutates the keyboard value to a new value.
			 * @param {String} value The new value.
			 */
			mutate(value) {
				this.value = value;

				if (this.maxlength > 0) {
					this.value = this.value.slice(0, this.maxlength);
				}

				this.$emit('input', this.value);
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
	});
})();