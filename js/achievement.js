Vue.component('achievement', {
	props: ['achievement'],
	template: `<div style='display: inline-block'><div class='achievement styledButton' v-bind:class='{bgreen: achievement.unlocked, bred: !achievement.unlocked}'>
		{{ achievement.name }}
	</div></div>`
})

class Achievement {
	constructor(id, unlocked, name, desc, isUnlocked) {
		this.id = id;
		this.unlocked = unlocked;
		this.name = name;
		this.desc = desc;
		this.isUnlocked = isUnlocked;
	}
	
	update() {
		if (!this.unlocked && this.isUnlocked()) {
			this.unlocked = true;
			new Popup(this.name, 'cyan');
		}
	}
}