addLayer("m", {
    name: "multi", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "M", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "purple",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "multi points", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses




        if (inChallenge("a",31)) return new Decimal(1)
        mult = new Decimal(1)

        if (hasUpgrade("m",14)) mult = mult.times(upgradeEffect("m",14))
        if (hasUpgrade("m",16)) mult = mult.times(upgradeEffect("m",16))
        if (hasUpgrade("m",17)) mult = mult.times(tmp.m.buyables[12].effect.first);
        if (hasUpgrade("a",11)) mult = mult.times(tmp.a.buyables[11].effect.first);
        if (hasUpgrade("m",21)) mult = mult.times(upgradeEffect("m",21))
        if (hasChallenge("a",12)) mult = mult.times(challengeEffect("a",12))
        if (inChallenge("a",21)) mult = mult.sqrt(player.a.time)
        if (player.u.unlocked) mult = mult.times(tmp.u.effect)
        if (player.n.unlocked) mult = mult.times(tmp.n.buyables[11].effect.first);
        if (hasUpgrade("n",11)) mult = mult.times(upgradeEffect("n",11));
        if (hasUpgrade("a",44)) mult = mult.times(upgradeEffect("a",44))
        if (player.s.unlocked) mult = mult.times(tmp.s.effect)
        if (hasUpgrade("s",13)) mult = mult.times(upgradeEffect("s",13))
        if (hasUpgrade("s",24)) mult = mult.times(upgradeEffect("s",24))
        if (hasMilestone("sm",0)) mult = mult.pow(0.8)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        if (inChallenge("a",31)) return new Decimal(1)
       
        let exp = new Decimal(1)
      
        if (hasUpgrade("m",22)) exp = exp.add(upgradeEffect("m",22))
        if (hasUpgrade("s",11)) exp = exp.add(0.01)
        if (inChallenge("a",32)) exp = exp.pow(0.5)
        return exp;
    },

    softcap: new Decimal(1e20),
    softcapPower() {let power = new Decimal(0.333)
        if (player.m.points.gte("1e5350")) return new Decimal(0.1)
        if (hasUpgrade("a",37)) return new Decimal(0.35125)

        if (player.m.points.gte("1e1600")) power = power.div(player.m.points.add(2).log10().add(1).log10())
       
        return power;
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {
            key:"m", description: "M: Reset for multi points", onPress() {
                if (canReset(this.layer))
                    doReset(this.layer)
            }
        },
    ],
    softcapBuyables()
    { let buyableCap = new Decimal(1200)
    if (player.n.unlocked) buyableCap = buyableCap.plus(100)
    if (hasUpgrade("a",36)) buyableCap = buyableCap.plus(100)
    return buyableCap;},
    automate(){
        if (player.m.auto) {
          setBuyableAmount("m",11,tmp.m.buyables[11].canAfford?player.m.points.div(1).log(6).floor().add(1):getBuyableAmount("m",11))
          setBuyableAmount("m",12,tmp.m.buyables[12].canAfford?player.m.points.div(5).log(6).floor().add(1):getBuyableAmount("m",12))
          setBuyableAmount("m",13,tmp.m.buyables[13].canAfford?player.m.points.div(100).log(14).floor().add(1):getBuyableAmount("m",13)) 
        }
        if (player.m.auto2) {
     
            setBuyableAmount("m",14,tmp.m.buyables[14].canAfford?player.m.points.div(10000).log(28).floor().add(1):getBuyableAmount("m",14)) 
          }
      },
      passiveGeneration() { return (hasMilestone("a", 3)||player.s.unlocked)?1:0 },
    doReset(resettingLayer) {
        let keep = [];
    
        if (hasMilestone("a", 0)) keep.push("upgrades")
        if (hasUpgrade("s",14)) keep.push("upgrades")
        if (layers[resettingLayer].row > this.row) layerDataReset("m", keep)
    },
    layerShown(){return true},
    tabFormat: {
        "Buyables": {
            buttonStyle() { return {'background-color': 'purple'} },
            content: ["main-display",
            "prestige-button",
            "resource-display", "blank",
           
            "buyables",
           
            "blank",
        ]},
        "Upgrades": {
     
            content: [
,
            "blank",    "blank",
            "upgrades",    "blank",
            "blank",    "blank",
            "blank",    "blank",
        ]},

    
    },
      upgrades: {
			
        11: {
            title: "Double",
            description: "Points gain is doubled.",
            cost: new Decimal(1),
         
            
        },	
        12: {
            title: "Pointy",
            description: "Points boost their own gain.",
            cost: new Decimal(1),
            cap() { let cap = new Decimal(1e7)
 if (hasUpgrade("a",21)) cap = cap.times(1.05)
 if (inChallenge("a",32)) cap = cap.div(275)
 if (hasUpgrade("n",31)) cap = cap.times(upgradeEffect("n",31))
                return cap; },
            
            effect() {
                
              
                let eff = player.points.plus(1).pow(0.1).min(tmp.m.upgrades[this.id].cap);

         if (inChallenge("a",12)) eff = eff.div(tmp.a.upgradeNerfChallenge)
                return eff;
            },
            
            effectDisplay() { return format(tmp.m.upgrades[12].effect)+"x"+(tmp.m.upgrades[12].effect.gte(tmp.m.upgrades[this.id].cap)?" (HARDCAPPED)":"") },
            unlocked() {return hasUpgrade("m",11)},
        },
        13: {
            title: "Multipoints",
            description: "Multi points multiply Points gain.",
            cost: new Decimal(10),
            cap() { let cap = new Decimal(1e21)
                if (hasUpgrade("a",21)) cap = cap.times(1.05)
                if (inChallenge("a",32)) cap = cap.div(275)
                return cap; },
            
            effect() {
                
               if (inChallenge("a",11)) return new Decimal(1)
          
                let eff = player.m.points.plus(1).pow(0.3)
              
                if (inChallenge("a",12)) eff = eff.div(tmp.a.upgradeNerfChallenge)
                if (eff.gte(1e10)) eff = eff.div(1e10).log2().plus(1e10)
                if (eff.gte(1e13)) eff = eff.div(1e13).log10().plus(1e13)
                if (eff.gte(1e16)) eff = eff.div(1e16).log10().plus(1e16)
                if (eff.gte(1e20)) eff = eff.div(1e20).log10().log10().log10().plus(1e20)
              
            if (hasUpgrade("m",23)) eff = eff.times(upgradeEffect("m",23))
         
                return eff;
            },
            
            effectDisplay() { return format(tmp.m.upgrades[13].effect)+"x"+(tmp.m.upgrades[13].effect.gte(tmp.m.upgrades[this.id].cap)?" (HARDCAPPED)":"") },
            unlocked() {return hasUpgrade("m",12)},
        },
        14: {
            title: "Pointy Multiplier",
            description: "Points multiply Multi points gain.",
            cost: new Decimal(15),
            cap() { let cap = new Decimal(5e7)
                if (hasUpgrade("a",21)) cap = cap.times(1.5)
                if (hasChallenge("a",31)) cap = cap.pow(3)
                if (inChallenge("a",32)) cap = cap.div(275)
                if (hasUpgrade("s",21)) cap = cap.times(upgradeEffect("s",21))
	return cap; },


            effect() {
                
              
                let eff = player.points.plus(1).pow(0.125).min(tmp.m.upgrades[this.id].cap);
                if (inChallenge("a",12)) eff = eff.div(tmp.a.upgradeNerfChallenge)
                if (hasUpgrade("s",21)) eff =eff.times(upgradeEffect("s",21))
                return eff;
            },
            
            effectDisplay() { return format(tmp.m.upgrades[14].effect)+"x"+(tmp.m.upgrades[14].effect.gte(tmp.m.upgrades[this.id].cap)?" (HARDCAPPED)":"") },
            unlocked() {return hasUpgrade("m",13)},
        },
        15: {
            title: "Upgraded Points",
            description: "Multi upgrades boost Points gain.",
            cost: new Decimal(50),
            effect() {
                
              
                let eff = Decimal.pow(1.05, player.m.upgrades.length);
                if (inChallenge("a",12)) eff = eff.div(tmp.a.upgradeNerfChallenge)
                if (hasUpgrade("m",24)) eff = eff.times(upgradeEffect("m",24))
        
                return eff;
            },
            
            effectDisplay() { return format(tmp.m.upgrades[15].effect)+"x" },
            unlocked() {return hasUpgrade("m",14)},
        },
        16: {
            title: "Upgraded Multi Points",
            description: "Multi upgrades boost Multi points gain.",
            cost: new Decimal(75),
            effect() {
                
              
                let eff = Decimal.pow(1.035, player.m.upgrades.length);
                if (inChallenge("a",12)) eff = eff.div(tmp.a.upgradeNerfChallenge)
                if (hasUpgrade("m",24)) eff = eff.times(upgradeEffect("m",24))
        
                return eff;
            },
            
            effectDisplay() { return format(tmp.m.upgrades[16].effect)+"x" },
            unlocked() {return hasUpgrade("m",15)},
        },
        17: {
            title: "New Buyable",
            description: "Unlock a new Buyable.",
            cost: new Decimal(125),
           
            unlocked() {return hasUpgrade("m",16)},
        },
        21: {
            title: "Multy",
            description: "Multi points boost their own gain.",
            cost: new Decimal(1000),
            cap() { let cap = new Decimal(1e6)
                if (hasUpgrade("a",21)) cap = cap.times(1.05)
                if (inChallenge("a",32)) cap = cap.div(275)
                return cap; },
            unlocked() {return hasUpgrade("m",17)},
            effect() {
                
              
                let eff = player.m.points.plus(1).pow(0.05).min(tmp.m.upgrades[this.id].cap);;
                
                if (inChallenge("a",12)) eff = eff.div(tmp.a.upgradeNerfChallenge)
        
                return eff;
            },
            
            effectDisplay() { return format(tmp.m.upgrades[21].effect)+"x"+(tmp.m.upgrades[21].effect.gte(tmp.m.upgrades[this.id].cap)?" (HARDCAPPED)":"") },
        },
        22: {
            title: "Multipotenint",
            description: "Multi Point's exponent is added based on Points",
            cost: new Decimal(1500),
            cap() { let cap = new Decimal(5)
                if (hasUpgrade("a",21)) cap = cap.times(1.05)
                if (inChallenge("a",32)) cap = cap.div(275)
                return cap; },
            unlocked() {return hasUpgrade("m",21)},
            effect() {
                
              
                let eff = player.points.plus(0.005).pow(0.01).min(tmp.m.upgrades[this.id].cap);;
              
                if (inChallenge("a",12)) eff = eff.div(tmp.a.upgradeNerfChallenge)
                return eff;
            },
            
            effectDisplay() { return "+"+format(tmp.m.upgrades[22].effect)+(tmp.m.upgrades[22].effect.gte(tmp.m.upgrades[this.id].cap)?" (HARDCAPPED)":"") },
        },
        23: {
            title: "Multi-multi Points",
            description: "<b>Multipoints</b> upgrade is stronger based on Multi Points.",
            cost: new Decimal(1e11),
            cap() { let cap = new Decimal(1e8)
                if (hasUpgrade("a",21)) cap = cap.times(1.05)
                if (inChallenge("a",32)) cap = cap.div(275)
                return cap; },
            unlocked() {return hasUpgrade("m",22)},
            effect() {
                
              
                let eff = player.m.points.plus(1).pow(0.1).min(tmp.m.upgrades[this.id].cap);;

       
                if (inChallenge("a",12)) eff = eff.div(tmp.a.upgradeNerfChallenge)
        
                return eff;
            },
            
            effectDisplay() { return format(tmp.m.upgrades[23].effect)+"x"+(tmp.m.upgrades[23].effect.gte(tmp.m.upgrades[this.id].cap)?" (HARDCAPPED)":"") },
        },
        24: {
            title: "Self-upgrading",
            description: "Boost <b>Upgraded Points</b> and <b>Upgraded Multi Points</b> basted on Absolute Points.",
            cost: new Decimal(1e29),
           
            unlocked() {return hasMilestone("a",1)&&hasUpgrade("m",23)},
            effect() {
                
              
                let eff = player.a.points.plus(1).pow(0.75);

                if (inChallenge("a",12)) eff = eff.div(tmp.a.upgradeNerfChallenge)
                return eff;
            },
            
            effectDisplay() { return format(tmp.m.upgrades[24].effect)+"x" },
        },
        25: {
            title: "Continuum Drift",
            description: "Absolute's effect base is added by 0.05.",
            cost: new Decimal(2.5e30),
           
            unlocked() {return hasUpgrade("m",24)},
        },
        26: {
            title: "Miracle Points",
            description: "Reduce the cost of Multi Points buyable by 15%.",
            cost: new Decimal(7.5e31),
           
            unlocked() {return player.m.points.gte(5e31)||hasUpgrade("m",26)&&hasUpgrade("m",25)},
        },
        27: {
            title: "Absolute Divider",
            description: "Divide the cost of Absolute Points based on Multi points. Unlock a new buyable.",
            cost: new Decimal(1e32),
           
            unlocked() {return (hasUpgrade("m",26)) && !player.s.unlocked},
            effect() {
                
              
                let eff = player.m.points.plus(1).pow(0.215);

                if (eff.gte(1e110)) eff = eff.div(1e118).log10().plus(1e110)


                if (inChallenge("a",12)) eff = eff.div(tmp.a.upgradeNerfChallenge)
         if (hasChallenge("a",11)) eff = eff.times(5)
         if (hasUpgrade("m",34)) eff = eff.pow(2)
                return eff;
            },
            
            effectDisplay() { return "/"+format(tmp.m.upgrades[27].effect) },
        },
        31: {
            title: "Panda-Cola Biscuits",
            description: "Absolute's effect base is added by your Multi Points (at a reduced rate)",
            cost: new Decimal(2.5e33),
           
            unlocked() {return hasUpgrade("m",27)&&hasChallenge("a",11)},
            effect() {
                
              
                let eff = player.m.points.add(1).log10().sqrt().div(15).times(1);
                if (inChallenge("a",12)) eff = eff.div(tmp.a.upgradeNerfChallenge)
        
                return eff;
            },
            
            effectDisplay() { return "+"+format(tmp.m.upgrades[31].effect) },
        },
        32: {
            title: "Multiverse Drift",
            description: "Reduce the cost of Points buyable by 31.5%.",
            cost: new Decimal(5e34),
           
            unlocked() {return hasUpgrade("m",31)},
           
        },
        33: {
            title: "Eucild Points",
            description: "Points gain is raised ^1.2.",
            cost: new Decimal(1e35),
           
            unlocked() {return hasUpgrade("m",32)},
           
        },
        
        34: {
            title: "Tampered Powers",
            description: "<b>Absolute Divider</b>'s upgrade is squared.",
            cost: new Decimal(1e44),
           
            unlocked() {return hasUpgrade("m",33)},
           
        },
        35: {
            title: "Spactical Multi",
            description: "Multiply the base effect of Absolute by 4.",
            cost: new Decimal(5e45),
           
            unlocked() {return player.a.points.gte(6)||hasUpgrade("m",35)&&hasUpgrade("m",34)},
           
        },
        36: {
            title: "Impossible Duke",
            description: "Absolute divides its own requirement.",
            cost: new Decimal(1e80),
           
            unlocked() {return player.a.points.gte(7)||hasUpgrade("m",36)&&hasUpgrade("m",35)},
            effect() {
                
              
                let eff = player.a.points.plus(1).pow(0.085);

        
                return eff;
            },
            
            effectDisplay() { return "/"+format(tmp.m.upgrades[36].effect) },
        },
        37: {
            title: "Drake Powerers",
            description: "Nursery Points exponent is added by 0.05.",
            cost: new Decimal(50),
         unlocked () {return hasUpgrade("m",36)&&player.n.unlocked},
currencyDisplayName: "nursery points",
currencyInternalName: "points",
currencyLayer: "n",

        },	 
    },
    buyables: {
        11: {
            costScaling() {let cost =  new Decimal(1)
               if(!hasUpgrade("a",37)) if (player.m.buyables[11].gte(1100)) cost = cost.add(0.25)
               if(!hasUpgrade("a",37))if (player.m.buyables[11].gte(tmp.m.softcapBuyables)) cost = cost.add(0.75)
               if(!hasUpgrade("a",37)) if (inChallenge("a",22)) cost = cost.times(tmp.a.costScalingStartHarsh)
        return cost;
                 },
            freeLvls() {let free = new Decimal(0)
            if (player.a.unlocked) free = free.plus(buyableEffect("m",13))
            return free;},
        title() {return "Points"},
            cost(x) { return new Decimal(1).mul(new Decimal(6).pow(x).pow(hasUpgrade("a",37) ? 2 : 1)).times(hasUpgrade("m",32) ? 0.695 : 1).pow(tmp[this.layer].buyables[this.id].costScaling) },
        
            display() { // Everything else displayed in the buyable button after the title
                let data = tmp[this.layer].buyables[this.id]
                return "Cost: " + format(data.cost) + " multi points\n\
                Amount: " + player[this.layer].buyables[this.id] + "+"+ tmp[this.layer].buyables[this.id].freeLvls+"\n\
               Points gain is multiplied by " + format(data.effect.first) + "x. "
            },
            effect(x) { // Effects of owning x of the items, x is a decimal
                let eff = {}
                if (x.gte(0)) eff.first = Decimal.pow(1.1, x.pow(1.16)).plus(tmp.m.buyables[this.id].freeLvls).div(hasUpgrade("a",37) ? 1e5 : 1)
                else eff.first = Decimal.pow(1/50, x.times(-1).pow(1.0))
            
                if (x.gte(0)) eff.second = x.pow(0.8)
                else eff.second = x.times(-1).pow(0.8).times(-1)
                return eff;
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },

           
        },
        12: {
            freeLvls() {let free = new Decimal(0)
                if (hasUpgrade("m",27)) free = free.plus(buyableEffect("m",14))
                return free;},
                costScaling() {let cost =  new Decimal(1)
                    if(!hasUpgrade("a",37))    if (player.m.buyables[12].gte(1100)) cost = cost.add(0.25)
                    if(!hasUpgrade("a",37))   if (player.m.buyables[11].gte(tmp.m.softcapBuyables)) cost = cost.add(0.75)
                    if(!hasUpgrade("a",37))   if (inChallenge("a",22)) cost = cost.times(tmp.a.costScalingStartHarsh)
            return cost;
                     },
            cost(x) { return new Decimal(5).mul(new Decimal(6).pow(x).pow(hasUpgrade("a",37) ? 2 : 1)).times(hasUpgrade("m",26) ? 0.85 : 1).pow(tmp[this.layer].buyables[this.id].costScaling) },
            title() { return "Multi Points" },
           
            display() { // Everything else displayed in the buyable button after the title
                let data = tmp[this.layer].buyables[this.id]
                return "Cost: " + format(data.cost) + " multi points\n\
                Amount: " + player[this.layer].buyables[this.id] + "+" + tmp[this.layer].buyables[this.id].freeLvls+"\n\
               Multi points gain is multiplied by " + format(data.effect.first) + "x. "
            },
            effect(x) { // Effects of owning x of the items, x is a decimal
                let eff = {}
                if (x.gte(0)) eff.first = Decimal.pow(1.2, x.pow(1.16)).plus(tmp.m.buyables[this.id].freeLvls.times(1e6)).div(hasUpgrade("a",37) ? 1e5 : 1)
                else eff.first = Decimal.pow(1/50, x.times(-1).pow(1.0))
            
                if (x.gte(0)) eff.second = x.pow(0.8)
                else eff.second = x.times(-1).pow(0.8).times(-1)
                return eff;
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {return hasUpgrade("m",17)},

        },
        13: {
            costScaling() {let cost =  new Decimal(1)
              
                if(!hasUpgrade("a",37))   if (player.m.buyables[11].gte(tmp.m.softcapBuyables)) cost = cost.add(0.75)
 
        return cost;
                 },
            cost(x) { return new Decimal(100).mul(new Decimal(14).pow(x)).pow(tmp[this.layer].buyables[this.id].costScaling) },
            title() { return "Free Points" },

            display() { // Everything else displayed in the buyable button after the title
                let data = tmp[this.layer].buyables[this.id]
                return "Cost: " + format(data.cost) + " multi points\n\
                Amount: " + player[this.layer].buyables[this.id] + "\n\
               Add " + format(data.effect) + " free levels to Points buyable. "
            },
            effect() {
                x=player[this.layer].buyables[this.id]

                if (!x.gte(1)) return new Decimal(0)
                let eff = Decimal.plus(0.05, x.times(0.05))

        
                return eff;
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {return player.a.unlocked},
         
        },
        14: {
            costScaling() {let cost =  new Decimal(1)
              
                if(!hasUpgrade("a",37))if (player.m.buyables[11].gte(tmp.m.softcapBuyables)) cost = cost.add(0.75)
 
        return cost;
                 },
            cost(x) { return new Decimal(10000).mul(new Decimal(28).pow(x)).pow(tmp[this.layer].buyables[this.id].costScaling) },
            title() { return "Free Multi Points" },

            display() { // Everything else displayed in the buyable button after the title
                let data = tmp[this.layer].buyables[this.id]
                return "Cost: " + format(data.cost) + " multi points\n\
                Amount: " + player[this.layer].buyables[this.id] + "\n\
               Add " + format(data.effect) + " free levels to Multi Points buyable. "
            },
            effect() {
                x=player[this.layer].buyables[this.id]

                if (!x.gte(1)) return new Decimal(0)
                let eff = Decimal.plus(0.06, x.times(0.06))

        
                return eff;
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {return player.a.unlocked},
         
        },
        
    },
})

addLayer("a", {
    name: "absolute", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "A", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        time: new Decimal(1),
    }},
    color: "red",
    requires: new Decimal(1e15), // Can be a function that takes requirement increases into account
    resource: "absolute points", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 3, // Prestige currency exponent
    base: 1.75,
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)




     if (hasUpgrade("m",27)) mult = mult.div(upgradeEffect("m",27))
     if (hasUpgrade("m",36)) mult = mult.div(upgradeEffect("m",36))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        let exp = new Decimal(1)
       
        return exp;
    },
    resetsNothing() {return hasMilestone("n",1)},
    autoPrestige() {return hasMilestone("n",1)},
   branches: ["m"],
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {
            key:"a", description: "A: Reset for absolute points", onPress() {
                if (canReset(this.layer)&&!player.s.unlocked)
                    doReset(this.layer)
            }
        },
    ],
    effectDescription() {
        return "which are boosting Points gain by "+format(tmp.a.effect)+"x."
    },
    
    addToBase() {
        let base = new Decimal(0);
     if (hasUpgrade("m",25)) base = base.add(0.05)
     if (hasUpgrade("m",31)) base = base.add(upgradeEffect("m",31))
     if (hasUpgrade("a",16)) base = base.add(upgradeEffect("a",16))
        return base;
    },
    doReset(resettingLayer) {
        let keep = [];
    
        player.a.time = new Decimal(1)
        if (hasUpgrade("n", 12)) keep.push("challenges")
        if (hasMilestone("n",0)) keep.push("upgrades")
        if (hasMilestone("n",0)) keep.push("buyables")
        if (hasMilestone("n",0)) keep.push("milestones")
        if (layers[resettingLayer].row > this.row) layerDataReset("a", keep)
    },
    update(diff) {
      if (inChallenge("a",21)) player.a.time = player.a.time.plus(diff)

    },
    effectBase() {
        let base = new Decimal(1.5);
        
        // ADD
        base = base.plus(tmp.a.addToBase);
        
        // MULTIPLY
      
        
        return base.pow(tmp.a.power);
    },
    power() {
        let power = new Decimal(1);
     if (hasUpgrade("m",35)) power = power.times(4)
        return power;
    },
    upgradeNerfChallenge(x=challengeCompletions("a", 12)) {
      
        let nerf = Decimal.add(2.5, Decimal.pow(x, 4).div(7))
        if (hasUpgrade("a",17)) nerf = nerf.times(0.9)
        return nerf;
    },
    costScalingStartHarsh(x=challengeCompletions("a", 22)) {
      
        let nerf = Decimal.add(2.2, Decimal.pow(x, 4).div(6))
       if (hasUpgrade("a",37)) nerf = nerf.div(tmp.a.buyables[31].effect.first)
        return nerf;
    },

    effect() {
        return Decimal.pow(tmp.a.effectBase, player.a.points.plus()).max(1).times(1);
    },
    layerShown(){return (hasUpgrade("m",23) || player.a.unlocked ) && !player.s.unlocked},
   
    tabFormat: {
        "Main": {
            buttonStyle() { return {'background-color': 'red'} },
            content: ["main-display",
            "prestige-button",
            "resource-display", "blank",
           
            "milestones",
           
            "blank",
            "upgrades",
        ]},
        "Challenges": {
            unlocked() {return hasMilestone("a",2)},
            content: [
            "main-display", "blank",
           
            "challenges",
           
            "blank",
        ]},
        "Buyables": {
            unlocked() {return hasUpgrade("a",11)},
            content: [
            "main-display", "blank",
           
            "buyables",
           
            "blank",
        ]},

    
    },
    buyables: {
        11: {
          costScaling() {let cost =  new Decimal(1)
        if (player.a.buyables[11].gte(6)) cost = cost.add(0.25)
        if (player.a.buyables[11].gte(8)) cost = cost.add(1)
        if (player.a.buyables[11].gte(9)) cost = cost.add(0.15)
        if (player.a.buyables[11].gte(10)) cost = cost.add(0.95)
        if (player.a.buyables[11].gte(16)) cost = cost.add(4)

        if (player.a.buyables[this.id].gte(18)) cost = cost.add(17)

        if (hasUpgrade("a",13)) cost = cost.times(0.75)
        if (hasChallenge("a",21)) cost = cost.times(0.6666)
return cost;
         },
            cost(x) { return new Decimal(1e100).mul(new Decimal(1e50).pow(x).pow(tmp[this.layer].buyables[this.id].costScaling)) },
            title() { return "Baker's Wheat" },

            display() { // Everything else displayed in the buyable button after the title
                let data = tmp[this.layer].buyables[this.id]
                return "Cost: " + format(data.cost) + " multi points\n\
                Amount: " + player[this.layer].buyables[this.id] + "\n\
               Multiply Multi points gain by " + format(data.effect.first) + "x. "
            },
            effect(x) { // Effects of owning x of the items, x is a decimal
                let eff = {}
                if (x.gte(0)) eff.first = Decimal.pow(1.95, x.pow(2.05))
                else eff.first = Decimal.pow(1/45, x.times(-1).pow(1.0))
            
                if (x.gte(0)) eff.second = x.pow(0.8)
                else eff.second = x.times(-1).pow(0.8).times(-1)
                return eff;
            },
            canAfford() { return player.m.points.gte(this.cost()) },
            buy() {
                player.m.points = player.m.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },

           
        },
        12: {
            costScaling() {let cost =  new Decimal(1)
                if (hasUpgrade("a",22)) cost = cost.times(0.8);
          if (player.a.buyables[12].gte(6)) cost = cost.add(0.25)
          if (player.a.buyables[12].gte(8)) cost = cost.add(1)
          if (player.a.buyables[12].gte(9)) cost = cost.add(0.15)
          if (player.a.buyables[12].gte(10)) cost = cost.add(0.95)
          if (player.a.buyables[this.id].gte(9)) cost = cost.add(3.5)

          if (player.a.buyables[this.id].gte(16)) cost = cost.add(17)

          
  return cost;
           },
              cost(x) { return new Decimal("1e898").mul(new Decimal(1e25).pow(x).pow(tmp[this.layer].buyables[this.id].costScaling)) },
              title() { return "Elderwort" },
  
              display() { // Everything else displayed in the buyable button after the title
                  let data = tmp[this.layer].buyables[this.id]
                  return "Cost: " + format(data.cost) + " multi points\n\
                  Amount: " + player[this.layer].buyables[this.id] + "\n\
                 Multiply points gain by " + format(data.effect.first) + "x. "
              },
              effect(x) { // Effects of owning x of the items, x is a decimal
                  let eff = {}
                  if (x.gte(0)) eff.first = Decimal.pow(1.9, x.pow(2.0))
                  else eff.first = Decimal.pow(1/45, x.times(-1).pow(1.0))
              
                  if (x.gte(0)) eff.second = x.pow(0.8)
                  else eff.second = x.times(-1).pow(0.8).times(-1)
                  return eff;
              },
              canAfford() { return player.m.points.gte(this.cost()) },
              buy() {
                  player.m.points = player.m.points.sub(this.cost())
                  setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
              },
              unlocked() { return hasUpgrade("a",21)}
             
          },
          13: {
            costScaling() {let cost =  new Decimal(1)
          
          if (player.a.buyables[13].gte(4)) cost = cost.add(0.5)
          if (player.a.buyables[13].gte(8)) cost = cost.add(1)
          if (player.a.buyables[13].gte(9)) cost = cost.add(0.15)
          if (player.a.buyables[13].gte(10)) cost = cost.add(0.95)
          if (player.a.buyables[this.id].gte(6)) cost = cost.add(3.8)

          if (player.a.buyables[this.id].gte(10)) cost = cost.add(17)

  return cost;
           },
              cost(x) { return new Decimal("1e975").mul(new Decimal(1e50).pow(x).pow(tmp[this.layer].buyables[this.id].costScaling)) },
              title() { return "White Mildew" },
  
              display() { // Everything else displayed in the buyable button after the title
                  let data = tmp[this.layer].buyables[this.id]
                  return "Cost: " + format(data.cost) + " multi points\n\
                  Amount: " + player[this.layer].buyables[this.id] + "\n\
                 Multiply the efficieny of Thumbcorn by " + format(data.effect.first) + "x."
              },
              effect(x) { // Effects of owning x of the items, x is a decimal
                  let eff = {}
                  if (x.gte(0)) eff.first = Decimal.pow(1.4, x.pow(1.6531))
                  else eff.first = Decimal.pow(1/52, x.times(-1).pow(1.0))
              
                  if (x.gte(0)) eff.second = x.pow(0.8)
                  else eff.second = x.times(-1).pow(0.8).times(-1)
                  return eff;
              },
              canAfford() { return player.m.points.gte(this.cost()) },
              buy() {
                  player.m.points = player.m.points.sub(this.cost())
                  setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
              },
              unlocked() { return hasUpgrade("a",25)}
             
          },
          21: {
            costScaling() {let cost =  new Decimal(1)
                if (hasUpgrade("a",45)) cost = cost.times(0.9)
                if (hasUpgrade("n",12)) cost = cost.min(upgradeEffect("n",12))
                if (player.a.buyables[this.id].gte(4)) cost = cost.add(0.05)
                if (player.a.buyables[this.id].gte(7)) cost = cost.add(2)
                if (player.a.buyables[this.id].gte(10)) cost = cost.add(4.3)
                if (player.a.buyables[this.id].gte(12)) cost = cost.add(15)

       
                if (player.a.buyables[this.id].gte(18)) cost = cost.add(50)


  return cost;
           },
              cost(x) { return new Decimal("1e1131").pow(new Decimal(1.0015).pow(x).pow(tmp[this.layer].buyables[this.id].costScaling)) },
              title() { return "Squid Buyable 1" },
  
              display() { // Everything else displayed in the buyable button after the title
                  let data = tmp[this.layer].buyables[this.id]
                  return "Cost: " + format(data.cost) + " multi points\n\
                  Amount: " + player[this.layer].buyables[this.id] + "\n\
                 All upgrades of Chocoroot upgrade type is multiplied by " + format(data.effect.first) + "x. "
              },
              effect(x) { // Effects of owning x of the items, x is a decimal
                  let eff = {}
                  if (x.gte(0)) eff.first = Decimal.pow(1.45, x.pow(1.3))
                  else eff.first = Decimal.pow(1/45, x.times(-1).pow(1.0))
              
                  if (x.gte(0)) eff.second = x.pow(0.8)
                  else eff.second = x.times(-1).pow(0.8).times(-1)
                  return eff;
              },
              canAfford() { return player.m.points.gte(this.cost()) },
              buy() {
                  player.m.points = player.m.points.sub(this.cost())
                  setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
              },
              unlocked() { return hasUpgrade("a",32)}
             
          },
          22: {
            costScaling() {let cost =  new Decimal(1)
             
                if (hasUpgrade("a",45)) cost = cost.times(0.9)
  return cost;
           },
              cost(x) { return new Decimal("1e300").pow(new Decimal(2).pow(x).pow(tmp[this.layer].buyables[this.id].costScaling)) },
              title() { return "Squid Buyable 2" },
  
              display() { // Everything else displayed in the buyable button after the title
                  let data = tmp[this.layer].buyables[this.id]
                  return "Cost: " + format(data.cost) + " points\n\
                  Amount: " + player[this.layer].buyables[this.id] + "\n\
                 Golden Clover upgrade is multiplied by " + format(data.effect.first) + "x. "
              },
              effect(x) { // Effects of owning x of the items, x is a decimal
                  let eff = {}
                  if (x.gte(0)) eff.first = Decimal.pow(1.03, x.pow(1.08))
                  else eff.first = Decimal.pow(1/45, x.times(-1).pow(1.0))
              
                  if (x.gte(0)) eff.second = x.pow(0.8)
                  else eff.second = x.times(-1).pow(0.8).times(-1)
                  return eff;
              },
              canAfford() { return player.points.gte(this.cost()) },
              buy() {
                  player.m.points = player.points.sub(this.cost())
                  setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
              },
              unlocked() { return hasUpgrade("a",32)}
             
          },
          23: {
            costScaling() {let cost =  new Decimal(1)
                if (hasUpgrade("a",45)) cost = cost.times(0.9)

  return cost;
           },
              cost(x) { return new Decimal("1e500").pow(new Decimal(2.5).pow(x).pow(tmp[this.layer].buyables[this.id].costScaling)) },
              title() { return "Squid Buyable 3" },
  
              display() { // Everything else displayed in the buyable button after the title
                  let data = tmp[this.layer].buyables[this.id]
                  return "Cost: " + format(data.cost) + " points\n\
                  Amount: " + player[this.layer].buyables[this.id] + "\n\
                 Multiply the rewards of Anti-Queen challenge by " + format(data.effect.first) + "x. "
              },
              effect(x) { // Effects of owning x of the items, x is a decimal
                  let eff = {}
                  if (x.gte(0)) eff.first = Decimal.pow(1.4, x.pow(1.3))
                  else eff.first = Decimal.pow(1/45, x.times(-1).pow(1.0))
              
                  if (x.gte(0)) eff.second = x.pow(0.8)
                  else eff.second = x.times(-1).pow(0.8).times(-1)
                  return eff;
              },
              canAfford() { return player.points.gte(this.cost()) },
              buy() {
                  player.m.points = player.points.sub(this.cost())
                  setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
              },
              unlocked() { return hasUpgrade("a",32)}
             
          },
          31: {
            costScaling() {let cost =  new Decimal(1)
        
                if (player.a.buyables[this.id].gte(4)) cost = cost.add(0.05)
                if (player.a.buyables[this.id].gte(7)) cost = cost.add(2)
                if (player.a.buyables[this.id].gte(10)) cost = cost.add(4.3)
                if (player.a.buyables[this.id].gte(12)) cost = cost.add(15)

       
                if (player.a.buyables[this.id].gte(18)) cost = cost.add(50)

            

  return cost;
           },
              cost(x) { return new Decimal(1e18).pow(new Decimal(1.0525).pow(x).pow(tmp[this.layer].buyables[this.id].costScaling)) },
              title() { return "Queenbeet" },
  
              display() { // Everything else displayed in the buyable button after the title
                  let data = tmp[this.layer].buyables[this.id]
                  return "Cost: " + format(data.cost) + " nursery points\n\
                  Amount: " + player[this.layer].buyables[this.id] + "\n\
                 Lethality of Anti-Queens challenge is reduced by " + format(data.effect.first) + ". "
              },
              effect(x) { // Effects of owning x of the items, x is a decimal
                  let eff = {}
                  if (x.gte(0)) eff.first = Decimal.pow(1.45, x.pow(1.3))
                  else eff.first = Decimal.pow(1/45, x.times(-1).pow(1.0))
              
                  if (x.gte(0)) eff.second = x.pow(0.8)
                  else eff.second = x.times(-1).pow(0.8).times(-1)
                  return eff;
              },
              canAfford() { return player.n.points.gte(this.cost()) },
              buy() {
                  player.m.points = player.n.points.sub(this.cost())
                  setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
              },
              unlocked() { return hasUpgrade("a",37)}
             
          },
        
    },
    upgrades: {
			
        11: {
            title: "Baker's Wheat",
            description: "Unlock 1 new Absolute Buyable.",
            cost: new Decimal(10),
         unlocked () {return hasMilestone("a",4)}
            
        },	
        12: {
            title: "Thumbcorn",
            description: "Absolute Points multiply Points gain.",
            cost: new Decimal(11),
         unlocked () {return hasUpgrade("a",11)},
         effect() {
                
              
            let eff = player.a.points.plus(1).pow(0.5)
           if (hasUpgrade("a",15)) eff = eff.times(upgradeEffect("a",15))
           if (hasUpgrade("a",25)) eff = eff.times(tmp.a.buyables[12].effect.first);
            return eff;
        },
        
        effectDisplay() { return format(tmp.a.upgrades[12].effect)+"x" },
            
        },	
        13: {
            title: "Cronerice",
            description: "Reduce the scaling of Baker's Wheat buyable by 25%.",
            cost: new Decimal("1e416"),
         unlocked () {return hasUpgrade("a",12)},
currencyDisplayName: "multi points",
currencyInternalName: "points",
currencyLayer: "m",
      
            
        },	
        14: {
            title: "Gildmillet",
            description: "Unlock a new non-repeatable challenge",
            cost: new Decimal("1e545"),
         unlocked () {return hasUpgrade("a",13)},
currencyDisplayName: "multi points",
currencyInternalName: "points",
currencyLayer: "m",
      
            
        },	
        15: {
            title: "Ordinary Clover",
            description: "Each OoM^2 of Multi Points multiply <b>Thumbcorn</b>'s effect.",
            cost: new Decimal("1e633"),
         unlocked () {return hasUpgrade("a",14)},
currencyDisplayName: "multi points",
currencyInternalName: "points",
currencyLayer: "m",
effect() {
                
              
    let eff = player.m.points.add(2).log10().add(1).log10()

    return eff;
},


effectDisplay() { return format(tmp.a.upgrades[15].effect)+"x" },
            
        },	
        16: {
            title: "Golden Clover",
            description: "Points add to Absolute's effect base. Unlock Ultra Points",
            cost: new Decimal("1e640"),
         unlocked () {return hasUpgrade("a",15)},
currencyDisplayName: "multi points",
currencyInternalName: "points",
currencyLayer: "m",
effect() {
                
              
    let eff = player.points.add(1).log10().sqrt().div(25).times(1);
	if (hasUpgrade("a",32)) eff = eff.times(tmp.a.buyables[22].effect.first);
    return eff;
},


effectDisplay() { return "+"+format(tmp.a.upgrades[16].effect) },
            
        },	
        17: {
            title: "Shimmerlily",
            description: "<b>Antitrusted Multiverses</b> challenge is 10% less as lethal and unlock a new repeatable Challenge.",
            cost: new Decimal("1e800"),
         unlocked () {return hasUpgrade("a",16)&&player.u.unlocked},
currencyDisplayName: "multi points",
currencyInternalName: "points",
currencyLayer: "m",
            
        },
         21: {
            title: "Elderwort",
            description: "Extend the hardcap of Multi Upgrades by 5%. Unlock a new buyable.",
            cost: new Decimal("1e805"),
         unlocked () {return hasUpgrade("a",17)},
currencyDisplayName: "multi points",
currencyInternalName: "points",
currencyLayer: "m",
            
        },	
        22: {
            title: "Bakeberry",
            description: "<b>Antitrusted Multiverses</b> challenge goal is reduced by 80%, and the cost scaling for Elderwort buyable is reduced by 20%.",
            cost: new Decimal("1e900"),
         unlocked () {return hasUpgrade("a",21)},
currencyDisplayName: "multi points",
currencyInternalName: "points",
currencyLayer: "m",
            
        },	
        23: {
            title: "Chocoroot",
            description: "Multi Points add to the Ultra Point's base effect.",
            cost: new Decimal("1e204"),
         unlocked () {return hasUpgrade("a",22)},
currencyDisplayName: "points",
currencyInternalName: "points",
effect() {
                
              
    let eff = player.m.points.add(1).log10().sqrt().div(1.8).times(1);
	if (hasUpgrade("a",32)) eff = eff.times(tmp.a.buyables[21].effect.first);
    return eff;
}, 


effectDisplay() { return "+"+format(tmp.a.upgrades[23].effect) },
            
        },	
        24: {
            title: "White Chocoroot",
            description: "Absolute's effect also adds to the Ultra Point's base effect.",
            cost: new Decimal("1e907"),
         unlocked () {return hasUpgrade("a",23)},
currencyDisplayName: "multi points",
currencyInternalName: "points",
currencyLayer: "m",
effect() {
                
              
    let eff = tmp.a.effect.plus(1).pow(0.09117)
	if (hasUpgrade("a",32)) eff = eff.times(tmp.a.buyables[21].effect.first);
    return eff;
},


effectDisplay() { return "+"+format(tmp.a.upgrades[24].effect) },
            
        },	
        25: {
            title: "White Mildew",
            description: "Unlock a new Buyable.",
            cost: new Decimal("1e975"),
         unlocked () {return hasUpgrade("a",24)},
currencyDisplayName: "multi points",
currencyInternalName: "points",
currencyLayer: "m",
            
        },	
        26: {
            title: "Brown Mold",
            description: "Unlock a new challenge.",
            cost: new Decimal("1e976"),
         unlocked () {return hasUpgrade("a",25)},
currencyDisplayName: "multi points",
currencyInternalName: "points",
currencyLayer: "m",
            
        },
        27: {
            title: "Meddleweed",
            description: "Subtract the goal of Anti-Queens and Antitrusted Multiverse based on points.",
            cost: new Decimal("1e1045"),
         unlocked () {return hasUpgrade("a",26)},
currencyDisplayName: "multi points",
currencyInternalName: "points",
currencyLayer: "m",
effect() {
                
              
    let eff = player.points.add(1).log10().sqrt().div(25).times(1);
    return eff;
},


effectDisplay() { return "-"+format(tmp.a.upgrades[27].effect) },
        },	
        31: {
            title: "Whiskerbloom",
            description: "Raise the Points gain based on Ultra Points.",
            cost: new Decimal("1e1117"),
         unlocked () {return hasUpgrade("a",27)},
currencyDisplayName: "multi points",
currencyInternalName: "points",
currencyLayer: "m",
effect() {
                
              
    let eff = player.u.points.plus(1).pow(0.03)
    if (getClickableState('n', 11)) eff = eff.times(1.05)
    if (hasChallenge("a",32)) eff =eff.times(1.2)
    return eff;
},


effectDisplay() { return "^"+format(tmp.a.upgrades[31].effect) },
        },	
        32: {
            title: "Chimerose",
            description: "Unlock Squid Buyables.",
            cost: new Decimal("1e1131"),
         unlocked () {return hasUpgrade("a",31)},
currencyDisplayName: "multi points",
currencyInternalName: "points",
currencyLayer: "m",

        },	   

        
        33: {
            title: "Nursetulip",
            description: "Unlock Nurses (layer).",
            cost: new Decimal("1e1429"),
         unlocked () {return hasUpgrade("a",32)},
currencyDisplayName: "multi points",
currencyInternalName: "points",
currencyLayer: "m",

        },	
        34: {
            title: "Drowsyfern",
            description: "Unlock another Nurseries, and unlock Anti-Nurse challenge.",
            cost: new Decimal(400),
         unlocked () {return hasUpgrade("a",33)&&player.n.unlocked},
currencyDisplayName: "nursery points",
currencyInternalName: "points",
currencyLayer: "n",

        },	
        35: {
            title: "Wardlichen",
            description: "Points multiply the Nursery gain, and unlock Type I Nurseries",
            cost: new Decimal(4000),
         unlocked () {return hasUpgrade("a",34)},
currencyDisplayName: "nursery points",
currencyInternalName: "points",
currencyLayer: "n",
effect() {
                
              
    let eff = player.points.plus(1).pow(0.009)
 
    return eff;
},


effectDisplay() { return format(tmp.a.upgrades[35].effect)+"x" },
        },	 
        36: {
            title: "Keenmoss",
            description: "Unlock Type I Nurseries",
            cost: new Decimal(1e14),
         unlocked () {return hasUpgrade("a",35)},
currencyDisplayName: "nursery points",
currencyInternalName: "points",
currencyLayer: "n",

        },	 
        37: {
            title: "Queenbeet",
            description: "Remove the softcaps for all Multi Buyables, but they are 1e25x weaker and pow cost increases to 2. Unlock Queenbeet (buyable)",
            cost: new Decimal(7.5e17),
         unlocked () {return hasUpgrade("a",36)},
currencyDisplayName: "nursery points",
currencyInternalName: "points",
currencyLayer: "n",

        },	 
        41: {
            title: "Juicy Queenbeet",
            description: "Administration's effect is cubed.",
            cost: new Decimal(1e47),
         unlocked () {return hasUpgrade("a",37)&&getBuyableAmount("n",21).gte(1)},
currencyDisplayName: "nursery points",
currencyInternalName: "points",
currencyLayer: "n",

        },	 
        42: {
            title: "Duketater",
            description: "Unlock 3rd Nursery, and Type II Nurseries",
            cost: new Decimal(5e48),
         unlocked () {return hasUpgrade("a",41)&&getBuyableAmount("n",21).gte(4)},
currencyDisplayName: "nursery points",
currencyInternalName: "points",
currencyLayer: "n",


        },	 
        43: {
            title: "Crumbspore",
            description: "Unlock Absol Perpetuals, Nursery Points gain is multiplied by 6.",
            cost: new Decimal(1e49),
         unlocked () {return hasUpgrade("a",42)&&getBuyableAmount("n",22).gte(1)},
currencyDisplayName: "nursery points",
currencyInternalName: "points",
currencyLayer: "n",


        },	 
        44: {
            title: "Doughshroom",
            description: "Absol Perpetuals multiply Multi Points gain (Effect is magnified by your Points)",
            cost: new Decimal(2.5e6),
         unlocked () {return hasUpgrade("n",33)},
currencyDisplayName: "absol perpetuals",
currencyInternalName: "absolPer",
currencyLayer: "n",
effect() {
                
              
    let eff = player.n.absolPer.plus(1).pow(0.1).times(player.points.pow(0.02))
 
    return eff;
},


effectDisplay() { return format(tmp.a.upgrades[44].effect)+"x" },

        },	 
        45: {
            title: "Glovemorel",
            description: "Cost scalings for Squid Buyables are reduced by 10%.",
            cost: new Decimal(3.5e77),
         unlocked () {return hasUpgrade("a",44)&&getBuyableAmount("n",21).gte(50)},
currencyDisplayName: "nursery points",
currencyInternalName: "points",
currencyLayer: "n",


        },	 
    }, 
    challenges: {
        11: {
            name: "Lucky Chancemakers",
            challengeDescription: "<b>Multipoints</b> upgrade does nothing.",
            currencyDisplayName: "multi points",
            currencyInternalName: "points",
            currencyLayer: "m",
          goal(){
           return new Decimal(1e8);
                
              
            },
            onEnter() {
player.points = new Decimal(0),

player.m.points = new Decimal(0),
player.m.best = new Decimal(0),
player.m.total = new Decimal(0),
player.a.time = new Decimal(1)

  if(!hasUpgrade("n",14)) player.m.upgrades = []

            },
            rewardDescription: "<b>Absolute Divider</b> is 5 times as efficient, and unlock a row of Multi Upgrades.",
         
        },
        12: {
            name: "Antitrusted Multiverse",
           challengeDescription() {
            return "All Multi Upgrades with effects are divided by " +format(tmp.a.upgradeNerfChallenge)+"."
            + "<br>"+challengeCompletions(this.layer, this.id)+"/15"
             + " completions";
        },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            
            scalePower() {
                let power = new Decimal(1);
                
                return power;
            },
            completionLimit() { 
                let lim = 15;
                
                return lim;
            },
goal() {
                let comps = Decimal.mul(challengeCompletions("a", 12), tmp.a.challenges[this.id].scalePower);
                if (comps.gte(5)) comps = comps.times(1.1);
                if (comps.gte(7)) comps = comps.times(1.2);
                if (comps.gte(9)) comps = comps.times(1.2);
                if (comps.gte(10)) comps = comps.times(1.5);

             

                if (hasUpgrade("a",22)) comps = comps.times(0.2);
                if (hasUpgrade("a",27)) comps = comps.sub(upgradeEffect("a",27))
                return Decimal.pow(400, Decimal.pow(comps, 3)).times(1e7);
            },

            rewardEffect() { 
                let eff = Decimal.pow(1.35, Decimal.pow(challengeCompletions("a", 12), 2));
                if (!eff.eq(eff)) eff = new Decimal(1);
                return eff;
            },
            rewardDisplay() { return format(tmp.a.challenges[12].rewardEffect)+"x to Multi Points gain." },
       
            onEnter() {
player.points = new Decimal(0),
player.m.points = new Decimal(0),
player.m.best = new Decimal(0),
player.m.total = new Decimal(0)

if(!hasUpgrade("n",14)) player.m.upgrades = []

player.a.time = new Decimal(1)

            },
            rewardDescription: "Concurrent multiplier to Multi points gain.",
          unlocked() { return player.a.points.gte(6)}
        },
        21: {
            name: "Flysquirrel",
           
            challengeDescription() {
                return "Points gain is brought to the 1e27th root and Multi Point gain square roots overtime in this challenge. <br>Currently: Brought to the " +format(player.a.time)+"th square root."
       ;
            },
            currencyDisplayName: "multi points",
            currencyInternalName: "points",
            currencyLayer: "m",
          goal(){
           return new Decimal(1e28);
                
              
            },
            onEnter() {
player.points = new Decimal(0),
player.m.points = new Decimal(0),
player.m.best = new Decimal(0),
player.m.total = new Decimal(0)
if(!hasUpgrade("n",14)) player.m.upgrades = []

player.a.time = new Decimal(1)

            },
            rewardDescription: "Cost scaling for Baker's Wheat is reduced by 33.33%.",
         unlocked() {return hasUpgrade("a",14)}
        },
        22: {
            name: "Anti-Queens",
           challengeDescription() {
            return "Points and Multi Points buyable have cost scalings " +format(tmp.a.costScalingStartHarsh)+"x stronger."
            + "<br>"+challengeCompletions(this.layer, this.id)+"/15"
             + " completions";
        },
        currencyDisplayName: "multi points",
        currencyInternalName: "points",
        currencyLayer: "m",
            
            scalePower() {
                let power = new Decimal(1);
                
                return power;
            },
            completionLimit() { 
                let lim = 15;
                
                return lim;
            },
goal() {
                let comps = Decimal.mul(challengeCompletions("a", 22), tmp.a.challenges[this.id].scalePower);
                if (comps.gte(5)) comps = comps.sub(2.5);
                if (comps.gte(7)) comps = comps.times(2);
                if (hasUpgrade("a",27)) comps = comps.sub(upgradeEffect("a",27))
                return Decimal.pow(1e24, Decimal.pow(comps, 3)).times(1e250);
            },

            rewardEffect() { 
                let eff = Decimal.pow(3, Decimal.pow(challengeCompletions("a",22), 2));
                if (!eff.eq(eff)) eff = new Decimal(1);
                if (player.a.challenges[22]>=1 ) eff = eff.times(tmp.u.buyables[11].effect.first)
                if (hasUpgrade("a",32) ) eff = eff.times(tmp.a.buyables[23].effect.first)
                return eff;
            },
            rewardDisplay() { return "/"+format(tmp.a.challenges[22].rewardEffect)+" to Ultra Points requirement." },
       
            onEnter() {
player.points = new Decimal(0),
player.m.points = new Decimal(0),
player.m.best = new Decimal(0),
player.m.total = new Decimal(0)
if(!hasUpgrade("n",14)) player.m.upgrades = []
player.a.time = new Decimal(1)

            },
            rewardDescription: "Divide requirements for Ultra Points.",
          unlocked() { return hasUpgrade("a",17)}
        },
        31: {
            name: "Brown Mold",
           
            challengeDescription: "Multi Point's multi and exponent gain is at 1 and cannot be buffed.",
            currencyDisplayName: "multi points",
            currencyInternalName: "points",
            currencyLayer: "m",
          goal(){
           return new Decimal(1e11);
                
              
            },
            onEnter() {
player.points = new Decimal(0),
player.m.points = new Decimal(0),
player.m.best = new Decimal(0),
player.m.total = new Decimal(0)
if(!hasUpgrade("n",14)) player.m.upgrades = []
player.a.time = new Decimal(1)

            },
            rewardDescription: "Cap for <b>Pointy Multiplier</b> upgrade is cubed.",
         unlocked() {return hasUpgrade("a",26)}
        },
        32: {
            name: "Anti-Nurse",
           
            challengeDescription: "Points gain is ^0.08, all hardcaps start earlier and Multi Point's exponent is ^0.5",
            currencyDisplayName: "points",
            currencyInternalName: "points",
      
          goal(){
           return new Decimal(1e31);
                
              
            },
            onEnter() {
player.points = new Decimal(0),
player.m.points = new Decimal(0),
player.m.best = new Decimal(0),
player.m.total = new Decimal(0)
if(!hasUpgrade("n",14)) player.m.upgrades = []
player.a.time = new Decimal(1)

            },
            rewardDescription: "Whiskerbloom effect is multiplied by 1.2x.",
         unlocked() {return hasUpgrade("a",34)}
        },
    },

    milestones: {
        0: {
            requirementDescription: "2 Absolute Points",
            effectDescription: "Keep Multi Upgrades on reset.",
            done() { return player.a.points.gte(2) }
        },
        1: {
            requirementDescription: "3 Absolute Points",
            effectDescription: "Automate the first 3 Multi Buyables.",
            done() { return player.a.points.gte(3) },
            toggles: [
                ["m","auto"],
              ]

        },
        2: {
            requirementDescription: "5 Absolute Points",
            effectDescription: "Unlock Challenges.",
            done() { return player.a.points.gte(5) },
          

        },
        3: {
            requirementDescription: "8 Absolute Points",
            effectDescription: "Gain 100% of Multi Points per second.",
            done() { return player.a.points.gte(8) },
          

        },
        4: {
            requirementDescription: "10 Absolute Points",
            effectDescription: "Automate the next 1 Multi Buyable and unlock Upgrades.",
            done() { return player.a.points.gte(10) },
            toggles: [
                ["m","auto2"],
              ]

        }
       
    } 
})

addLayer("u", {
    name: "ultra", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "U", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        time: new Decimal(1),
    }},
    color: "blue",
    requires: new Decimal("6.666e666"), // Can be a function that takes requirement increases into account
    resource: "ultra points", // Name of prestige currency
    baseResource: "multi points", // Name of resource prestige is based on
    baseAmount() {return player.m.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 4, // Prestige currency exponent
    base: 4096,
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)



     if (hasChallenge("a",22)) mult = mult.div(challengeEffect("a",22))
     if (hasUpgrade("a",42)) mult = mult.div(tmp.n.buyables[13].effect.first)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        let exp = new Decimal(1)
       
        return exp;
    },
   branches: ["m"],
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {
            key:"U", description: "U: Reset for ultra points", onPress() {
                if (canReset(this.layer)&&!player.s.unlocked)
                    doReset(this.layer)
            }
        },
    ],
    effectDescription() {
        return "which are boosting Multi Points gain by "+format(tmp.u.effect)+"x."
    },
    resetsNothing() {return hasMilestone("n",1)},
    autoPrestige() {return hasMilestone("n",1)},
    
    addToBase() {
        let base = new Decimal(0);
    if (hasUpgrade("a",23)) base= base.add(upgradeEffect("a",23))
    if (hasUpgrade("a",24)) base= base.add(upgradeEffect("a",24))
        return base;
    },
    doReset(resettingLayer) {
        let keep = [];
    
        player.u.time = new Decimal(1)
        if (hasMilestone("n",0)) keep.push("buyables")
        if (layers[resettingLayer].row > this.row) layerDataReset("u", keep)
    },
    /* update(diff) {
      if (inChallenge("a",21)) player.a.time = player.a.time.plus(diff)

    }, */
    effectBase() {
        let base = new Decimal(1.11);
        
        // ADD
        base = base.plus(tmp.u.addToBase);
        
        // MULTIPLY
      
        
        return base.pow(tmp.u.power);
    },
    power() {
        let power = new Decimal(1);
 
        return power;
    },
    
    effect() {
        return Decimal.pow(tmp.u.effectBase, player.u.points.plus()).max(1).times(1);
    },
    layerShown(){return hasUpgrade("a",16)||player.u.unlocked&&!player.s.unlocked},
    tabFormat: {
        "Main": {
            buttonStyle() { return {'background-color': 'blue'} },
            content: ["main-display",
            "prestige-button",
            "resource-display", "blank",
           
            "milestones",
           
            "blank",
            "upgrades",
        ]},
        
        "Buyables": {
           
            content: [
            "main-display", "blank",
           
            "buyables",
           
            "blank",
        ]},

    
    },
    buyables: {
        11: {
          costScaling() {let cost =  new Decimal(1)
        if (getBuyableAmount("u",11).gte(35)) cost = cost.add(5)

return cost;
         },
            cost(x) { return new Decimal("1e800").mul(new Decimal(1e135).pow(x).pow(tmp[this.layer].buyables[this.id].costScaling)) },
            title() { return "Strength I" },

            display() { // Everything else displayed in the buyable button after the title
                let data = tmp[this.layer].buyables[this.id]
                return "Cost: " + format(data.cost) + " multi points\n\
                Amount: " + player[this.layer].buyables[this.id] + "\n\
               Multiply the reward effect of Anti-Queens by " + format(data.effect.first) + "x. "
            },
            effect(x) { // Effects of owning x of the items, x is a decimal
                let eff = {}
                if (x.gte(0)) eff.first = Decimal.pow(1.5, x.pow(1.3541))
                else eff.first = Decimal.pow(1/45, x.times(-1).pow(1.0))
            
                if (x.gte(0)) eff.second = x.pow(0.8)
                else eff.second = x.times(-1).pow(0.8).times(-1)
                return eff;
            },
            canAfford() { return player.m.points.gte(this.cost()) },
            buy() {
                player.m.points = player.m.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },

            unlocked () {return (player.a.challenges[22]>=1)}
        },
      
        
    },
})
addLayer("n", {
    name: "nurses", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "N", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        best: new Decimal(0),
        total: new Decimal(0),
        time: new Decimal(1),
        absolPer: new Decimal(0),
        absolPerTotal: new Decimal(0),
        food: new Decimal(0),
        umvuthiUnl: false,
    }},
    color: "goldenrod",
    requires: new Decimal("1e1431"), // Can be a function that takes requirement increases into account
    resource: "nursery points", // Name of prestige currency
    baseResource: "multi points", // Name of resource prestige is based on
    baseAmount() {return player.m.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.005, // Prestige currency exponent
    passiveGeneration() { return (hasUpgrade("n", 24))?1:0 },
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)

  

  if (hasUpgrade("n",13)) mult = mult.times(upgradeEffect("n",13))
  if (hasUpgrade("a",35)) mult = mult.times(upgradeEffect("a",35))
  if (hasUpgrade("n",15)) mult = mult.times(upgradeEffect("n",15))
  if (hasUpgrade("a",43)) mult = mult.times(6)
  if (hasUpgrade("n",21)) mult = mult.times(upgradeEffect("n",21))
  if (hasUpgrade("n",22)) mult = mult.times(upgradeEffect("n",22))
  if (hasUpgrade("n",33)) mult = mult.times(upgradeEffect("n",33))
  if (getBuyableAmount("n",41).gte(1)) mult =mult.times(tmp.n.buyables[41].effect.first)
        return mult


    },
    update(diff) {
        if (hasUpgrade("n",25)) player.n.absolPer = player.n.absolPer.add(tmp.n.clickables[31].gain)
        if (hasUpgrade("n",25)) player.n.absolPerTotal = player.n.absolPerTotal.add(tmp.n.clickables[31].gain)
      },
    
    gainExp() { // Calculate the exponent on main currency from bonuses
        let exp = new Decimal(1)
       if (hasUpgrade("m",37)) exp = exp.add(0.05)
       if (hasUpgrade("n",14)) exp = exp.add(upgradeEffect("n",14))
        return exp;
    },
    directMult() {
        mult = new Decimal(1)
       
        if (hasUpgrade("n", 15)) mult = mult.add(tmp.n.buyables[21].effect);
        if (getClickableState('n', 13)) mult = mult.times(5)
        return mult
    },
    softcap: new Decimal(1e175),
    softcapPower() {let power = new Decimal(0.5)

     if (player.n.points.gte(1e175)) power = power.div(player.n.points.div(2))
  
        return power;
    },
   branches: ["u","a"],
    row: 2, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {
            key:"n", description: "N: Reset for nursery points", onPress() {
                if (canReset(this.layer)&&!player.s.unlocked)
                    doReset(this.layer)
            }
        },
    ],
    foodATB() {
        let base = new Decimal(0);

        return base;
    },


    foodEffBase() {
        let base = new Decimal(4);
        
        // ADD
        base = base.plus(tmp.n.foodATB);
        
        // MULTIPLY
        if (getBuyableAmount("n",31).gte(1)) base = base.times(tmp.n.buyables[31].effect.first)
        
        return base.pow(tmp.n.foodPow);
    },
    foodPow() {
        let power = new Decimal(1);
   
        return power;
    },
  
    

    foodEffect() {
        return Decimal.pow(tmp.n.foodEffBase, player.n.food.plus()).max(1).times(1);
    },
    doReset(resettingLayer) {
        let keep = [];
    
   
    
        if (layers[resettingLayer].row > this.row) layerDataReset("n", keep)
    },
  
    milestones: {
        0: {
            requirementDescription: "4 Total Nursery Points",
            effectDescription: "Keep previous progress.",
            done() { return player.n.total.gte(4) }
        },
        1: {
            requirementDescription: "25 Total Nursey Points",
            effectDescription: "Automatically gain Absolute and Ultra Points and they reset nothing.",
            done() { return player.n.total.gte(25) },
          

        },
        
       
    } ,
    layerShown(){return hasUpgrade("a",33)||player.n.unlocked&&!player.s.unlocked},
    microtabs: {
        stuff: {
            "Main": {
                content: [
                    ["blank", "15px"],
                    ["row", [["upgrade", 11],["upgrade", 12],["upgrade", 13],["upgrade", 14],["upgrade", 15],["upgrade", 16]]],
                    ["blank", "15px"],
                    ["row", [["upgrade", 21],["upgrade", 22],["upgrade", 23],["upgrade", 24],["upgrade", 25],["upgrade", 26]]],
                    ["blank", "15px"],
                    ["row", [["upgrade", 31],["upgrade", 32],["upgrade", 33],["upgrade", 34],["upgrade", 35],["upgrade", 36]]],
                    ["blank", "15px"],
                ]
            },
            "Nurses": {
              
                content: [
                    ["blank", "15px"],
                    ["row", [["buyable", 11],["buyable", 12],["buyable", 13],["buyable", 14],["buyable", 15]]],
               
                ]
            },
           
            "Nurseries": {
                
                content: [
                
                    ["clickable",21],
                    ["display-text", () => "You can only have 1 Nurseries active at a time. TIP: Reset active powers multiple times if you are stuck, or choose a different nursery after reaching more than 1e10 Nurseries!"],
                    ["blank", "15px"],
                    ["row", [["clickable", 11],["clickable", 12],["clickable", 13]]],
                 
                    
                ]
            },
            "Hatcheries": {
                            unlocked: () => 	(hasUpgrade("n",15)),
                content: [
                
                
                    ["display-text", () => "NOTE: Getting a certain amuont of Hatcheries unlocks a certain Absolute Upgrade!"],
                    ["blank", "15px"],
                    ["row", [["buyable", 21],["buyable", 22],["buyable", 23]]],
                 
                    
                ]
            },
            "Absols": {
                unlocked: () => 	(hasUpgrade("a",43)),
    content: [
    
        ["display-text", () => "You have "+formatWhole(player.n.absolPer)+" Absol Perpetuals." ],
        ["blank", "15px"],
        ["display-text", () => "You have made a total of "+formatWhole(player.n.absolPerTotal)+" Absol Perpetuals." ],
        ["blank", "15px"],
        ["display-text", () => "Reach 1e12 Absol Perpetuals to unlock Umvuthi the Sunbird." ],
      ["bar", "umvuthiProgress"],
       ["blank", "15px"],
        ["row", [["clickable", 31]]],
        ["blank", "15px"],
       
     
        
    ]
},
"Sunbird": {
    unlocked: () => 	(player.n.absolPer.gte(1e12)||player.n.umvuthiUnl),
content: [

["display-text", () => "You have "+formatWhole(player.n.absolPer)+" Absol Perpetuals." ],
["blank", "15px"],
["display-text", () => "You have made a total of "+formatWhole(player.n.absolPerTotal)+" Absol Perpetuals." ],
["blank", "15px"],
["display-text", () => (
    (player.n.food.gte(6))
    ) ? "<br><span style='color:orange'>After 6 food, the Absol Perpetuals required to generate Food gets harsher!</span><br>" : ""],
    ["blank", "25px"],
["bar", "newLayer"],
["display-text", () => "You have <h1 style='color: goldenrold; text-shadow: goldenrod 0px 0px 10px;'>"+formatWhole(player.n.food)+"</h1> Food, which are multiplying the Absol Perpetual gain by "+formatWhole(tmp.n.foodEffect)+"x." ],
["row", [["clickable", 41]]],
["blank", "25px"],
["row", [["buyable", 31],["buyable", 32],["buyable", 33]]],
["row", [["buyable", 41],["buyable", 42],["buyable", 43]]],
["display-text", () => "<h3>Umvuthi Power: "+formatWhole(tmp.n.umvuthiPow)+"</h3>, which is boosting Umvuthana effect with the same amount." ],
["display-text", () =>    (getBuyableAmount("n",32).gte(6)) ? "<h3>Abavuthana Power: "+formatWhole(tmp.n.abavuthanaPow)+"</h3>, which is boosting Umvuthi Power's effect with the same amount.":""],

]
},

        },
       
    },
    umvuthiPow() {
        let umvuthi = new Decimal(1);
        if (getBuyableAmount("n",32).gte(1)) umvuthi = umvuthi.times(tmp.n.buyables[32].effect.first)
        if (getBuyableAmount("n",33).gte(1)) umvuthi = umvuthi.times(tmp.n.abavuthanaPow)
        return umvuthi;
    },
    abavuthanaPow() {
        let aba = new Decimal(1);
        if (getBuyableAmount("n",33).gte(1)) aba =aba.times(tmp.n.buyables[33].effect.first)
        if (getBuyableAmount("n",41).gte(1)) aba =aba.times(tmp.n.buyables[41].effect.first)
        return aba;
    },
    tabFormat: [
        "main-display",
        "prestige-button",
       "resource-display",
       "milestones",
       ["display-text", () => (
        (player.n.points.gte(1e175))
        ) ? "<br><span style='color:orange'>Due to too much medications, Nursery Points gain will be divided the more you have Nursery Points.</span><br>" : ""],
        ["blank", "25px"],
        ["blank", "25px"],
       
        ["blank", "15px"],
        ["microtabs", "stuff"],
        ["blank", "15px"],
    ],
    
    upgrades: {
			
        11: {
            title: "Nursery Health",
            description: "Multiply Points and Multi Points based on your total Nursery Points.",
            cost: new Decimal(1),
            cap() { let cap = new Decimal(1e35)
                if (hasUpgrade("n",26)) cap = cap.times(24)
                               return cap; },
                           
                           effect() {
                               
                             
                               let eff = player.n.total.plus(1).pow(1.85).min(tmp.n.upgrades[this.id].cap);
               
                   
                               return eff;
                           },
                           
                           effectDisplay() { return format(tmp.n.upgrades[11].effect)+"x"+(tmp.n.upgrades[11].effect.gte(tmp.n.upgrades[this.id].cap)?" (HARDCAPPED)":"") },
                          
        },	
        12: {
            title: "Medication",
            description: "Nursery Points reduces the cost scaling of Squid Buyable I and keep Absolute Challenge completions.",
            cost: new Decimal(1),
           unlocked() {return hasUpgrade("n",11)},
         effect() {           
            let eff = player.n.points.add(1).log10()
            return eff;
        },
        
        effectDisplay() { return "-"+format(tmp.n.upgrades[12].effect) },         
        },	
        13: {
            title: "Administration",
            description: "Gain more Nursery Points based on Absolute Points (effect is magnified by your Ultra Points).",
            cost: new Decimal(25),
           unlocked() {return hasUpgrade("n",12)},
         effect() {           
            let eff = player.a.points.plus(1).pow(0.15).times(player.u.points.plus(1).pow(0.125))
            if (hasUpgrade("a",41)) eff = eff.pow(3)
            return eff;
        },
        
        effectDisplay() { return format(tmp.n.upgrades[13].effect)+"x" },         
        },	
        14: {
            title: "Healing",
            description: "Entering Absolute Challenges don't reset Multi upgrades and Multi Points add to the Nursery Point's exponent.",
            cost: new Decimal(60),
           unlocked() {return hasUpgrade("n",13)},
         effect() {           
            let eff = player.m.points.add(1).log10().sqrt().div(75).times(1);
            return eff;
        },
        
        effectDisplay() { return "+"+format(tmp.n.upgrades[14].effect) },         
        },
        15: {
            title: "Hatchery",
            description: "Unlock Nursery Hatcheries. Nursery Points gain is <br>(Multi+1^0.002x<br>(Points+1^0.005))",
            cost: new Decimal(5e23),
           unlocked() {return hasUpgrade("n",14)},
           effect() {           
            let eff = player.m.points.plus(1).pow(0.002).times(player.points.plus(1).pow(0.005))
            return eff;
        },
        
        effectDisplay() { return format(tmp.n.upgrades[15].effect)+"x" },     
     
        },	
        21: {
            title: "Medical Marionette",
            description: "Absol Perpetuals multiply Nursery Points gain.",
            cost: new Decimal(5),
           unlocked() {return hasUpgrade("n",15)&&hasUpgrade("a",43)},
           currencyDisplayName: "absol perpetuals",
currencyInternalName: "absolPer",
currencyLayer: "n",
           effect() {           
            let eff = player.n.absolPer.plus(1).pow(0.32)
            return eff;
        },
        
        effectDisplay() { return format(tmp.n.upgrades[21].effect)+"x" },     
     
        },	
        22: {
            title: "Health Sensor",
            description: "Gain twice as much Absol Perpetuals. Nursery Points gain is <br>(Absolute+1^0.085x<br>(Points+1^0.004))",
            cost: new Decimal(10),
           unlocked() {return hasUpgrade("n",21)},
           currencyDisplayName: "absol perpetuals",
currencyInternalName: "absolPer",
currencyLayer: "n",
effect() {           
    let eff = player.a.points.plus(1).pow(0.085).times(player.points.plus(1).pow(0.004))
    return eff;
},

effectDisplay() { return format(tmp.n.upgrades[22].effect)+"x" },    
     
        },	
        23: {
            title: "Epinephrine",
            description: "Points gain is multiplied by your Absol Perpetuals (Effect is magnified with Absolute Points)",
            cost: new Decimal(100),
           unlocked() {return hasUpgrade("n",22)},
           currencyDisplayName: "absol perpetuals",
currencyInternalName: "absolPer",
currencyLayer: "n",
effect() {           
    let eff = player.n.absolPer.plus(1).pow(0.725).times(player.a.points.plus(1).pow(0.6))
    return eff;
},

effectDisplay() { return format(tmp.n.upgrades[23].effect)+"x" },    
     
        },	
        24: {
            title: "Multiheal",
            description: "Gain 100% of Nursery Points per second.",
            cost: new Decimal(150),
           unlocked() {return hasUpgrade("n",23)},
           currencyDisplayName: "absol perpetuals",
currencyInternalName: "absolPer",
currencyLayer: "n",

     
        },
        25: {
            title: "Absoluteheal",
            description: "Automatically gain Absol Perpetuals every second.",
            cost: new Decimal(225),
           unlocked() {return hasUpgrade("n",24)},
           currencyDisplayName: "absol perpetuals",
currencyInternalName: "absolPer",
currencyLayer: "n",

     
        },	
        16: {
            title: "Epinephrinekonin",
            description: "Points gain is multiplied based on Nursery Points.",
            cost: new Decimal(15000),
           unlocked() {return hasUpgrade("n",25)},
           currencyDisplayName: "absol perpetuals",
currencyInternalName: "absolPer",
currencyLayer: "n",
effect() {           
    let eff = player.n.points.plus(1).pow(0.65)
    return eff;
},

effectDisplay() { return format(tmp.n.upgrades[16].effect)+"x" },    
     
     
        },	
        26: {
            title: "Recovery",
            description: "The hardcap for Nursery Health is extended 24 times.",
            cost: new Decimal(16000),
           unlocked() {return hasUpgrade("n",16)},
           currencyDisplayName: "absol perpetuals",
currencyInternalName: "absolPer",
currencyLayer: "n",
     
        },	
        31: {
            title: "Pointy Hardextension",
            description: "The hardcap for Pointy upgrade starts later based on Points.",
            cost: new Decimal(25000),
           unlocked() {return hasUpgrade("n",26)},
           currencyDisplayName: "absol perpetuals",
currencyInternalName: "absolPer",
currencyLayer: "n",
effect() {           
    let eff = player.points.plus(1).pow(0.005)
    return eff;
},

effectDisplay() { return format(tmp.n.upgrades[31].effect)+"x later" },    
     
        },
        32: {
            title: "Lemeka Treasure",
            description: "Gain more Absol Perpetuals based on Points.",
            cost: new Decimal(32000),
           unlocked() {return hasUpgrade("n",31)},
           currencyDisplayName: "absol perpetuals",
currencyInternalName: "absolPer",
currencyLayer: "n",
effect() {           
    let eff = player.points.plus(1).pow(0.0009)
    return eff;
},

effectDisplay() { return format(tmp.n.upgrades[32].effect)+"x" },    
     
        },	
        33: {
            title: "Absol Repeaters",
            description: "Unlock Absolities. Nursery Points gain is <br>(Nursery+1^0.002x<br>(Points+1^0.003))",
            cost: new Decimal(150000),
           unlocked() {return hasUpgrade("n",32)},
           currencyDisplayName: "absol perpetuals",
currencyInternalName: "absolPer",
currencyLayer: "n",
effect() {           
    let eff = player.n.points.plus(1).pow(0.002).times(player.points.plus(1).pow(0.003))
    return eff;
},

effectDisplay() { return format(tmp.n.upgrades[33].effect)+"x" },    

        },	
        
    }, 
   
    clickables: {
        11: {
            title: "Nursery Power",
            display() {
                if(!getClickableState(this.layer, this.id)) return "Whiskerbloom's effect is multiplied by 1.05."; else return "Whiskerbloom's effect is multiplied by 1.05.<br>ACTIVE"
            },
            canClick() {
               
               
               
                    if(!getClickableState(this.layer, 12) && !getClickableState(this.layer, 13)) return true; else return false
                
            },
            onClick() {
                setClickableState(this.layer, this.id, true)
            },
            unlocked() {return player.n.unlocked},
        },
        12: {
            title: "Nursery Power 2",
            display() {
                if(!getClickableState(this.layer, this.id)) return "Points gain is raised ^1.2."; else return "Points gain is raised ^1.2.<br>ACTIVE"
            },
            canClick() {
               
               
               
                    if(!getClickableState(this.layer, 11) && !getClickableState(this.layer, 13)) return true; else return false
                
            },
            onClick() {
                setClickableState(this.layer, this.id, true)
            },
            unlocked() {return hasUpgrade("a",27)},
        },
        13: {
            title: "Nursery Power 3",
            display() {
                if(!getClickableState(this.layer, this.id)) return "Direct multi for Nursery Points is multiplied by 5."; else return "Direct multi for Nursery Points is multiplied by 5.<br>ACTIVE"
            },
            canClick() {
               
               
               
                    if(!getClickableState(this.layer, 11) && !getClickableState(this.layer, 12)) return true; else return false
                
            },
            onClick() {
                setClickableState(this.layer, this.id, true)
            },
            unlocked() {return hasUpgrade("a",42)},
        },
        21: {
            display() { return "Click here to reset Nurseries (forces a Nursery Reset)"},
           
            canClick() {
               
               
               
                    if(getClickableState(this.layer, 11) || getClickableState(this.layer, 12) || getClickableState(this.layer, 13)) return true; else return false
                
            },
            onClick() {
            
                doReset("n", true)

                for (var a = 11; a <= 13; a++) setClickableState(this.layer, a, false)
                  
            },
            unlocked() {return player.n.unlocked},
        },
        31: {
            gain() { 
                let n = player.n.points.add(1).max(1)
                if (n.lt("1e50")) return new Decimal(0)
                n = Decimal.pow(55,n.log10().div(50).sub(1)).max(1).mul(tmp.n.clickables[31].gainmult)
                return n.floor()
            },
            next() {
                let gain = tmp.n.clickables[31].gain.add(1).max(1)
                let next = Decimal.pow(3,gain.div(tmp.n.clickables[31].gainmult).log10().add(1).max(1).mul(50))
                return next
            },
            gainmult() {
                let mult = new Decimal(1)
            if (hasUpgrade("n",22)) mult = mult.times(2)
            if (hasUpgrade("n",32)) mult = mult.times(upgradeEffect("n",32))
            if (hasUpgrade("n",33)) mult = mult.times(tmp.n.buyables[23].effect.first);
            if (player.n.umvuthiUnl) mult = mult.times(tmp.n.foodEffect)
                return mult;
            },
            display() {
                let dis = "Reset Nursery Points for +<h3>" + formatWhole(tmp.n.clickables[31].gain) + "</h3> Absol Perpetuals<br>" /*+"<br>Next at " + format(tmp.n.clickables[31].next) + " nursery points"
            */
           
                return dis
            },
            canClick() {
                return player.n.points.gte(1e50)&&hasUpgrade("a",43)
            },
            onClick() {
              player.n.absolPer = player.n.absolPer.add(tmp.n.clickables[31].gain)
                player.n.absolPerTotal = player.n.absolPerTotal.add(tmp.n.clickables[31].gain)
                player.n.points = new Decimal(0)
              
                },
                style: {'height':'130px', 'width':'175px', 'font-size':'13px',
               
            
            },
            
            },
            41: {
                gain() {
                let gain = new Decimal(1)
                return gain;
                },
                
                cost() {
                    let cost = new Decimal(1e12)
                    if (player.n.food.gte(2)) cost = cost.times(player.n.food.times(2))
                    if (player.n.food.gte(5)) cost = cost.times(player.n.food.times(4))
                    if (player.n.food.gte(6)) cost = cost.add(1).pow(player.n.food.sub(4.80))
            if (getBuyableAmount("n",32).gte(1)) cost = cost.div(tmp.n.buyables[32].effect.second)
                    return cost;
                    },
                display() {
                    let dis = "Convert all of your Absol Perpetuals into food for Umvuthi, the Sunbird<br><br>You will gain "+formatWhole(tmp.n.clickables[41].gain)+" Food on conversion."
                
               
                    return dis
                },
                canClick() {
                    return player.n.absolPer.gte(tmp.n.clickables[41].cost.times(player.n.food.add(1)))
                },
                onClick() {
                  player.n.food = player.n.food.add(1)
       
                    player.n.absolPer = new Decimal(0)
                    player.n.umvuthiUnl = true
                    player.n.absolTotal = new Decimal(0)
                    },
                    style: {'height':'130px', 'width':'175px', 'font-size':'13px',
                   
                
                },
                
                },
        
        },
    
    buyables: {
        11: {
          costScaling() {let cost =  new Decimal(1)
            if (player.n.buyables[11].gte(25)) cost = cost.add(0.65)
            if (player.n.buyables[11].gte(30)) cost = cost.add(1)

            if (player.n.buyables[this.id].gte(50)) cost = cost.times(3)
return cost;
         },
            cost(x) { return new Decimal(1).mul(new Decimal(6).pow(x).pow(tmp[this.layer].buyables[this.id].costScaling)) },
            title() { return "Nursery Healing" },

            display() { // Everything else displayed in the buyable button after the title
                let data = tmp[this.layer].buyables[this.id]
                return "Cost: " + format(data.cost) + " nursery points\n\
                Amount: " + player[this.layer].buyables[this.id] + "\n\
               Multiply multi points and Nursery Points gain by " + format(data.effect.first) + "x. "
            }, 
            effect(x) { // Effects of owning x of the items, x is a decimal
                let eff = {}
                if (x.gte(0)) eff.first = Decimal.pow(1.3, x.pow(1.143))
                else eff.first = Decimal.pow(1/45, x.times(-1).pow(1.0))
            
                if (x.gte(0)) eff.second = x.pow(0.8)
                else eff.second = x.times(-1).pow(0.8).times(-1)
                return eff;
            },
            canAfford() { return player.n.points.gte(this.cost()) },
            buy() {
                player.n.points = player.n.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },

  
        },
        12: {
            costScaling() {let cost =  new Decimal(1)
                if (player.n.buyables[12].gte(3)) cost = cost.add(0.65)
                if (player.n.buyables[12].gte(4)) cost = cost.add(2)
  return cost;
           },
              cost(x) { return new Decimal(1e6).mul(new Decimal(1e6).pow(x).pow(tmp[this.layer].buyables[this.id].costScaling)) },
              title() { return "Type I Nurseries" },
  
              display() { // Everything else displayed in the buyable button after the title
                  let data = tmp[this.layer].buyables[this.id]
                  return "Cost: " + format(data.cost) + " nursery points\n\
                  Amount: " + player[this.layer].buyables[this.id] + "/6\n\
                 Raise Points gain by ^" + format(data.effect.first) + ". "
              }, 
              effect(x) { // Effects of owning x of the items, x is a decimal
                  let eff = {}
                  if (x.gte(0)) eff.first = Decimal.pow(1.04, x.pow(1.05))
                  else eff.first = Decimal.pow(1/45, x.times(-1).pow(1.0))
              
                  if (x.gte(0)) eff.second = x.pow(0.8)
                  else eff.second = x.times(-1).pow(0.8).times(-1)
                  return eff;
              },
              canAfford() { return player.n.points.gte(this.cost()) },
              buy() {
                  player.n.points = player.n.points.sub(this.cost())
                  setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
              },
          unlocked() {return hasUpgrade("a",36)},
          purchaseLimit:6,
    
          },
          13: {
            costScaling() {let cost =  new Decimal(1)
                if (player.n.buyables[13].gte(3)) cost = cost.add(0.65)
                if (player.n.buyables[13].gte(4)) cost = cost.add(2)
                if (player.n.buyables[13].gte(35)) cost = cost.add(5)
  return cost;
           },
              cost(x) { return new Decimal(1e47).pow(new Decimal(1.0015).pow(x).pow(tmp[this.layer].buyables[this.id].costScaling)) },
              title() { return "Type II Nurseries" },
  
              display() { // Everything else displayed in the buyable button after the title
                  let data = tmp[this.layer].buyables[this.id]
                  return "Cost: " + format(data.cost) + " nursery points\n\
                  Amount: " + player[this.layer].buyables[this.id] + "\n\
                 Ultra Points requirement is divided by " + format(data.effect.first) + ". "
              }, 
              effect(x) { // Effects of owning x of the items, x is a decimal
                  let eff = {}
                  if (x.gte(0)) eff.first = Decimal.pow(1.4115, x.pow(1.17251))
                  else eff.first = Decimal.pow(1/45, x.times(-1).pow(1.0))
              
                  if (x.gte(0)) eff.second = x.pow(0.8)
                  else eff.second = x.times(-1).pow(0.8).times(-1)
                  return eff;
              },
              canAfford() { return player.n.points.gte(this.cost()) },
              buy() {
                  player.n.points = player.n.points.sub(this.cost())
                  setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
              },
          unlocked() {return hasUpgrade("a",42)}
    
          },
          21: {
            costScaling() {let cost =  new Decimal(1)
           if (getBuyableAmount("n",21).gte(128)) cost = cost.add(5)
  return cost;
           },
              cost(x) { return new Decimal(1e47).pow(new Decimal(1.01).pow(x).pow(tmp[this.layer].buyables[this.id].costScaling)) },
              title() { return "Nursery Hatchery Addition" },
  
              display() { // Everything else displayed in the buyable button after the title
                  let data = tmp[this.layer].buyables[this.id]
                  return "Cost: " + format(data.cost) + " nursery points\n\
                  Amount: " + player[this.layer].buyables[this.id] + "\n\
                 Add direct multiplier to Nurse Points by +" + format(data.effect) + ". "
              }, 
             effect() {
                x=player[this.layer].buyables[this.id]

                if (!x.gte(1)) return new Decimal(0)
                let eff = Decimal.plus(1.25, x.times(0.45)).plus(tmp.n.buyables[22].effect)

        
                return eff;
            },
              canAfford() { return player.n.points.gte(this.cost()) },
              buy() {
                  player.n.points = player.n.points.sub(this.cost())
                  setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
              },
          unlocked() {return hasUpgrade("a",36)}
    
          },
          22: {
            costScaling() {let cost =  new Decimal(1)
                if (getBuyableAmount("n",22).gte(85)) cost = cost.add(5)
  return cost;
           },
              cost(x) { return new Decimal(5e48).pow(new Decimal(1.015).pow(x).pow(tmp[this.layer].buyables[this.id].costScaling)) },
              title() { return "Nursery Hatchery Addition 2" },
  
              display() { // Everything else displayed in the buyable button after the title
                  let data = tmp[this.layer].buyables[this.id]
                  return "Cost: " + format(data.cost) + " nursery points\n\
                  Amount: " + player[this.layer].buyables[this.id] + "\n\
                 Adds to Nursery Hatchery Addition's effecty by +" + format(data.effect) + ". "
              }, 
             effect() {
                x=player[this.layer].buyables[this.id]

                if (!x.gte(1)) return new Decimal(0)
                let eff = Decimal.plus(1.25, x.times(1.5))

        
                return eff;
            },
              canAfford() { return player.n.points.gte(this.cost()) },
              buy() {
                  player.n.points = player.n.points.sub(this.cost())
                  setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
              },
          unlocked() {return getBuyableAmount("n",21).gte(5)}
    
          },
          23: {
            costScaling() {let cost =  new Decimal(1)
                if (getBuyableAmount("n",23).gte(42)) cost = cost.add(3)
                if (player.n.buyables[this.id].gte(18)) cost = cost.times(3)
  return cost;
           },
              cost(x) { return new Decimal(1e73).pow(new Decimal(1.007).pow(x).pow(tmp[this.layer].buyables[this.id].costScaling)) },
              title() { return "Absolities" },
  
              display() { // Everything else displayed in the buyable button after the title
                  let data = tmp[this.layer].buyables[this.id]
                  return "Cost: " + format(data.cost) + " nursery points\n\
                  Amount: " + player[this.layer].buyables[this.id] + "\n\
                 Multiply Absol Perpetuals gain by " + format(data.effect.first) + ". "
              }, 
              effect(x) { // Effects of owning x of the items, x is a decimal
                let eff = {}
                if (x.gte(0)) eff.first = Decimal.pow(1.214, x.pow(1.172))
                else eff.first = Decimal.pow(1/45, x.times(-1).pow(1.0))
            
                if (x.gte(0)) eff.second = x.pow(0.8)
                else eff.second = x.times(-1).pow(0.8).times(-1)
                return eff;
            },
              canAfford() { return player.n.points.gte(this.cost()) },
              buy() {
                  player.n.points = player.n.points.sub(this.cost())
                  setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
              },
          unlocked() {return hasUpgrade("n",33)}
    
          },
          31: {
            costScaling() {let cost =  new Decimal(1)
           
             
  return cost;
           },
              cost(x) { return new Decimal(5).add(new Decimal(x)) },
              title() { return "Umvuthana" },
  
              display() { // Everything else displayed in the buyable button after the title
                  let data = tmp[this.layer].buyables[this.id]
                  return "Cost: " + format(data.cost) + " food\n\
                  Amount: " + player[this.layer].buyables[this.id] + "\n\
                 Multiply the effect of Food by " + format(data.effect.first) + ". "
              }, 
              effect(x) { // Effects of owning x of the items, x is a decimal
                let eff = {}
                if (x.gte(0)) eff.first = Decimal.pow(1.3, x.pow(1.1)).times(tmp.n.umvuthiPow)
                else eff.first = Decimal.pow(1/45, x.times(-1).pow(1.0))
            
                if (x.gte(0)) eff.second = Decimal.pow(2, x.pow(1.15))
                else eff.second = Decimal.pow(1/45, x.times(-1).pow(1.0))
                return eff;
            },
              canAfford() { return player.n.food.gte(this.cost()) },
              buy() {
                  player.n.food = player.n.food.sub(this.cost())
                  setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
              },
          unlocked() {return player.n.food.gte(5)||getBuyableAmount("n", 31).gte(1)}
    
          },
          32: {
            costScaling() {let cost =  new Decimal(1)
           if (getBuyableAmount("n",32).gte(4)) cost = cost.add(0.5)
           if (getBuyableAmount("n",32).gte(9)) cost = cost.add(x.div(100))
           if (getBuyableAmount("n",32).gte(12)) cost = cost.add(x.div(50))
  return cost;
           },
           cost(x) { return new Decimal(1e20).mul(new Decimal(10).pow(x.times(tmp.n.buyables[32].costScaling))) },
              title() { return "Umvuthana Raptor" },
  
              display() { // Everything else displayed in the buyable button after the title
                  let data = tmp[this.layer].buyables[this.id]
                  return "Cost: " + format(data.cost) + " absol perpetuals\n\
                  Amount: " + player[this.layer].buyables[this.id] + "\n\
                 Multiply Umvuthi power by " + format(data.effect.first) + "x.<br>Makes foods requirement divided by "+ format(data.effect.second) +"x."
              }, 
              effect(x) { // Effects of owning x of the items, x is a decimal
                let eff = {}
                if (x.gte(0)) eff.first = Decimal.pow(1.3, x.pow(1.08715))
                else eff.first = Decimal.pow(1/45, x.times(-1).pow(1.0))
            
                if (x.gte(1)) eff.second = Decimal.add(1.1e12).mul(new Decimal(10).pow(x.sub(1)))
                else eff.second = new Decimal(1)
                return eff;

             
            },
              canAfford() { return player.n.absolPer.gte(this.cost()) },
              buy() {
                  player.n.absolPer = player.n.absolPer.sub(this.cost())
                  setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
              },
          unlocked() {return getBuyableAmount("n", 31).gte(3)}
    
          },
          33: {
            costScaling() {let cost =  new Decimal(1)
           if (getBuyableAmount("n",33).gte(4)) cost = cost.add(2)
             
  return cost;
           },
           cost(x) { return new Decimal(2.5e28).mul(new Decimal(100).pow(x.times(tmp.n.buyables[33].costScaling))) },
              title() { return "Umvuthana Crane" },
  
              display() { // Everything else displayed in the buyable button after the title
                  let data = tmp[this.layer].buyables[this.id]
                  return "Cost: " + format(data.cost) + " absol perpetuals\n\
                  Amount: " + player[this.layer].buyables[this.id] + "\n\
                 Multiply Abavuthana power by " + format(data.effect.first) + "x."
              }, 
              effect(x) { // Effects of owning x of the items, x is a decimal
                let eff = {}
                if (x.gte(0)) eff.first = Decimal.pow(1.25, x.pow(1.08))
                else eff.first = Decimal.pow(1/45, x.times(-1).pow(1.0))
            
                if (x.gte(1)) eff.second = Decimal.add(1.1e12).mul(new Decimal(10).pow(x.sub(1)))
                else eff.second = new Decimal(1)
                return eff;

             
            },
              canAfford() { return player.n.absolPer.gte(this.cost()) },
              buy() {
                  player.n.absolPer = player.n.absolPer.sub(this.cost())
                  setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
              },
          unlocked() {return getBuyableAmount("n", 32).gte(6)}
    
          },
          41: {
            costScaling() {let cost =  new Decimal(1)
           if (getBuyableAmount("n",41).gte(2)) cost = cost.add(15)
           if (getBuyableAmount("n",41).gte(63)) cost = cost.add(25)
             
  return cost;
           },
           cost(x) { return new Decimal(2.5e51).mul(new Decimal(5).pow(x.times(tmp.n.buyables[41].costScaling))) },
              title() { return "Umvuthana Grove" },
  
              display() { // Everything else displayed in the buyable button after the title
                  let data = tmp[this.layer].buyables[this.id]
                  return "Cost: " + format(data.cost) + " absol perpetuals\n\
                  Amount: " + player[this.layer].buyables[this.id] + "\n\
                 Nursery Points gain is multiplied by " + format(data.effect.first) + "x and multiply Abavuthana power by "+ format(data.effect.second) +"x."
              }, 
              effect(x) { // Effects of owning x of the items, x is a decimal
                let eff = {}
                if (x.gte(0)) eff.first = Decimal.pow(1.3, x.pow(1.2))
                else eff.first = Decimal.pow(1/45, x.times(-1).pow(1.0))
            
                if (x.gte(0)) eff.second = Decimal.pow(1.17, x.pow(1.2))
                else eff.secpnd = Decimal.pow(1/45, x.times(-1).pow(1.0))
                return eff;

             
            },
              canAfford() { return player.n.absolPer.gte(this.cost()) },
              buy() {
                  player.n.absolPer = player.n.absolPer.sub(this.cost())
                  setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
              },
          unlocked() {return getBuyableAmount("n", 32).gte(12)}
    
          },
    },
    bars: {
        umvuthiProgress: {
            fillStyle: {'background-color' : "yellow"},
            baseStyle: {'background-color' : "goldenrod"},
           
            textStyle: {'color': 'black'},
    
         
            direction: RIGHT,
            width: 600,
            height: 70,
            progress() {
                return (player.n.absolPer.add(1).log(10).div(12)).toNumber()
            },
            display() {
                return format(player.n.absolPer) + " / 1e12 Absol Perpetuals"
            },
            unlocked() {return hasUpgrade("a",43)},
    
        },
        newLayer: {
            fillStyle: {'background-color' : "indigo"},
            baseStyle: {'background-color' : "yellow"},
           
            textStyle: {'color': 'black'},
    
         
            direction: RIGHT,
            width: 700,
            height: 90,
            progress() {
                return (player.n.points.add(1).log(10).div(175)).toNumber()
            },
            display() {
                return format(player.n.points) + " / 1e175 Nursery Points<br>Progress: "+format(player.n.points.add(1).log(10).div(175).mul(100))+"% completed.<br>Reach 1e175 Nursery Points to unlock a new layer."
            },
            unlocked() {return player.n.umvuthiUnl},
    
        },
        
    },
   
})


// A side layer with achievements, with no prestige
addLayer("joke", {
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
    }},
    color: "#0F0F0F",
    
   
    clickables: {
        11: {
            title() {return "Click here to make nothing happen"},
            canClick() {return true},
            style: {'width':'256px','background-color':'red'},
      
            

        }
      
    },
	
            
 tabFormat: ["clickables"],
  symbol: "",
    row: "side",
   
    tooltip() { // Optional, tooltip displays when the layer is locked
        return ("")
    },
})
const textParticle = {
    spread: 20,
    gravity: 0,
    time: 3,
    speed: 0,
    text: function() { return "You made nothing happen."},
    offset: 30,
    fadeInTime: 1,
}
addLayer("sm", {
    name: "smack points", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "SM", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
      
    }},
    color: "navy",
 row: 3,
  branches:["s"],
  tooltip() { // Optional, tooltip displays when the layer is locked
    return ("Current Smackery Level: "+formatWhole(player.sm.points))
},

	tabFormat: [
        ["display-text", () => "Your current Smackery Level is  <h1 style='color: navy; text-shadow: navy 0px 0px 10px;'>" + formatWhole(player.sm.points) + "</h1>, which translates to these milestones below:" ],
         "clickables",
			"blank",
		
                   
			"blank",
	
			"blank",
			"milestones",],
    clickables:{
        11: {
            gain() {
            let gain = new Decimal(1)

            return gain;
            },
            
           
            display() {
                let dis = "Smack all of your progression to advance the next level of your Smackery Levels."
            
           
                return dis
            },
            canClick() {
                let click = player.s.durationFox.gte(Number.MAX_VALUE)
                if (hasMilestone("sm",0)) return false
                /*        if (hasMilestione("sm",0)) return new Decimal(86400)*/
                return click;
            },
            onClick() {

              player.sm.points = player.sm.points.add(1)
              player.m.upgrades = []
              for (var a = 11; a <= 99; a++) setBuyableAmount("m", a, new Decimal(0))
              player.points = new Decimal(0)
              player.m.points = new Decimal(0)
             player.s.upgrades = []
             for (var a = 11; a <= 99; a++) setBuyableAmount("s", a, new Decimal(0))
                player.s.points = new Decimal(0)
                player.s.best = new Decimal(0)
                player.s.total = new Decimal(0)
                player.s.therapyS = new Decimal(0)
                player.s.durationFox = new Decimal(0)
                player.s.axisX = new Decimal(0)
                player.s.axisY = new Decimal(0)
                player.s.axisZ = new Decimal(0)
                player.s.makeraxisX = new Decimal(0)
                player.s.makeraxisY = new Decimal(0)
                player.s.makeraxisZ = new Decimal(0)
                },
                style: {'height':'130px', 'width':'175px', 'font-size':'13px',
               
            
            },
            
            },
    },
    milestones: {
         
        0: {requirementDescription: "1 Smackery Points",
        done() {return player[this.layer].points.gte(1)}, // Used to determine when to give the milestone
        effectDescription: "<br><h3>Progression is altered.</h3><br><br>Multi points gain is ^0.8.<br>Points gain is ^1.05.<br>Sessions gain is ^0.8.<br>Prior to 1 Human Generation duration of Fox Music, multi raised ^1.2, but ^0.8 after reaching.<br>Session gain softcap starts +20 earlier.<br>All Fox upgrades that raise the multi of Fox duration is ^0.6.",
        unlocked() {return player.sm.points.gte(1)},
       },
     
      
    },
  
 layerShown() {return player.s.durationFox.gte(Number.MAX_VALUE)||player.sm.points.gte(1)}
})
addLayer("s", {
    name: "sessions", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "S", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        best: new Decimal(0),
        total: new Decimal(0),
        therapyS: new Decimal(0),
        axisX: new Decimal(0),
        makeraxisX: new Decimal(0),
        axisY: new Decimal(0),
        makeraxisY: new Decimal(0),
        axisZ: new Decimal(0),
        makeraxisZ: new Decimal(0),
        productofAxis: new Decimal(0),
        durationFox: new Decimal(0),
    }},
    color: "indigo",
    requires() { let req = new Decimal("1e5350") 
    if (player.s.unlocked) return new Decimal(2.5e31)
return req;}, // Can be a function that takes requirement increases into account
    resource: "sessions", // Name of prestige currency
    baseResource: "multi points", // Name of resource prestige is based on
    baseAmount() {return player.m.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.1, // Prestige currency exponent
    base: 2,
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)



 if (hasUpgrade("s",12)) mult = mult.times(upgradeEffect("s",12))
 if (hasUpgrade("s",17)) mult = mult.times(upgradeEffect("s",17))
 if (hasUpgrade("s",23)) mult = mult.times(tmp.s.theraEffect)
 if (hasUpgrade("s",35)) mult = mult.times(upgradeEffect("s",35))
 if (hasUpgrade("s",46)) mult = mult.times(upgradeEffect("s",46))
 if (hasMilestone("sm",0)) mult = mult.pow(0.8)
        return mult
    },
    softcap() {let cap = new Decimal(100)
        if (hasMilestone("sm",0)) cap = cap.min(20)
    if (hasUpgrade("s",25)) cap = cap.plus(upgradeEffect("s",25))
    if (hasUpgrade("s",37)) cap = cap.plus(upgradeEffect("s",37))
    if (hasUpgrade("s",45)) cap = cap.plus(250)
        return cap;},
    softcapPower() {let pow = new Decimal(0.2)
        if (hasUpgrade("s",22)) pow = pow.add(0.05)
return pow;
    },
    passiveGeneration() { return (hasUpgrade("s", 31))?1:0 },
    tabFormat: {
        "Main": {
            buttonStyle() { return {'background-color': 'indigo'} },
            content: ["main-display",
            "prestige-button",
            "resource-display",
            ["display-text", () => "NOTE: Once resetting for first time, you will lose access to Ultra, Absolute and Nursery Points. Free Multi Points won't also work." ],
           
            "blank",
            ["row", [["upgrade", 11],["upgrade", 12],["upgrade", 13],["upgrade", 14],["upgrade", 15],["upgrade", 16],["upgrade", 17]]],
            ["row", [["upgrade", 21],["upgrade", 22],["upgrade", 23],["upgrade", 24],["upgrade", 25],["upgrade", 26],["upgrade", 27]]],
            ["row", [["upgrade", 31],["upgrade", 32],["upgrade", 33],["upgrade", 34],["upgrade", 35],["upgrade", 36],["upgrade", 37]]],
            ["row", [["upgrade", 41],["upgrade", 42],["upgrade", 43],["upgrade", 44],["upgrade", 45],["upgrade", 46],["upgrade", 47]]],
            ["row", [["upgrade", 51],["upgrade", 52],["upgrade", 53],["upgrade", 54],["upgrade", 55],["upgrade", 56],["upgrade", 57]]],
            ["row", [["upgrade", 61],["upgrade", 62],["upgrade", 63],["upgrade", 64],["upgrade", 65],["upgrade", 66],["upgrade", 67]]],
            ["row", [["upgrade", 71],["upgrade", 72],["upgrade", 73],["upgrade", 74],["upgrade", 75],["upgrade", 76],["upgrade", 77]]],
        ]},
        "Therapy": {
            unlocked() {return hasUpgrade("s",23)},
            content: [
                "main-display",
                    "prestige-button",
                    "resource-display",
                    ["microtabs", "stuff"]
                 
       
        ]},
        "Music": {
            buttonStyle() { return {'border-color': 'orange'} },
            unlocked() {return hasUpgrade("s",57)},
            content: [
                "main-display",
                    "prestige-button",
                    "resource-display",
                    "blank",
                     ["bar","newLayer"],
              "blank",
              "blank",
              ["display-text", () => "Your Fox Music duration is <h2 style='color: orange; text-shadow: orange 0px 0px 10px;'>"+formatTime(player.s.durationFox)+"</h2>." ],
              "blank",
              ["display-text", () => "Multiplier of duration increaser is <h2 style='color: orange; text-shadow: orange 0px 0px 10px;'>"+format(tmp.s.foxMusicDurationMult)+"</h2>x." ],
              "blank",
              "blank",
              ["display-text", () => "Exact Fox Music duration in seconds: <h3 style='color: orange; text-shadow: orange 0px 0px 10px;'>"+format(player.s.durationFox)+"</h3>." ],
            ]},
      
    },
  
    microtabs: {
        stuff: {
            "Sessions": {
                content: [
                   
                    ["display-text", () => "You have <h1 style='color: indigo; text-shadow: indigo 0px 0px 10px;'>"+formatWhole(player.s.therapyS)+"</h1> Therapy Sessions, which are multiplying Sessions gain by "+format(tmp.s.theraEffect)+"x, but are dividing Points gain by the same amount." ],
                    ["row", [["clickable", 11]]],
                    "blank",
                ]
            },
            "Axis": {
                buttonStyle() { return {'border-color': 'white'} },
                unlocked() {return hasUpgrade("s",27)},
                content: [
                   
                    ["display-text", () => "You have <h1 style='color: indigo; text-shadow: indigo 0px 0px 10px;'>"+formatWhole(player.s.therapyS)+"</h1> Therapy Sessions." ],
                    ["display-text", () => "You have <h2 style='color: white; text-shadow: white 0px 0px 10px;'>"+formatWhole(player.s.makeraxisX)+"</h2> Maker Axis-X." ],
                    ["display-text", () => "You have <h2 style='color: white; text-shadow: white 0px 0px 10px;'>"+formatWhole(player.s.makeraxisY)+"</h2> Maker Axis-Y." ],
                    ["display-text", () => "You have <h2 style='color: white; text-shadow: white 0px 0px 10px;'>"+formatWhole(player.s.makeraxisZ)+"</h2> Maker Axis-Z." ],
                    "blank",
                    ["display-text", () => "You have <h3 style='color: white; text-shadow: white 0px 0px 10px;'>"+formatWhole(player.s.axisX)+"</h3> Axis-X." ],
                    ["display-text", () => "You have <h3 style='color: white; text-shadow: white 0px 0px 10px;'>"+formatWhole(player.s.axisY)+"</h3> Axis-Y." ],
                    ["display-text", () => "You have <h3 style='color: white; text-shadow: white 0px 0px 10px;'>"+formatWhole(player.s.axisZ)+"</h3> Axis-Z." ],
                    ["display-text", () =>    (hasUpgrade("s",47)) ? "You have <h3 style='color: white; text-shadow: white 0px 0px 10px;'>"+format(tmp.s.axisProduction)+"</h3> Production of Axis.":""],
                    ["row", [["buyable",11],["buyable",12],["buyable",13]]],
                    "blank",
                    ["display-text", () => "Multiplier for Axis-X gain is "+format(tmp.s.axisXMult)+"." ],
                    ["display-text", () => "Multiplier for Axis-Y gain is "+format(tmp.s.axisYMult)+"." ],
                    ["display-text", () => "Multiplier for Axis-Z gain is "+format(tmp.s.axisZMult)+"." ],
                ]
            },
            
       
    },
},
bars: {
    newLayer: {
        fillStyle: {'background-color' : "navy"},
        baseStyle: {'background-color' : "orange"},
       
        textStyle: {'color': 'black'},

     
        direction: RIGHT,
        width: 700,
        height: 90,
        progress() {
            return Math.log10(player.s.durationFox) / Math.log10(Number.MAX_VALUE)
        },
        display() {
            return formatTime(player.s.durationFox) + " / "+formatTime(Number.MAX_VALUE)+"<br>Reach infinite time to unlock a new Layer."
        },
        
        unlocked() {return hasUpgrade("s",57)},

    },
    
},
    position: 0,
    gainExp() { // Calculate the exponent on main currency from bonuses
        let exp = new Decimal(1)
       
        return exp;
    },
    layerShown(){return player.n.points.gte(1e175)||player.s.unlocked},
    addToBase() {
        let base = new Decimal(0);

        return base;
    },
    axisProduction() { return player.s.axisX.times(player.s.axisY).times(player.s.axisZ) },
    effectBase() {
        let base = new Decimal(1.05);
        
        // ADD
        base = base.plus(tmp.s.addToBase);
        
        // MULTIPLY
      
        
        return base.pow(tmp.s.power);
    },
    power() {
        let power = new Decimal(1);
      
        return power;
    },
    
    effect() {
        let eff = Decimal.pow(tmp.s.effectBase, player.s.best.plus()).max(1).times(1);
        if (tmp.s.effect.gte(50000)) return new Decimal(50000)
        return eff;
    },
   branches: ["m",],
    row: 3, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {
            key:"s", description: "S: Reset for sessions", onPress() {
                if (canReset(this.layer))
                    doReset(this.layer)
            }
        },
    ],
    effectDescription() {
        return "which are boosting Points and Multi Points gain by "+format(tmp.s.effect)+"x. (effect based on best session)"
    },
    
    
    doReset(resettingLayer) {
        let keep = [];
    
       
     
        if (layers[resettingLayer].row > this.row) layerDataReset("s", keep)
    },
  
    upgrades: {
			
        11: {
            title: "Multisessions",
            description: "Add 0.01 to Multi Point's exponent.",
            cost: new Decimal(2),
         
            
        },	
        	
        12: {
            title: "Cheapcap",
            description: "Multpliy Sessions gain based on Multi Points.",
            cost: new Decimal(4),
           unlocked() {return hasUpgrade("s",11)},
           effect() {
                
              
            let eff = player.m.points.plus(1).pow(0.011)


            return eff;
        },
        
        effectDisplay() { return format(tmp.s.upgrades[12].effect)+"x" },
        },	
        13: {
            title: "Fool's Bolete",
            description: "Multpliy Multi Points gain based on Sessions.",
            cost: new Decimal(10),
           unlocked() {return hasUpgrade("s",12)},
           effect() {
                
              
            let eff = player.s.points.plus(1).pow(0.009)

         if (hasUpgrade("s",16)) eff = eff.pow(5)
            return eff;
        },
        
        effectDisplay() { return format(tmp.s.upgrades[13].effect)+"x" },
        },	
        14: {
            title: "Wrinklegill",
            description: "Keep Multi Upgrades on resets.",
            cost: new Decimal(15),
           unlocked() {return hasUpgrade("s",13)},
          
        },
        15: {
            title: "Green Rot",
            description: "Raise Points gain based on Sessions.",
            cost: new Decimal(30),
           unlocked() {return hasUpgrade("s",14)},
           effect() {
                
              
            let eff = player.s.points.plus(1).pow(0.02)


            return eff;
        },
        
        effectDisplay() { return "^"+format(tmp.s.upgrades[15].effect) },
        },	
        16: {
            title: "Shriekbulb",
            description: "Fool's Bolete effect is raised ^5.",
            cost: new Decimal(45),
           unlocked() {return hasUpgrade("s",15)},
           
        },	
        17: {
            title: "Tidygrass",
            description: "Sessions multiply their own gain.",
            cost: new Decimal(100),
           unlocked() {return hasUpgrade("s",16)},
           effect() {
                
              
            let eff = player.s.points.plus(1).pow(0.02)


            return eff;
        },
        
        effectDisplay() { return format(tmp.s.upgrades[17].effect)+"x" },
        },	
        21: {
            title: "Everdaisy",
            description: "Pointy Multiplier's cap and effect is boosted by your Sessions.",
            cost: new Decimal(250),
           unlocked() {return hasUpgrade("s",17)},
           effect() {
                
              
            let eff = player.s.points.plus(1).pow(0.05)


            return eff;
        },
        
        effectDisplay() { return format(tmp.s.upgrades[21].effect)+"x" },
        },	
        22: {
            title: "Ichorpuff",
            description: "Weaken the softcap for Sessions.",
            cost: new Decimal(1000),
           unlocked() {return hasUpgrade("s",21)},
          
        },	
        23: {
            title: "Therapist",
            description: "Unlock Therapy Sessions.",
            cost: new Decimal(5000),
           unlocked() {return hasUpgrade("s",22)},
          
        },	
        24: {
            title: "Junia Power I",
            description: "Multiply Multi Points gain based on Therapy Sessions and divide Therapy Session cost.",

		
						currencyDisplayName: "therapy sessions",
						currencyInternalName: "therapyS",
						currencyLayer: "s",
						cost() { return new Decimal(2) },
				
           unlocked() {return hasUpgrade("s",23)},
           effect() {
                
              
            let eff = player.s.therapyS.plus(1).pow(0.385)


            return eff;
        },
        effect2() {
                
              
            let eff = player.s.therapyS.plus(1).pow(0.3)


            return eff;
        },
        
        
        effectDisplay() { return format(tmp.s.upgrades[24].effect)+"x, /"+format(tmp.s.upgrades[24].effect2)+"." },
        },	
        25: {
            title: "Junia Power II",
            description: "Softcap for Sessions starts later based on Therapy Sessions and divide Therapy Session cost based on Sessions.",

		
						currencyDisplayName: "therapy sessions",
						currencyInternalName: "therapyS",
						currencyLayer: "s",
						cost() { return new Decimal(3) },
				
           unlocked() {return hasUpgrade("s",24)},
           effect() {
                
              
            let eff = player.s.therapyS.add(1).log10().sqrt().div(1.15).times(1);


            return eff;
        },
        effect2() {
                
              
            let eff = player.s.points.plus(1).pow(0.05)


            return eff;
        },
        
        
        effectDisplay() { return "+"+format(tmp.s.upgrades[25].effect)+" later, /"+format(tmp.s.upgrades[25].effect2)+"." },
        },	
        26: {
            title: "Baker's Junia",
            description: "The base effect for Therapy Session is added by 0.1.",

		
						currencyDisplayName: "therapy sessions",
						currencyInternalName: "therapyS",
						currencyLayer: "s",
						cost() { return new Decimal(4) },
				
           unlocked() {return hasUpgrade("s",25)},
           
        },	
        27: {
            title: "Thumbjunia",
            description: "Unlock Axis and Therapy Sessions effect base is added by your Therapy Sessions.",

		
						currencyDisplayName: "therapy sessions",
						currencyInternalName: "therapyS",
						currencyLayer: "s",
						cost() { return new Decimal(4) },
				
           unlocked() {return hasUpgrade("s",26)},
           effect() {
                
              
            let eff = player.s.therapyS.add(1).log10().sqrt().div(1.9).times(1);


            return eff;
        },
     
    
        
        
        effectDisplay() { return "+"+format(tmp.s.upgrades[27].effect) },
        },	
       31: {
            title: "Cronejunia",
            description: "Gain 100% of Sessions per second.",

		
						currencyDisplayName: "X-axis",
						currencyInternalName: "axisX",
						currencyLayer: "s",
						cost() { return new Decimal(60) },
				
           unlocked() {return hasUpgrade("s",27)},
           
        },	
        32: {
            title: "Gildjunia",
            description: "Multi Points multiply Axis-X gain.",

		
						currencyDisplayName: "X-axis",
						currencyInternalName: "axisX",
						currencyLayer: "s",
						cost() { return new Decimal(240) },
				
           unlocked() {return hasUpgrade("s",31)},
           effect() {
                
              
            let eff = player.m.points.plus(1).pow(0.0015)


            return eff;
        },
     
    
        
        
        effectDisplay() { return format(tmp.s.upgrades[32].effect)+"x" },
        },	
        33: {
            title: "Ordinary Junia",
            description: "Points multiply Axis-X gain.",

		
						currencyDisplayName: "X-axis",
						currencyInternalName: "axisX",
						currencyLayer: "s",
						cost() { return new Decimal(1000) },
				
           unlocked() {return hasUpgrade("s",32)},
           effect() {
                
              
            let eff = player.points.plus(1).pow(0.004)


            return eff;
        },
     
    
        
        
        effectDisplay() { return format(tmp.s.upgrades[33].effect)+"x" },
        },	
        34: {
            title: "Golden Junia",
            description: "Sessions multiply Axis-X gain.",

		
						currencyDisplayName: "X-axis",
						currencyInternalName: "axisX",
						currencyLayer: "s",
						cost() { return new Decimal(1500) },
				
           unlocked() {return hasUpgrade("s",33)},
           effect() {
                
              
            let eff = player.s.points.plus(1).pow(0.05)


            return eff;
        },
        effectDisplay() { return format(tmp.s.upgrades[34].effect)+"x" },
    
        
        

        },	
        35: {
            title: "Shimmerjunia",
            description: "Axis-X multiplys Session gain.",

		
						currencyDisplayName: "X-axis",
						currencyInternalName: "axisX",
						currencyLayer: "s",
						cost() { return new Decimal(2500) },
				
           unlocked() {return hasUpgrade("s",34)},
           effect() {
                
              
            let eff = player.s.axisX.plus(1).pow(0.03)


            return eff;
        },
        effectDisplay() { return format(tmp.s.upgrades[35].effect)+"x" },
    
        
        

        },	
        36: {
            title: "Elderjunia",
            description: "Axis-X multiplys Points gain.",

		
						currencyDisplayName: "X-axis",
						currencyInternalName: "axisX",
						currencyLayer: "s",
						cost() { return new Decimal(3000) },
				
           unlocked() {return hasUpgrade("s",35)},
           effect() {
                
              
            let eff = player.s.axisX.plus(1).pow(0.05)


            return eff;
        },
        effectDisplay() { return format(tmp.s.upgrades[36].effect)+"x" },
    
        
        

        },	
        37: {
            title: "Bakejunia",
            description: "Unlock Axis-Y and Axis-X makes the Sessions softcap start later.",

		
						currencyDisplayName: "X-axis",
						currencyInternalName: "axisX",
						currencyLayer: "s",
						cost() { return new Decimal(3500) },
				
           unlocked() {return hasUpgrade("s",36)},
           effect() {
                
              
            let eff = player.s.axisX.add(1).log10().sqrt().div(2).times(1);


            return eff;
        },
        effectDisplay() { return "+"+format(tmp.s.upgrades[37].effect)+" later" },
    
        
        

        },	
        41: {
            title: "Chocojunia",
            description: "Points multiply Axis-X and Axis-Y gain.",

		
						currencyDisplayName: "Y-axis",
						currencyInternalName: "axisY",
						currencyLayer: "s",
						cost() { return new Decimal(60) },
				
           unlocked() {return hasUpgrade("s",37)},
           effect() {
                
              
            let eff = player.m.points.plus(1).pow(0.0011)


            return eff;
        },
     
    
        
        
        effectDisplay() { return format(tmp.s.upgrades[41].effect)+"x" },
           
        },	
        42: {
            title: "White Chocojunia",
            description: "Points multiply Axis-X and Axis-Y gain.",

		
						currencyDisplayName: "Y-axis",
						currencyInternalName: "axisY",
						currencyLayer: "s",
						cost() { return new Decimal(245) },
				
           unlocked() {return hasUpgrade("s",41)},
           effect() {
                
              
            let eff = player.points.plus(1).pow(0.0011)


            return eff;
        },
     
    
        
        
        effectDisplay() { return format(tmp.s.upgrades[42].effect)+"x" },
           
        },	
        43: {
            title: "White Junia",
            description: "Points multiply Axis-X and Axis-Y gain.",

		
						currencyDisplayName: "Y-axis",
						currencyInternalName: "axisY",
						currencyLayer: "s",
						cost() { return new Decimal(1100) },
				
           unlocked() {return hasUpgrade("s",42)},
           effect() {
                
              
            let eff = player.s.points.plus(1).pow(0.04)


            return eff;
        },
     
    
        
        
        effectDisplay() { return format(tmp.s.upgrades[43].effect)+"x" },
           
        },	
        44: {
            title: "Brown Junia",
            description: "Axis-Y multiply Axis-X gain.",

		
						currencyDisplayName: "Y-axis",
						currencyInternalName: "axisY",
						currencyLayer: "s",
						cost() { return new Decimal(1100) },
				
           unlocked() {return hasUpgrade("s",43)},
           effect() {
                
              
            let eff = player.s.axisY.plus(1).pow(0.1)


            return eff;
        },
     
    
        
        
        effectDisplay() { return format(tmp.s.upgrades[44].effect)+"x" },
           
        },	
        45: {
            title: "Meddlejunia",
            description: "Make the Session softcap gain start 250 later.",

		
						currencyDisplayName: "Y-axis",
						currencyInternalName: "axisY",
						currencyLayer: "s",
						cost() { return new Decimal(2500) },
				
           unlocked() {return hasUpgrade("s",44)},
         
           
        },	
        46: {
            title: "Whiskerjunia",
            description: "Multiply Session gain based on Axis-Y (magnified wth Axis-X)",

		
						currencyDisplayName: "Y-axis",
						currencyInternalName: "axisY",
						currencyLayer: "s",
						cost() { return new Decimal(2850) },
				
           unlocked() {return hasUpgrade("s",45)},
           effect() {
                
              
            let eff = player.s.axisY.plus(1).pow(0.05).times(player.s.axisX.plus(1).pow(0.03))


            return eff;
        },
     
    
        
        
        effectDisplay() { return format(tmp.s.upgrades[46].effect)+"x" },
         
           
        },	
        47: {
            title: "Chimejunia",
            description: "Unlock Axis-Z and Axis-X, Axis-Y boost each others gain.",

		
						currencyDisplayName: "Y-axis",
						currencyInternalName: "axisY",
						currencyLayer: "s",
						cost() { return new Decimal(3500) },
				
           unlocked() {return hasUpgrade("s",45)},
           effect() {
                
                
                let exp = 0.08
                return {x: player.s.axisY.add(0.001).log10().pow(exp), y: player.s.axisX.add(0.0005).log10().pow(exp)} 
            },
     
    
        
        
       effectDisplay() { return "+"+format(tmp.s.upgrades[47].effect.x)+" to Axis-X gain, +"+format(tmp.s.upgrades[47].effect.y)+" to Axis-Y gain." },
         
           
        },	
        51: {
            title: "Nursejunia",
            description: "Axis-Z gain is boosted based on 20% of OoM of Production of Axis",

		
						currencyDisplayName: "Z-axis",
						currencyInternalName: "axisZ",
						currencyLayer: "s",
						cost() { return new Decimal(75) },
				
           unlocked() {return hasUpgrade("s",45)},
           effect() {
                
              
            let eff = tmp.s.axisProduction.add(1).log10().times(0.2)


            return eff;
        },
     
    
        
        
       effectDisplay() { return format(tmp.s.upgrades[51].effect)+"x" },
         
           
        },	
        52: {
            title: "Drowsyjunia",
            description: "Axis-Z gain is boosted based on Points.",

		
						currencyDisplayName: "Z-axis",
						currencyInternalName: "axisZ",
						currencyLayer: "s",
						cost() { return new Decimal(240) },
				
           unlocked() {return hasUpgrade("s",51)},
           effect() {
                
              
            let eff = player.points.plus(1).pow(0.006)


            return eff;
        },
     
    
        
        
       effectDisplay() { return format(tmp.s.upgrades[52].effect)+"x" },
         
           
        },	
        53: {
            title: "Wardjunia",
            description: "Axis-Z gain is boosted based on Axis-X.",

		
						currencyDisplayName: "Z-axis",
						currencyInternalName: "axisZ",
						currencyLayer: "s",
						cost() { return new Decimal(750) },
				
           unlocked() {return hasUpgrade("s",52)},
           effect() {
                
              
            let eff = player.s.axisX.plus(1).pow(0.042)


            return eff;
        },
     
    
        
        
       effectDisplay() { return format(tmp.s.upgrades[53].effect)+"x" },
         
           
        },	
        54: {
            title: "Keenjunia",
            description: "Axis-Z gain is boosted based on Axis-Y.",

		
						currencyDisplayName: "Z-axis",
						currencyInternalName: "axisZ",
						currencyLayer: "s",
						cost() { return new Decimal(1500) },
				
           unlocked() {return hasUpgrade("s",53)},
           effect() {
                
              
            let eff = player.s.axisY.plus(1).pow(0.035)


            return eff;
        },
     
    
        
        
       effectDisplay() { return format(tmp.s.upgrades[54].effect)+"x" },
         
           
        },	
        55: {
            title: "Queenjunia",
            description: "Axis-Y gain is boosted based on Axis-Z.",

		
						currencyDisplayName: "Z-axis",
						currencyInternalName: "axisZ",
						currencyLayer: "s",
						cost() { return new Decimal(3000) },
				
           unlocked() {return hasUpgrade("s",54)},
           effect() {
                
              
            let eff = player.s.axisZ.plus(1).pow(0.045)


            return eff;
        },
     
    
        
        
       effectDisplay() { return format(tmp.s.upgrades[55].effect)+"x" },
         
           
        },	
        56: {
            title: "Juicy Queenjunia",
            description: "Points gain is raised ^1.3.",

		
						currencyDisplayName: "Z-axis",
						currencyInternalName: "axisZ",
						currencyLayer: "s",
						cost() { return new Decimal(10000) },
				
           unlocked() {return hasUpgrade("s",55)},
         
         
           
        },	
        57: {
            title: "Dukejunia",
            description: "Unlock Fox Music.",

		
						
						cost() { let cost = new Decimal(5e13)
                       if (hasMilestone("sm",0)) return new Decimal(5e7)
                            return cost; },
				
           unlocked() {return hasUpgrade("s",56)},
         
         
           
        },	
        61: {
            title: "Crumbjunia",
            description: "Multiply the multiplier for Fox duration based on Points.",

		
						currencyDisplayName: "seconds duration of fox music",
						currencyInternalName: "durationFox",
						currencyLayer: "s",
						cost() { return new Decimal(60) },
				
           unlocked() {return hasUpgrade("s",57)},
           effect() {
                
              
            let eff = player.points.plus(1).pow(0.00185)


            return eff;
        },
     
    
        
        
       effectDisplay() { return format(tmp.s.upgrades[61].effect)+"x" },
         
           
        },
        62: {
            title: "Doughjunia",
            description: "Multiply the multiplier for Fox duration based on Production of Axis.",

		
						currencyDisplayName: "seconds duration of fox music",
						currencyInternalName: "durationFox",
						currencyLayer: "s",
						cost() { return new Decimal(150) },
				
           unlocked() {return hasUpgrade("s",61)},
           effect() {
                
              
            let eff = tmp.s.axisProduction.plus(1).pow(0.0185)


            return eff;
        },
     
    
        
        
       effectDisplay() { return format(tmp.s.upgrades[62].effect)+"x" },
         
           
        },		
        63: {
            title: "Glovejunia",
            description: "Raise the multiplier of Fox Duration based on Multi Points.",

		
						currencyDisplayName: "seconds duration of fox music",
						currencyInternalName: "durationFox",
						currencyLayer: "s",
						cost() { return new Decimal(300) },
				
           unlocked() {return hasUpgrade("s",62)},
           effect() {
                
              
            let eff = player.m.points.plus(1).pow(0.0005)

            if (hasMilestone("sm",0)) eff = eff.pow(0.6)
            return eff;
        },
     
    
        
        
       effectDisplay() { return "^"+format(tmp.s.upgrades[63].effect) },
         
           
        },		
        64: {
            title: "Cheapjunia",
            description: "Raise the multiplier of Fox Duration based on Sessions.",

		
						currencyDisplayName: "seconds duration of fox music",
						currencyInternalName: "durationFox",
						currencyLayer: "s",
						cost() { return new Decimal(550) },
				
           unlocked() {return hasUpgrade("s",63)},
           effect() {
                
              
            let eff = player.s.points.plus(1).pow(0.04)
            if (hasMilestone("sm",0)) eff = eff.pow(0.6)

            return eff;
        },
     
    
        
        
       effectDisplay() { return "^"+format(tmp.s.upgrades[64].effect) },
         
           
        },	
        65: {
            title: "Fool's Junia",
            description: "Raise the multiplier of Fox Duration based on Points.",

		
						currencyDisplayName: "seconds duration of fox music",
						currencyInternalName: "durationFox",
						currencyLayer: "s",
						cost() { return new Decimal(86400) },
				
           unlocked() {return hasUpgrade("s",64)},
           effect() {
                
              
            let eff = player.points.plus(1).pow(0.001)
            if (hasMilestone("sm",0)) eff = eff.pow(0.6)

            return eff;
        },
     
    
        
        
       effectDisplay() { return "^"+format(tmp.s.upgrades[65].effect) },
         
           
        },			
        66: {
            title: "Wrinklejunia",
            description: "Raise the multiplier of Fox Duration based on Axis-X.",

		
						currencyDisplayName: "seconds duration of fox music",
						currencyInternalName: "durationFox",
						currencyLayer: "s",
						cost() { return new Decimal(6.04e5) },
				
           unlocked() {return hasUpgrade("s",65)},
           effect() {
                
              
            let eff = player.s.axisX.plus(1).pow(0.02)
            if (hasMilestone("sm",0)) eff = eff.pow(0.6)

            return eff;
        },
     
    
        
        
       effectDisplay() { return "^"+format(tmp.s.upgrades[66].effect) },
         
           
        },			
        67: {
            title: "Green Junia",
            description: "Raise the multiplier of Fox Duration based on Axis-Y.",

		
						currencyDisplayName: "seconds duration of fox music",
						currencyInternalName: "durationFox",
						currencyLayer: "s",
						cost() { return new Decimal(31557600) },
				
           unlocked() {return hasUpgrade("s",66)},
           effect() {
                
              
            let eff = player.s.axisY.plus(1).pow(0.01)

            if (hasMilestone("sm",0)) eff = eff.pow(0.6)
            return eff;
        },
     
    
        
        
       effectDisplay() { return "^"+format(tmp.s.upgrades[67].effect) },
         
           
        },			
        71: {
            title: "Shriekjunia",
            description: "Each Session upgrade brought raises the multi of Fox Duration.",

		
						currencyDisplayName: "seconds duration of fox music",
						currencyInternalName: "durationFox",
						currencyLayer: "s",
						cost() { return new Decimal(1e9) },
				
           unlocked() {return hasUpgrade("s",67)},
           effect() {
                
              
             let eff = Decimal.pow(1.005, player.s.upgrades.length);

             if (hasMilestone("sm",0)) eff = eff.pow(0.6)
            return eff;
        },
     
    
        
        
       effectDisplay() { return "^"+format(tmp.s.upgrades[71].effect) },
         
           
        },		
        72: {
            title: "Tidyjunia",
            description: "Raise the multiplier of Fox Duration based on Axis-Z.",

		
						currencyDisplayName: "seconds duration of fox music",
						currencyInternalName: "durationFox",
						currencyLayer: "s",
						cost() { return new Decimal(2.5e10) },
				
           unlocked() {return hasUpgrade("s",71)},
           effect() {
                
              
            let eff = player.s.axisZ.plus(1).pow(0.00895)

            if (hasMilestone("sm",0)) eff = eff.pow(0.6)
            return eff;
        },
     
    
        
        
       effectDisplay() { return "^"+format(tmp.s.upgrades[72].effect) },
         
           
        },			
        73: {
            title: "Everjunia",
            description: "Raise the multiplier of Fox Duration based on Therapy Sessions.",

		
						currencyDisplayName: "seconds duration of fox music",
						currencyInternalName: "durationFox",
						currencyLayer: "s",
						cost() { return new Decimal(2.5e11) },
				
           unlocked() {return hasUpgrade("s",72)},
           effect() {
                
              
            let eff = player.s.therapyS.plus(1).pow(0.07)
            if (hasMilestone("sm",0)) eff = eff.pow(0.6)

            return eff;
        },
     
    
        
        
       effectDisplay() { return "^"+format(tmp.s.upgrades[73].effect) },
         
           
        },			
        74: {
            title: "Ichorjunia",
            description: "The effect of Therapy Sessions also affects Fox Duration Time (at a reduced time)",

		
						currencyDisplayName: "seconds duration of fox music",
						currencyInternalName: "durationFox",
						currencyLayer: "s",
						cost() { return new Decimal(2e13) },
				
           unlocked() {return hasUpgrade("s",73)},
           effect() {
                
              
            let eff = tmp.s.theraEffect.plus(1).pow(0.07)

            if (hasMilestone("sm",0)) eff = eff.pow(0.6)
            return eff;
        },
     
    
        
        
       effectDisplay() { return "^"+format(tmp.s.upgrades[74].effect) },
         
           
        },			
        75: {
            title: "Senia",
            description: "The effect of Sessions also affects Fox Duration Time (at a reduced time)",

		
						currencyDisplayName: "seconds duration of fox music",
						currencyInternalName: "durationFox",
						currencyLayer: "s",
						cost() { return new Decimal(1.5e19) },
				
           unlocked() {return hasUpgrade("s",74)},
           effect() {
                
              
            let eff = tmp.s.effect.plus(1).pow(0.04)

            if (hasMilestone("sm",0)) eff = eff.pow(0.6)
            return eff;
        },
     
    
        
        
       effectDisplay() { return "^"+format(tmp.s.upgrades[75].effect) },
         
           
        },			
        76: {
            title: "Masteria",
            description: "Raise the Fox Multiplier Duration by 10.",

		
						currencyDisplayName: "seconds duration of fox music",
						currencyInternalName: "durationFox",
						currencyLayer: "s",
						cost() { return new Decimal(5e28) },
				
           unlocked() {return hasUpgrade("s",75)},
           
         
           
        },			
        77: {
            title: "Grandmasteria",
            description: "Raise the Fox Multiplier Duration by 1.11.",

		
						currencyDisplayName: "seconds duration of fox music",
						currencyInternalName: "durationFox",
						currencyLayer: "s",
						cost() { return new Decimal(1e275) },
				
           unlocked() {return hasUpgrade("s",76)},
           
         
           
        },			
    },

    theraATB() {
        let base = new Decimal(0);
        if (hasUpgrade("s",26)) base = base.add(0.1)
        return base;
    },


    theraEffBase() {
        let base = new Decimal(1.5);
        
        // ADD
        base = base.plus(tmp.s.theraATB);
        
        // MULTIPLY
     
        
        return base.pow(tmp.s.theraPow);
    },
    theraPow() {
        let power = new Decimal(1);
   
        return power;
    },
  axisXMult() {let mult = new Decimal(1)
if (hasUpgrade("s",32)) mult = mult.times(upgradeEffect("s",32))
if (hasUpgrade("s",33)) mult = mult.times(upgradeEffect("s",33))
if (hasUpgrade("s",34)) mult = mult.times(upgradeEffect("s",34))
if (hasUpgrade("s",41)) mult = mult.times(upgradeEffect("s",41))
if (hasUpgrade("s",42)) mult = mult.times(upgradeEffect("s",42))
if (hasUpgrade("s",43)) mult = mult.times(upgradeEffect("s",43))
if (hasUpgrade("s",44)) mult = mult.times(upgradeEffect("s",44))
if (hasUpgrade("s",47)) mult = mult.times(upgradeEffect("s",47).x)
return mult;},
axisYMult() {let mult = new Decimal(1)
    if (hasUpgrade("s",41)) mult = mult.times(upgradeEffect("s",41))
    if (hasUpgrade("s",42)) mult = mult.times(upgradeEffect("s",42))
    if (hasUpgrade("s",43)) mult = mult.times(upgradeEffect("s",43))
    if (hasUpgrade("s",47)) mult = mult.times(upgradeEffect("s",47).y)
    if (hasUpgrade("s",55)) mult = mult.times(upgradeEffect("s",55))
    return mult;},
    axisZMult() {let mult = new Decimal(1)
     
        if (hasUpgrade("s",51)) mult = mult.times(upgradeEffect("s",51))
        if (hasUpgrade("s",52)) mult = mult.times(upgradeEffect("s",52))
        if (hasUpgrade("s",53)) mult = mult.times(upgradeEffect("s",53))
        if (hasUpgrade("s",54)) mult = mult.times(upgradeEffect("s",54))
        return mult;},
    

		update(diff) {
			if (player.s.makeraxisX.gte(1)) player.s.axisX = player.s.axisX.plus(player.s.makeraxisX.div(20).times(tmp.s.axisXMult));
            if (player.s.makeraxisY.gte(1)) player.s.axisY = player.s.axisY.plus(player.s.makeraxisY.div(20).times(tmp.s.axisYMult));
            if (player.s.makeraxisZ.gte(1)) player.s.axisZ = player.s.axisZ.plus(player.s.makeraxisZ.div(20).times(tmp.s.axisZMult));
            if (hasUpgrade("s",57)) player.s.durationFox = player.s.durationFox.plus(tmp.s.foxMusicDurationMult.div(20))
		},
		
		
        foxMusicDurationMult() {let duration = new Decimal(1)

            if (player.s.durationFox.gte(Number.MAX_VALUE)) return new Decimal(1)
            if (hasMilestone("sm",0)) duration = duration.pow(duration.lt(788940000)?1.2:0.8);
            if (hasUpgrade("s",61)) duration = duration.times(upgradeEffect("s",61))
            if (hasUpgrade("s",62)) duration = duration.times(upgradeEffect("s",62))
            if (hasUpgrade("s",63)) duration = duration.pow(upgradeEffect("s",63))
            if (hasUpgrade("s",64)) duration = duration.pow(upgradeEffect("s",64))
            if (hasUpgrade("s",65)) duration = duration.pow(upgradeEffect("s",65))
            if (hasUpgrade("s",66)) duration = duration.pow(upgradeEffect("s",66))
            if (hasUpgrade("s",67)) duration = duration.pow(upgradeEffect("s",67))
            if (hasUpgrade("s",71)) duration = duration.pow(upgradeEffect("s",71))
            if (hasUpgrade("s",72)) duration = duration.pow(upgradeEffect("s",72))
            if (hasUpgrade("s",73)) duration = duration.pow(upgradeEffect("s",73))
            if (hasUpgrade("s",74)) duration = duration.pow(upgradeEffect("s",74))
            if (hasUpgrade("s",75)) duration = duration.pow(upgradeEffect("s",75))
            if (hasUpgrade("s",76)) duration = duration.pow(10)
            if (hasUpgrade("s",77)) duration = duration.pow(1.11)
            return duration;},
    theraEffect() {
        return Decimal.pow(tmp.s.theraEffBase, player.s.therapyS.plus()).max(1).times(1);
    }, 
    clickables:{
        11: {
            gain() {
            let gain = new Decimal(1)

            return gain;
            },
            
            cost() {
                let cost = new Decimal(5000)
                if (hasUpgrade("s",24)) cost = cost.div(upgradeEffect2("s",24))
                if (hasUpgrade("s",25)) cost = cost.div(upgradeEffect2("s",25))
                if (player.s.therapyS.gte(3)) cost = cost.times(player.s.therapyS.times(0.5))
                if (player.s.therapyS.gte(5)) cost = cost.times(player.s.therapyS.times(2))
                if (player.s.therapyS.gte(8)) cost = cost.times(player.s.therapyS.times(4))
                if (player.s.therapyS.gte(12)) cost = cost.times(player.s.therapyS.pow(8))
                return cost;
                },
            display() {
                let dis = "Unalive all Sessions into Therapy Sessions <br><br>You will gain "+formatWhole(tmp.s.clickables[11].gain)+" Therapy Sessions on unalive."
            
           
                return dis
            },
            canClick() {
                return player.s.points.gte(tmp.s.clickables[11].cost.times(player.s.therapyS.add(1)))
            },
            onClick() {
              player.s.therapyS = player.s.therapyS.add(tmp.s.clickables[11].gain)
   
                player.s.points = new Decimal(0)
                player.s.best = new Decimal(0)
                player.s.total = new Decimal(0)
                },
                style: {'height':'130px', 'width':'175px', 'font-size':'13px',
               
            
            },
            
            },
    },
    buyables: {
        11: {
           
              cost(x) { return new Decimal(2).add(new Decimal(x).add(1)) },
              title() { return "Maker Axis-X" },
  
              display() { // Everything else displayed in the buyable button after the title
                  let data = tmp[this.layer].buyables[this.id]
                  return "Cost: " + format(data.cost) + " therapy sessions\n\
                  Amount: " + player[this.layer].buyables[this.id] + "\n\
                 Gain 1 Maker Axis-X"
              }, 
            
              canAfford() { return player.s.therapyS.gte(this.cost()) },
              buy() {
                 player.s.therapyS =player.s.therapyS.sub(this.cost())
                    player.s.makeraxisX = player.s.makeraxisX.add(1)
                  setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
              },
          unlocked() {return hasUpgrade("s",27)},
          style: {'background-color':'white',},
          },
          12: {
           scalePow() {
            let pow = new Decimal(1)
            if (getBuyableAmount("s",12).gte(10)) pow = pow.add(1)
        return pow;   
        },
            cost(x) { return new Decimal(5000).pow(new Decimal(1.0057).pow(x)).pow(tmp.s.buyables[this.id].scalePow) },
            title() { return "Maker Axis-Y" },

            display() { // Everything else displayed in the buyable button after the title
                let data = tmp[this.layer].buyables[this.id]
                return "Cost: " + format(data.cost) + " X-axis \n\
                Amount: " + player[this.layer].buyables[this.id] + "\n\
               Gain 1 Maker Axis-Y"
            }, 
          
            canAfford() { return player.s.axisX.gte(this.cost()) },
            buy() {
               player.s.axisX =player.s.axisX.sub(this.cost())
                  player.s.makeraxisY = player.s.makeraxisY.add(1)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
        unlocked() {return hasUpgrade("s",37)},
        style: {'background-color':'white',},
        },
        13: {
            scalePow() {
             let pow = new Decimal(1)
             if (getBuyableAmount("s",13).gte(10)) pow = pow.add(1)
         return pow;   
         },
             cost(x) { return new Decimal(3500).pow(new Decimal(1.01).pow(x)).pow(tmp.s.buyables[this.id].scalePow) },
             title() { return "Maker Axis-Z" },
 
             display() { // Everything else displayed in the buyable button after the title
                 let data = tmp[this.layer].buyables[this.id]
                 return "Cost: " + format(data.cost) + " Y-axis \n\
                 Amount: " + player[this.layer].buyables[this.id] + "\n\
                Gain 1 Maker Axis-Z"
             }, 
           
             canAfford() { return player.s.axisY.gte(this.cost()) },
             buy() {
                player.s.axisY =player.s.axisY.sub(this.cost())
                   player.s.makeraxisZ = player.s.makeraxisZ.add(1)
                 setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
             },
         unlocked() {return hasUpgrade("s",47)},
         style: {'background-color':'white',},
         },
    }

})