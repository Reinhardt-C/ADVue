Vue.component('dim', {
	props: ['dimension', 'mult'],
	template: `<table>
		<tr v-if='dimension.unlocked()'>
			<td class='dt1'>{{ dimension.ordinal }} Dimension &times;{{ mult }}</td>
			<td class='dt2'>{{ dimension.dispAmount }} ({{ dimension.step }})</td>
			<td class='dt3'><button class='styledButton buy1' v-on:click='dimension.buy()' v-bind:class='{bgreen: dimension.canAfford, bred: !dimension.canAfford}'>Cost: {{ dimension.dispPrice }}</button> <button class='styledButton buy2' v-on:click='dimension.buyUntil10()' v-bind:class='{bgreen: dimension.canAffordTill10, bred: !dimension.canAffordTill10}'>Until 10: {{ dimension.dispPT10 }}</button></td>
		</tr>
	</table>`
})

const PRICES = [10, 100, 10000, 1e6, 1e9, 1e13, 1e18, 1e24];
const INCREASE = [1000, 10000, 1e5, 1e6, 1e8, 1e10, 1e12, 1e15];

class Dimension {
	constructor(dim, bought = 0, amount = 0) {
		this.dim = dim;
		this.bought = Decimal(bought);
		this.amount = Decimal(amount);
	}
	
	unlocked() {
		if (this.dim == 0) return true;
		else return this.dim < 8 && app.$data.dimshifts.gt(this.dim - 4);
	}
	
	get mult() {
		if (app.dimshifts) return Decimal.pow(2, this.bought.div(10).floor().add(app.dimshifts.sub(this.dim).max(0)));
		return Decimal(1);
	}
	
	get dispMult() {
		return f(this.mult);
	}
	
	get dispAmount() {
		return f(this.amount, 0);
	}
	
	get step() {
		return this.bought.mod(10).toNumber();
	}
	
	get ordinal() {
		return ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth', 'Ninth', 'Tenth', 'Eleventh'][this.dim];
	}
	
	get price() {
		return Decimal.mul(PRICES[this.dim], Decimal(INCREASE[this.dim]).pow(this.bought.div(10).floor()));
	}
	
	get dispPrice() {
		return f(this.price, 0);
	}
	
	get priceTill10() {
		let q = 10 - this.step;
		return this.price.mul(q);
	}
	
	get dispPT10() {
		return f(this.priceTill10, 0);
	}
	
	get canAfford() {
		return app.antimatter.gte(this.price);
	}
	
	get canAffordTill10() {
		return app.antimatter.gte(this.priceTill10);
	}
	
	get production() {
		return this.amount.mul(this.mult).mul(app.tps()).div(20).mul(app.achBonus());
	}
	
	buy() {
		if (this.canAfford && this.unlocked()) {
			app.antimatter = app.antimatter.sub(this.price);
			this.bought = this.bought.add(1);
			this.amount = this.amount.add(1);
		}
	}
	
	buyUntil10() {
		if (this.canAffordTill10 && this.unlocked()) {
			app.antimatter = app.antimatter.sub(this.priceTill10);
			this.amount = this.amount.add(10 - this.step);
			this.bought = this.bought.add(10 - this.step);
		}
	}
}