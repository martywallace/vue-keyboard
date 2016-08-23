(function() {
	window.Keyboard = Vue.component('keyboard', Vue.extend({
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
			renderChars: function() {
				var lines = this.chars.split('|');

				return lines.map(function(chars) {
					var stream = chars.split('');
					var buttons = [];
					var token = null;

					stream.forEach(function(char) {
						if (char === '{') {
							token = '';
						} else if (char === '}') {
							var command = (/(\w+):(\w+)/g).exec(token);

							buttons.push({
								class: 'special ' + command[1],
								action: this[command[2]].bind(this),
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
					}, this);

					return buttons;
				}, this);
			},

			append: function(char) {
				this.value += char;
			},

			backspace: function() {
				this.value = this.value.slice(0, this.value.length - 1);
			},

			space: function() {
				this.value += ' ';
			},

			clear: function() {
				this.value = '';
			}
		}
	}));
})();