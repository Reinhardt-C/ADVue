function f(num, pres = 1) {
  return N[app.notation](num, pres);
}

let N = {};

N.sci = function(num, pres) {
  let x = new OmegaNum(num);
  let a = x.array;
  let l = a.length;
  
  if (l == 1) {
    if (x.lt(1e6)) {
      return x.toNumber().toFixed(pres).toString();
    } else {
	return x.toNumber().toExponential(pres).toString().replace(/[+-]/g, '');
    }
  } else if (l == 2 && a[1] < 14) {
    if (x.log10().lt(1e6)) {
      return Math.pow(10, a[0] % 1).toFixed(pres).toString() + 'e' + x.log10().floor().toString()
    } else {
      return 'e' + N.sci(x.log10().floor());
    } 
  } else {
    return num.toString();
  }
}