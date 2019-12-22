function n(num) {
	return Decimal(num.array ? num.array : num);
}

function d(dim) {
	return new Dimension(dim.dim, dim.bought, dim.amount);
}

Vue.component('flexbox', {
	template: '<div class="flexbox" style="display: flex; flex-wrap: wrap;"><div style="display: inline-block;"><slot></slot></div></div>'
})

Vue.component('popup', {
	props: ['text', 'color'],
	template: '<div class="popup" v-bind:style="{backgroundColor: color}">{{ text }}</div>'
})

class Popup {
	constructor(text, color) {
		this.text = text;
		this.color = color;
		
		app.popups.push(this);
		setTimeout(() => {app.popups.splice(this.key, 1)}, 2000);
	}
	
	get key() {
		return app.popups.indexOf(this);
	}
}

document.onkeydown = function(e) {
	app.keys[e.keyCode] = true;
}

document.onkeyup = function(e) {
	app.keys[e.keyCode] = false;
}