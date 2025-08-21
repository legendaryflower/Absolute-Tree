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
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return player.l.tree == "jacorb";},
    upgrades: {
		
			
			11: {
				title: "Prestige Boost",
				description: "Prestige Points boost Point generation.",
	cost() { return new Decimal(1) },
				effect() {
					
					
					let eff = player.p.points.plus(1).pow(0.5);
			
					
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
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#6e64c4",
    requires: new Decimal(200), // Can be a function that takes requirement increases into account
    resource: "boosters", // Name of prestige currency
    baseResource: "prestige points", // Name of resource prestige is based on
    baseAmount() {return player.p.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1, // Prestige currency exponent
    base: 1,
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

})
