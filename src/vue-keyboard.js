(() => {
	window.VueKeyboard = Vue.component('keyboard', Vue.extend({
		template: '<div class="keyboard"><div v-for="row in renderChars()"><button v-for="char in row" :class="char.class" @click="char.action">{{ char.value }}</button></div></div>',

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
							let command = (/(\w+):(\w+)/g).exec(token);
							let action = null;

							if (this.hasOwnProperty(command[2])) {
								action = this[command[2]].bind(this);
							} else {
								action = this.$dispatch.bind(this, command[2], this);
							}

							buttons.push({
								class: 'action-' + command[2].replace(/\s+/g, '-').toLowerCase(),
								action: action,
								value: command[1]
							});
							
							token = null;
						} else {
							if (token !== null) {
								token += char;
							} else {
								buttons.push({
									action: this.append.bind(this, char),
									value: char
								});
							}
						}
					});

					return buttons;
				});
			},

			append(char) {
				this.value += char;
			},

			backspace() {
				this.value = this.value.slice(0, this.value.length - 1);
			},

			space() {
				this.value += ' ';
			},

			clear() {
				this.value = '';
			}
		}
	}));
})();