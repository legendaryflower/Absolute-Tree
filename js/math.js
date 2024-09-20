/* INSPIRED BY DILATION, VACCINATION & OTHER MATH FUNCTIONS FROM PLAGUE TREE (VORONA CIRUS TREE) */
/* CREDIT TO VORONA */

function powExp(n, exp){ // Hatsune
	n = new Decimal(n)
	exp = new Decimal(exp)
	if (n.lt(10)) return n
	return Decimal.pow(10,n.log10().pow(exp))
}

function powSlog(n, exp){ // Unhatsune
	n = new Decimal(n)
	exp = new Decimal(exp)
	if (n.lt(10)) return n
	return tet10(slog(n).pow(exp))
}

function slog(n){
	n = new Decimal(n)
	return Decimal.add(n.layer,new Decimal(n.mag).slog())
}

function tet10(n){
	n = new Decimal(n)
	return Decimal.tetrate(10,n)
}