(() => {
	window.VueKeyboard = Vue.component('keyboard', {
		template: (() => {
			// For this to work correctly, the delimiters need to be changed before the component is
			// registered on the page.
			const a =  Vue.config.delimiters[0];
			const b =  Vue.config.delimiters[1];

			return '<div class="keyboard"><div v-for="row in renderChars()"><button v-for="btn in row" :class="btn.class" @click="btn.action">' + a + ' btn.value ' + b + '</button></div></div>';
		})(),

		props: {
			chars: {
				type: String,
				required: true
			},
			value: {
				type: String,
				default: ''
			}
		},

		methods: {
			renderChars() {
				let lines = this.chars.split('|');

				return lines.map((chars) => {
					let stream = chars.split('');
					let buttons = [];
					let token = null;

					stream.forEach((char) => {
						if (char === '{') {
							token = '';
						} else if (char === '}') {
							let command = token.split(':');
							let text = command.length > 1 ? command[0] : '';
							let action = command.length > 1 ? command[1] : command[0];
							let method = null;

							if (this.hasOwnProperty(action)) {
								method = this[action].bind(this);
							} else {
								method = this.$dispatch.bind(this, action, this);
							}

							buttons.push({
								class: 'action-' + action.replace(/\s+/g, '-').toLowerCase(),
								action: method,
								value: text
							});
							
							token = null;
						} else {
							if (token !== null) {
								token += char;
							} else {
								buttons.push({
									class: 'char-' + char,
									action: this.append.bind(this, char),
									value: char
								});
							}
						}
					});

					return buttons;
				});
			},

			mutate(value) {
				this.value = value;
				this.$dispatch('mutate', this);
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

			clear() {
				this.mutate('');
			}
		}
	});
})();