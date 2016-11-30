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
					@click="btn.action.callable"
				>{{ btn.value }}</button>
			</div>
		</aside>`,

		props: {
			layouts: {
				type: Array,
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
			full() {
				return this.value.length >= this.maxlength;
			},

			empty() {
				return this.value.length === 0;
			},

			buttons() {
				let lines = this.layouts[this.layout].split('|');

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
			mutate(value) {
				this.value = value;

				if (this.maxlength > 0) {
					this.value = this.value.slice(0, this.maxlength);
				}

				this.$emit('input', this.value);
			},

			append(char) {
				this.mutate(this.value + char);
			},

			backspace() {
				this.mutate(this.value.slice(0, this.value.length - 1));
			},

			space() {
				this.append(' ');
			},

			goto(layout) {
				if (layout >= 0 && layout < this.layouts.length) {
					this.layout = layout;
				} else {
					throw new Error('The requested layout does not exist.');
				}
			},

			clear() {
				this.mutate('');
			}
		}
	});
})();