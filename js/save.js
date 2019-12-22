function save(source = 'auto') {
	localStorage.setItem('mtheorysave', btoa(JSON.stringify(app.$data)));
	new Popup('Game Saved', 'yellow');
	if (source == 'auto' && app.autosave) setTimeout(save, parseFloat(app.autosaveintv) * 1000);
}

function load() {
	if (localStorage.getItem('mtheorysave') != null) {
		let save = JSON.parse(atob(localStorage.getItem('mtheorysave')));
		app.antimatter = n(save.antimatter || 0);
		for (let i = 0; i < 11; i++) {
			app.dimensions[i] = d(save.dimensions[i]);
		}
		for (let i in save.achievements) {
			app.achievements[i].unlocked = save.achievements[i].unlocked;
		}
		app.dimshifts = n(save.dimshifts || 0);
		app.galaxies = n(save.galaxies || 0);
		app.autosave = save.autosave || true;
		app.autosaveintv = save.autosaveintv || '10';
		app.date = save.date || new Date();
		app.tickbuys = n(save.tickbuys || 0);
	}
}

function wipe() {
	app.antimatter = Decimal(10);
	app.dimensions = [
		new Dimension(0),
		new Dimension(1),
		new Dimension(2),
		new Dimension(3),
		new Dimension(4),
		new Dimension(5),
		new Dimension(6),
		new Dimension(7),
		new Dimension(8),
		new Dimension(9),
		new Dimension(10)
	];
	app.achievements = [
		new Achievement(0, false, 'Gotta start somewhere', '', () => app.dimensions[0].amount.gt(0)),
		new Achievement(1, false, '100 Antimatter is a lot', '', () => app.dimensions[1].amount.gt(0)),
		new Achievement(2, false, 'asd', '', () => {}),
		new Achievement(3, false, 'asd', '', () => {}),
		new Achievement(4, false, 'asd', '', () => {}),
		new Achievement(5, false, 'asd', '', () => {}),
		new Achievement(6, false, 'asd', '', () => {}),
		new Achievement(7, false, 'asd', '', () => {}),
		new Achievement(8, false, 'asd', '', () => {}),
		new Achievement(9, false, 'asd', '', () => {}),
		new Achievement(10, false, 'asd', '', () => {}),
		new Achievement(11, false, 'asd', '', () => {}),
		new Achievement(12, false, 'asd', '', () => {}),
		new Achievement(13, false, 'asd', '', () => {}),
		new Achievement(14, false, 'asd', '', () => {}),
		new Achievement(15, false, 'asd', '', () => {})
	];
	app.dimshifts = Decimal(0);
	app.date = new Date();
	app.tickbuys = Decimal(0);
	save();
}