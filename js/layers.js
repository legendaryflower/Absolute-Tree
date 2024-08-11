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
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        if (inChallenge("a",31)) return new Decimal(1)
       
        let exp = new Decimal(1)
      
        if (hasUpgrade("m",22)) exp = exp.add(upgradeEffect("m",22))
        return exp;
    },

    softcap: new Decimal(1e20),
    softcapPower: 0.333,
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {
            key:"m", description: "M: Reset for multi points", onPress() {
                if (canReset(this.layer))
                    doReset(this.layer)
            }
        },
    ],
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
      passiveGeneration() { return (hasMilestone("a", 3))?1:0 },
    doReset(resettingLayer) {
        let keep = [];
    
        if (hasMilestone("a", 0)) keep.push("upgrades")
    
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
            title: "Pointy Multipler",
            description: "Points multiply Multi points gain.",
            cost: new Decimal(15),
            cap() { let cap = new Decimal(5e7)
                if (hasUpgrade("a",21)) cap = cap.times(1.5)
                if (hasChallenge("a",31)) cap = cap.pow(3)
	return cap; },


            effect() {
                
              
                let eff = player.points.plus(1).pow(0.125).min(tmp.m.upgrades[this.id].cap);
                if (inChallenge("a",12)) eff = eff.div(tmp.a.upgradeNerfChallenge)
       
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
            cap() { let cap = new Decimal(1e6)
                if (hasUpgrade("a",21)) cap = cap.times(1.05)
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
           
            unlocked() {return hasUpgrade("m",26)},
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
    },
    buyables: {
        11: {
            costScaling() {let cost =  new Decimal(1)
                if (player.m.buyables[11].gte(1100)) cost = cost.add(0.25)
                if (inChallenge("a",22)) cost = cost.times(tmp.a.costScalingStartHarsh)
        return cost;
                 },
            freeLvls() {let free = new Decimal(0)
            if (player.a.unlocked) free = free.plus(buyableEffect("m",13))
            return free;},
        title() {return "Points"},
            cost(x) { return new Decimal(1).mul(new Decimal(6).pow(x)).times(hasUpgrade("m",32) ? 0.695 : 1).pow(tmp[this.layer].buyables[this.id].costScaling) },
        
            display() { // Everything else displayed in the buyable button after the title
                let data = tmp[this.layer].buyables[this.id]
                return "Cost: " + format(data.cost) + " multi points\n\
                Amount: " + player[this.layer].buyables[this.id] + "+"+ tmp[this.layer].buyables[this.id].freeLvls+"\n\
               Points gain is multiplied by " + format(data.effect.first) + "x. "
            },
            effect(x) { // Effects of owning x of the items, x is a decimal
                let eff = {}
                if (x.gte(0)) eff.first = Decimal.pow(1.1, x.pow(1.16)).plus(tmp.m.buyables[this.id].freeLvls)
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
                    if (player.m.buyables[12].gte(1100)) cost = cost.add(0.25)
                    if (inChallenge("a",22)) cost = cost.times(tmp.a.costScalingStartHarsh)
            return cost;
                     },
            cost(x) { return new Decimal(5).mul(new Decimal(6).pow(x)).times(hasUpgrade("m",26) ? 0.85 : 1).pow(tmp[this.layer].buyables[this.id].costScaling) },
            title() { return "Multi Points" },
           
            display() { // Everything else displayed in the buyable button after the title
                let data = tmp[this.layer].buyables[this.id]
                return "Cost: " + format(data.cost) + " multi points\n\
                Amount: " + player[this.layer].buyables[this.id] + "+" + tmp[this.layer].buyables[this.id].freeLvls+"\n\
               Multi points gain is multiplied by " + format(data.effect.first) + "x. "
            },
            effect(x) { // Effects of owning x of the items, x is a decimal
                let eff = {}
                if (x.gte(0)) eff.first = Decimal.pow(1.2, x.pow(1.16)).plus(tmp.m.buyables[this.id].freeLvls.times(1e6))
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
            cost(x) { return new Decimal(100).mul(new Decimal(14).pow(x)) },
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
            cost(x) { return new Decimal(10000).mul(new Decimal(28).pow(x)) },
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
   branches: ["m"],
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {
            key:"a", description: "A: Reset for absolute points", onPress() {
                if (canReset(this.layer))
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
    
        return nerf;
    },

    effect() {
        return Decimal.pow(tmp.a.effectBase, player.a.points.plus()).max(1).times(1);
    },
    layerShown(){return hasUpgrade("m",23)||player.a.unlocked},
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
          
          if (player.a.buyables[13].gte(6)) cost = cost.add(0.25)
          if (player.a.buyables[13].gte(8)) cost = cost.add(1)
          if (player.a.buyables[13].gte(9)) cost = cost.add(0.15)
          if (player.a.buyables[13].gte(10)) cost = cost.add(0.95)

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

    return eff;
}, 


effectDisplay() { return "+"+format(tmp.a.upgrades[23].effect) },
            
        },	
        24: {
            title: "White Chocoroot",
            description: "Absolute's effect also adds to the Ultra Point's base effect.",
            cost: new Decimal("1e907"),
         unlocked () {return hasUpgrade("a",23)},
currencyDisplayName: "multipoints",
currencyInternalName: "points",
currencyLayer: "m",
effect() {
                
              
    let eff = tmp.a.effect.plus(1).pow(0.09117)

    return eff;
},


effectDisplay() { return "+"+format(tmp.a.upgrades[24].effect) },
            
        },	
        25: {
            title: "White Mildew",
            description: "Unlock a new Buyable.",
            cost: new Decimal("1e975"),
         unlocked () {return hasUpgrade("a",24)},
currencyDisplayName: "multipoints",
currencyInternalName: "points",
currencyLayer: "m",
            
        },	
        26: {
            title: "Brown Mildew",
            description: "Unlock a new challenge.",
            cost: new Decimal("1e976"),
         unlocked () {return hasUpgrade("a",25)},
currencyDisplayName: "multipoints",
currencyInternalName: "points",
currencyLayer: "m",
            
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
player.a.time = new Decimal(1),
player.m.upgrades = []

            },
            rewardDescription: "<b>Absolute Divider</b> is 5 times as efficient, and unlock a row of Multi Upgrades.",
         
        },
        12: {
            name: "Antitrusted Multiverse",
           challengeDescription() {
            return "All Multi Upgrades with effects are divided by " +format(tmp.a.upgradeNerfChallenge)+"."
            + "<br>"+challengeCompletions(this.layer, this.id)+""
             + " completions";
        },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            
            scalePower() {
                let power = new Decimal(1);
                
                return power;
            },
            completionLimit() { 
                let lim = Infinity;
                
                return lim;
            },
goal() {
                let comps = Decimal.mul(challengeCompletions("a", 12), tmp.a.challenges[this.id].scalePower);
                if (comps.gte(5)) comps = comps.times(1.1);
                if (comps.gte(7)) comps = comps.times(1.2);
                if (hasUpgrade("a",22)) comps = comps.times(0.2);
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
player.m.total = new Decimal(0),
player.m.upgrades = [],
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
player.m.total = new Decimal(0),
player.m.upgrades = [],
player.a.time = new Decimal(1)

            },
            rewardDescription: "Cost scaling for Baker's Wheat is reduced by 33.33%.",
         unlocked() {return hasUpgrade("a",14)}
        },
        22: {
            name: "Anti-Queens",
           challengeDescription() {
            return "Points and Multi Points buyable have cost scalings " +format(tmp.a.costScalingStartHarsh)+"x stronger."
            + "<br>"+challengeCompletions(this.layer, this.id)+""
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
                let lim = Infinity;
                
                return lim;
            },
goal() {
                let comps = Decimal.mul(challengeCompletions("a", 22), tmp.a.challenges[this.id].scalePower);
                if (comps.gte(5)) comps = comps.sub(2.5);
                if (comps.gte(7)) comps = comps.times(2);
                return Decimal.pow(1e24, Decimal.pow(comps, 3)).times(1e250);
            },

            rewardEffect() { 
                let eff = Decimal.pow(3, Decimal.pow(challengeCompletions("a",22), 2));
                if (!eff.eq(eff)) eff = new Decimal(1);
                if (player.a.challenges[22]>=1 ) eff = eff.times(tmp.u.buyables[11].effect.first)
                return eff;
            },
            rewardDisplay() { return "/"+format(tmp.a.challenges[22].rewardEffect)+" to Ultra Points requirement." },
       
            onEnter() {
player.points = new Decimal(0),
player.m.points = new Decimal(0),
player.m.best = new Decimal(0),
player.m.total = new Decimal(0),
player.m.upgrades = [],
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
player.m.total = new Decimal(0),
player.m.upgrades = [],
player.a.time = new Decimal(1)

            },
            rewardDescription: "Cap for <b>Pointy Multiplier</b> upgrade is cubed.",
         unlocked() {return hasUpgrade("a",26)}
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
            key:"a", description: "A: Reset for absolute points", onPress() {
                if (canReset(this.layer))
                    doReset(this.layer)
            }
        },
    ],
    effectDescription() {
        return "which are boosting Multi Points gain by "+format(tmp.u.effect)+"x."
    },
    
    addToBase() {
        let base = new Decimal(0);
    if (hasUpgrade("a",23)) base= base.add(upgradeEffect("a",23))
    if (hasUpgrade("a",24)) base= base.add(upgradeEffect("a",24))
        return base;
    },
    doReset(resettingLayer) {
        let keep = [];
    
        player.u.time = new Decimal(1)
    
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
    layerShown(){return hasUpgrade("a",16)||player.u.unlocked},
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
