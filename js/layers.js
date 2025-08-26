addLayer("p", {
    name: "prestige", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#31aeb0",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "prestige points", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade("p",13)) mult = mult.times(upgradeEffect("p",13))
			        if (hasUpgrade("p",15)) mult = mult.times(upgradeEffect("p",15))

			if (hasUpgrade("g",11)) mult = mult.times(upgradeEffect("g",11))
							if (hasUpgrade("b",13)) mult = mult.times(upgradeEffect("b",13))

				if (hasUpgrade("g",13)) mult = mult.times(upgradeEffect("g",13))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
	doReset(resettingLayer) {
			let keep = [];
	
			if (hasMilestone("g",1)) keep.push("upgrades")
			if (layers[resettingLayer].row > this.row) layerDataReset("p", keep)
		},
    layerShown(){return player.l.tree == "jacorb";},
	passiveGeneration() {
		let passive = new Decimal(0)
		if (hasMilestone("g",1)) passive = passive.add(1)
		return passive;
	},
	softcap() {
 let softcap = new Decimal(1e9)
if (hasUpgrade("g",14))softcap = softcap.times(10)
 return softcap;
	},
	softcapPower() {
		let power = new Decimal(0.1)
		return power;
	},
    upgrades: {
		
			
			11: {
				title: "Prestige Boost",
				description: "Prestige Points boost Point generation.",
	cost() { return new Decimal(1) },
				effect() {
					
					
					let eff = player.p.points.plus(1).pow(0.5);
			      if (hasUpgrade("b",11)) eff = eff.times(upgradeEffect("b",11));
					
					return eff;
				},
	
					effectDisplay() { return format(tmp.p.upgrades[11].effect)+"x" },
			},
			12: {
				title: "Self-Synergy",
				description: "Points boost their own generation.",
				cost() { return new Decimal(5) },
				effect() { 
					let eff = player.points.plus(1).log10().pow(0.5).plus(1);
	
					return eff;
				},
				unlocked() { return hasUpgrade("p", 11) },
				effectDisplay() { return format(tmp.p.upgrades[12].effect)+"x" },
				
			},
            13: {
				title: "Reverse Prestige Boost",
				description: "Points boost Prestige Points gain.",
				cost() { return new Decimal(25) },
				effect() { 
					let eff = player.points.plus(1).pow(0.3);
	
					return eff;
				},
				unlocked() { return hasUpgrade("p", 12) },
				effectDisplay() { return format(tmp.p.upgrades[13].effect)+"x" },
				
			},
		14: {
				title: "Circular Synergy",
				description: "Prestige Points boost their own gain.",
				cost() { return new Decimal(50) },
				effect() { 
					let eff = player.p.points.plus(1).log10().pow(0.3).plus(1);
	
					return eff;
				},
				unlocked() { return hasUpgrade("p", 13) },
				effectDisplay() { return format(tmp.p.upgrades[14].effect)+"x" },
				
			},
		
        	15: {
				title: "Boosting Privileges",
				description: "Boosters boost Prestige points.",
				cost() { return new Decimal(150) },
				effect() { 
					let eff = player.b.points.plus(1)
	
					return eff;
				},
				unlocked() { return hasUpgrade("p", 14)&&player.b.unlocked  },
				effectDisplay() { return format(tmp.p.upgrades[15].effect)+"x" },
				
			},
				16: {
				title: "Boosting Trust",
				description: "Boosters boost points.",
				cost() { return new Decimal(800) },
				effect() { 
					let eff = player.b.points.plus(1).pow(2)
	
					return eff;
				},
				unlocked() { return hasUpgrade("p", 15)&&player.b.points.gte(2)  },
				effectDisplay() { return format(tmp.p.upgrades[16].effect)+"x" },
				
			},
			17: {
				title: "Upgrade Power",
				description: "Point gain is multipled based on your Prestige upgrades bought.",
				cost() { return new Decimal(1600) },
				effect() { 
					let eff = Decimal.pow(1.3, player.p.upgrades.length);
				
					return eff;
				},
				unlocked() { return hasUpgrade("p", 16)&&player.b.points.gte(3)  },
				effectDisplay() { return format(tmp.p.upgrades[17].effect)+"x" },
				
			},
		},
    
})

addLayer("b", {
    name: "booster", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "B", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#6e64c4",
    requires: new Decimal(200), // Can be a function that takes requirement increases into account
    resource: "boosters", // Name of prestige currency
    baseResource: "prestige points", // Name of resource prestige is based on
    baseAmount() {return player.p.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent() {
		let exp = new Decimal(1.5)

		if (hasUpgrade("b",23)) exp = exp.sub(0.3)
		return exp
	} , // Prestige currency exponent
    base: 2,
	canBuyMax() {return hasMilestone("b",0)},
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
     
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "B", description: "B: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return player.l.tree == "jacorb"&&hasAchievement("ach",13);},
   branches: ["p"],
   	
   addToBase() {
			let base = new Decimal(0);
		 if (hasUpgrade("g",12)) base = base.add(upgradeEffect("g",12))
					 if (hasUpgrade("b",15)) base = base.add(upgradeEffect("b",15))
			return base;
		},
		effectBase() {
			let base = new Decimal(2);
			
			// ADD
			base = base.plus(tmp.b.addToBase);
			
			// MULTIPLY
			
			return base.pow(tmp.b.power);
		},
		power() {
			let power = new Decimal(1);
			
			return power;
		},
		effect() {
			if (!player.b.unlocked) return new Decimal(1);
			return Decimal.pow(tmp.b.effectBase, player.b.points).max(0);
		},
		effectDescription() {
			return "which are boosting Point generation by "+format(tmp.b.effect)+"x."
		},

		  upgrades: {
		
			
			11: {
				title: "Prestige Combo",
				description: "Boosters multiply Prestige Boost effect.",
	cost() { return new Decimal(6) },
				effect() {
					
					
					let eff = player.b.points.plus(1).pow(0.1);
			
					
					return eff;
				},
	
					effectDisplay() { return format(tmp.b.upgrades[11].effect)+"x" },
					unlocked() {return hasUpgrade("b",11)||player.b.points.gte(6)}
			},
			12: {
				title: "Generative",
				description: "Unlock Generators.",
	cost() { return new Decimal(7) },
			
					unlocked() {return hasUpgrade("b",11)}
			},
			13: {
				title: "BP Combo",
				description: "Best Boosters boost Prestige Points gain.",
	cost() { return new Decimal(8) },
				effect() {
					
					
					let eff = player.b.best.plus(1).pow(0.5);
			
					
					return eff;
				},
	
					effectDisplay() { return format(tmp.b.upgrades[13].effect)+"x" },
					unlocked() {return player.g.unlocked}
			},
			14: {
				title: "Boosting Generators",
				description: "Boosters add to Generator's effect base",
	cost() { return new Decimal(10) },
				effect() { 
					
			let eff =	player.b.points.add(1).log10().sqrt().div(3);
	
					return eff;
				},
	
				effectDisplay() { return "+"+format(tmp.b.upgrades[14].effect) },
					unlocked() {return hasUpgrade("b",13)}
			},
			15: {
				title: "PB Reversal",
				description: "Total Prestige Points add to Booster's effect base",
	cost() { return new Decimal(11) },
				effect() { 
					
			let eff =	player.p.total.add(1).log10().add(1).log10().div(3)
	
					return eff;
				},
	
				effectDisplay() { return "+"+format(tmp.b.upgrades[15].effect) },
					unlocked() {return hasUpgrade("b",14)}
			},
			21: {
				title: "Gen Z^2",
				description: "Square Generator Power's effect. Also reduce Generator's cost.",
	cost() { return new Decimal(11) },
				
					unlocked() {return hasUpgrade("b",15)}
			},
			22: {
				title: "Up to the Fifth Floor",
				description: "Raise Generator Power's effect by 1.5.",
	cost() { return new Decimal(12) },
				
					unlocked() {return hasUpgrade("b",21)}
			},
			23: {
				title: "Time Dilation",
				description: "Unlock Time Capsules and row 2 layers exponent is reduced by 0.3.",
	cost() { return new Decimal(12) },
				
					unlocked() {return hasUpgrade("b",22)}
			},
		},
		milestones: {
			0: {
				requirementDescription() {return  "8 Boosters - Hideous Maxx"},
				effectDescription() { return "You can now buy max Boosters" },
				unlocked() {return hasUpgrade("b",12)},
				done() {return player.b.points.gte(8)}
			}
		}
})

addLayer("g", {
    name: "generator", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "G", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
		power: new Decimal(0),
    }},
    color: "#a3d9a5",
		canBuyMax() {return hasMilestone("b",0)},
    requires: new Decimal(1e8), // Can be a function that takes requirement increases into account
    resource: "generators", // Name of prestige currency
    baseResource: "prestige points", // Name of resource prestige is based on
    baseAmount() {return player.p.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
   exponent() {
		let exp = new Decimal(1.5)

		if (hasUpgrade("b",23)) exp = exp.sub(0.3)
		return exp
	} , // Prestige currency exponent
    base: 8,
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
       if (hasUpgrade("b",21)) mult = mult.sub(0.95)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "G", description: "G: Reset for generators", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
	doReset(resettingLayer) {
			let keep = [];
			player.g.power = new Decimal(0);
		
			if (layers[resettingLayer].row > this.row) layerDataReset("g", keep)
		},
    layerShown(){return player.l.tree == "jacorb"&&hasUpgrade("b",12);},
   branches: ["p"],
effBase() {
			let base = new Decimal(2);
			
			// ADD
		   if (hasUpgrade("b",14)) base = base.add(upgradeEffect("b",14))
			
			// MULTIPLY
			
			
			return base;
		},
		effect() {
			if (!player.g.unlocked) return new Decimal(0);
			let eff = Decimal.pow(this.effBase(), player.g.points.plus()).sub(1).max(0);
	
			return eff;
		},
		effectDescription() {
			return "which are generating "+format(tmp.g.effect)+" Generator Power per second."
		},
			powerEff() {
			if (!player.g.unlocked) return new Decimal(1);

			return player.g.power.plus(1).pow(this.powerExp());
		},

		powerExp() {
			let exp = new Decimal(1/3);
				if (hasUpgrade("b",21)) exp =exp.times(2)
			if (hasUpgrade("b",22)) exp =exp.times(1.5)
			return exp;
		},
		
		update(diff) {
			if (player.g.unlocked) player.g.power = player.g.power.plus(tmp.g.effect.times(diff));
		},
		tabFormat: ["main-display",
			"prestige-button",
			"blank",
			["display-text",
				function() {return 'You have ' + format(player.g.power) + ' Generator Power, which boosts Point generation by '+format(tmp.g.powerEff)+'x'},
					{}],
			"blank",
		
			"blank",
			"milestones", "blank", "blank", "upgrades"],
		  upgrades: {
		
			
			11: {
				title: "GP Combo",
				description: "Best Generators boost Prestige Points gain.",
	cost() { return new Decimal(1) },
				effect() {
					
					
					let eff = player.g.best.plus(1).pow(0.5);
			
					
					return eff;
				},
	
					effectDisplay() { return format(tmp.g.upgrades[11].effect)+"x" },
					unlocked() {return player.g.unlocked}
			},
			12: {
				title: "Generating Boosters",
				description: "Boosters add to Generator's effect base.",
				cost() { return new Decimal(3) },
				effect() { 
					
			let eff =	player.b.points.add(1).log10().sqrt().div(3);
	
					return eff;
				},
				unlocked() { return hasUpgrade("g", 11) },
				effectDisplay() { return "+"+format(tmp.g.upgrades[12].effect) },
				
			},
				13: {
				title: "Banking the Breakers",
				description: "Multiply Prestige Points based on Generator Power.",
				cost() { return new Decimal(4) },
				effect() { 
					
			let eff =	player.g.power.add(1).pow(0.8);
	
					return eff;
				},
				unlocked() { return hasUpgrade("g", 12) },
				effectDisplay() { return format(tmp.g.upgrades[13].effect)+"x" },
				
			},
			14: {
				title: "Softcap Touchdown",
				description: "Increase the Prestige point softcap from 1e9 to 1e10.",
				cost() { return new Decimal(4) },
			
				unlocked() { return hasUpgrade("g", 13) },
				
				
			},
			15: {
				title: "Points Extendens",
				description: "Raise points gain by 1.5.",
				cost() { return new Decimal(4) },
			
				unlocked() { return hasUpgrade("g", 14) },
				
				
			},
		},
		milestones: {
			0: {
				requirementDescription() {return  "2 Generators - Hideous Maxx"},
				effectDescription() { return "You can now buy max Generators" },
				unlocked() {return player.g.unlocked},
				done() {return player.g.points.gte(2)}
			},
			1: {
				requirementDescription() {return  "3 Generators - Cambrian Booster"},
				effectDescription() { return "Prestige Points are kept on resets and generate 100% of them per second." },
				unlocked() {return player.g.unlocked},
				done() {return player.g.points.gte(3)}
			}
		}
})
addLayer("t", {
        name: "time", // This is optional, only used in a few places, If absent it just uses the layer id.
        symbol: "T", // This appears on the layer's node. Default is the id with the first letter capitalized
        position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
        startData() { return {
            unlocked: false,
			points: new Decimal(0),
			best: new Decimal(0),
			energy: new Decimal(0),
			first: 0,
			auto: false,
			pseudoUpgs: [],
			autoExt: false,
        }},
        color: "#006609",
        requires() { return new Decimal(1e39) }, // Can be a function that takes requirement increases into account
        resource: "time capsules", // Name of prestige currency
        baseResource: "points", // Name of resource prestige is based on
        baseAmount() {return player.points}, // Get the current amount of baseResource
        type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
        exponent() { return new Decimal(1.85) }, // Prestige currency exponent
		base() { return new Decimal(10) },
        gainMult() { // Calculate the multiplier for main currency from bonuses
            mult = new Decimal(1)
            return mult
        },
        gainExp() { // Calculate the exponent on main currency from bonuses
            return new Decimal(1)
        },
	
		
		enGainMult() {
			let mult = new Decimal(1);
	
			return mult;
		},
		effBaseMult() {
			let mult = new Decimal(1);
			
			return mult;
		},
		effBasePow() {
			let exp = new Decimal(1);
		
			return exp;
		},
		effGainBaseMult() {
			let mult = new Decimal(1);
			
			return mult;
		},
		
		effect() { 
			if (!player.t.unlocked) return new Decimal(0)
			let eff = Decimal.pow(tmp.t.effBaseMult.times(tmp.t.effGainBaseMult).times(2).pow(tmp.t.effBasePow), player.t.points.times(1).plus().plus()).sub(1).max(0).times(player.t.points.times(1).plus(1)).times(tmp.t.enGainMult).max(0)
		return eff;
			
		},
	
		effectDescription() {
			return "which are generating "+format(tmp.t.effect)+" Time Energy per second."
		},

		enEff() {
			if (!player.t.unlocked) return new Decimal(1);
			let eff = player.t.energy.add(1).pow(1.1);
			
			return eff;
		},

		update(diff) {
			if (player.t.unlocked) player.t.energy = player.t.energy.plus(this.effect().times(diff)).max(0);
			
		},
        row: 2, // Row the layer is in on the tree (0 is the first row)
       hotkeys: [
        {key: "t", description: "T: Reset for time capsules", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],

		tabFormat: ["main-display",
			"prestige-button",
			"blank",
			["display-text",
				function() {return 'You have ' + format(player.t.energy) + ' Time Energy, which boosts Point & Prestige Point gain by '+format(tmp.t.enEff)+"."},
					{}],
			"blank",
			
			"blank",
			],
 
        doReset(resettingLayer){ 
			let keep = [];
			
            if (layers[resettingLayer].row > this.row) layerDataReset(this.layer, keep)
        },
        layerShown(){return (hasUpgrade("b",23)||player.t.unlocked)&&player.l.tree == "jacorb"},
        branches: ["b"],
	})