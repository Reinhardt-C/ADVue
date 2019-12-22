let Decimal = OmegaNum;

let app = new Vue({
	el: '#app',
	data: {
		tab: 0,
		antimatter: Decimal(10),
		totalAntimatter: Decimal(10),
		dispAntimatter: '',
		dispTotalAntimatter: '',
		dimensions: [
			new Dimension(0),
			new Dimension(1),
			new Dimension(2),
			new Dimension(3),
			new Dimension(4),
			new Dimension(5),
			new Dimension(6),
			new Dimension(7))
		],
		tickbuys: Decimal(0),
		dimshifts: Decimal(0),
		galaxies: Decimal(0),
		aps: Decimal(0),
		notation: 'sci',
		autosave: true,
		autosaveintv: '10',
		achievements: [
			new Achievement(0, false, 'Gotta start somewhere', '', () => app.dimensions[0].amount.gt(0)),
			new Achievement(1, false, '100 Antimatter is a lot', '', () => app.dimensions[1].amount.gt(0)),
			new Achievement(2, false, 'Half Life 3 CONFIRMED', '', () => app.dimensions[2].amount.gt(0)),
			new Achievement(3, false, 'L4D: Left 4 Dimensions', '', () => app.dimensions[3].amount.gt(0)),
			new Achievement(4, false, '5 Dimension Antimatter Punch', '', () => app.dimensions[4].amount.gt(0)),
			new Achievement(5, false, 'We couldn\'t afford 9', '', () => app.dimensions[5].amount.gt(0)),
			new Achievement(6, false, 'Not a luck related achievement', '', () => app.dimensions[6].amount.gt(0)),
			new Achievement(7, false, 'pi/2 to infinity', '', () => app.dimensions[7].amount.gt(0))
		],
		popups: [],
		keys: []
	},
	methods: {
		tabTo: function(which) {this.tab = which},
		toggleas: function() {
			this.autosave = !this.autosave;
			save();
		},
		f: (num, pres = 0) => f(num, pres),
		sob: function() {return (this.dimshifts.lt(4) ? 'Shift' : 'Boost')},
		shiftButton: function() {return (this.dimshifts.lt(4) ? 'Reset the game for a new dimension' : 'Reset the game for a boost')},
		shiftCost: function() {
			if (app.dimshifts.lt(5)) return [n(20), app.dimshifts.toNumber() + 3];
			else return [n(20).add(Decimal.mul(15, app.dimshifts.sub(4))), 7];
		},
		canShift: function() {return this.dimensions[this.shiftCost()[1]].amount.gte(this.shiftCost()[0])},
		shift: function() {
			if (this.canShift()) {
				this.antimatter = Decimal(10);
				this.tickbuys = Decimal(0);
				for (let i = 0; i < 11; i++) {
					this.dimensions[i] = new Dimension(i);
				}
				this.dimshifts = this.dimshifts.add(1);
			}
		},
		achUnlocked: function() {
			let count = 0;
			for (let i of this.achievements) if (i.unlocked) count++;
			return count;
		},
		tps: function() {return Decimal.pow(this.tickDecrement().rec(), this.tickbuys)},
		tickcost: function() {return Decimal.pow(10, this.tickbuys.add(2))},
		canBuyTick: function() {return this.antimatter.gte(this.tickcost())},
		buyTick: function() {
			if (this.canBuyTick()) {
				this.antimatter = this.antimatter.sub(this.tickcost());
				this.tickbuys = this.tickbuys.add(1);
			}	
		},
		buyMaxTick: function() {
			let amount = Decimal.affordGeometricSeries(this.antimatter, 100, 10, this.tickbuys);
			let price = Decimal.sumGeometricSeries(amount, 100, 10, this.tickbuys);
			this.tickbuys = this.tickbuys.add(amount);
			this.antimatter = this.antimatter.sub(price);
		},
		achBonus: function() {
			return Decimal.pow(2, Math.floor(this.achUnlocked() / 8));
		},
		maxAll: function() {
			for (let i of this.dimensions) i.buyUntil10();
			this.buyMaxTick();
		},
		galaxycost: function() {
			return n(80).add(this.galaxies.mul(60));
		},
		canGalaxy: function() {
			return this.dimensions[7].amount.gte(this.galaxycost());
		},
		galaxy: function() {
			if (this.canGalaxy()) {
				this.antimatter = Decimal(10);
				this.tickbuys = Decimal(0);
				for (let i = 0; i < 11; i++) {
					this.dimensions[i] = new Dimension(i);
				}
				this.dimshifts = Decimal(0);
				this.galaxies = this.galaxies.add(1);
			}
		},
		tickDecrement: function() {
			if (this.galaxies.eq(0)) return Decimal(0.89);
			return Decimal(0.9).sub(this.galaxies.mul(0.02));
		}
	}
})

function init() {
	load();
	save();
	setInterval(loop, 50);
}

function loop() {
	for (let i in app.dimensions) {
		if (i == 0) {
			app.antimatter = app.antimatter.add(app.dimensions[i].production);
			app.totalAntimatter = app.totalAntimatter.add(app.dimensions[i].production);
		}
		else app.dimensions[i - 1].amount = app.dimensions[i - 1].amount.add(app.dimensions[i].production);
	}
	for (let i of app.achievements) i.update();
	app.dispAntimatter = f(app.antimatter);
	app.dispTotalAntimatter = f(app.totalAntimatter);
	app.aps = f(app.dimensions[0].production.mul(20));
	if (app.keys[77]) app.maxAll();
}