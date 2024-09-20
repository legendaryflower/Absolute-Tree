
addLayer("aP", {
    name: "apotheized points", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "aP", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#FFB5B9",
    requires: new Decimal("1e42600"), // Can be a function that takes requirement increases into account
    resource: "apotheized points", // Name of prestige currency
    baseResource: "multi points", // Name of resource prestige is based on
    baseAmount() {return player.m.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.05, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses




       
        mult = new Decimal(1)

       if (hasUpgrade("aP",12)) mult = mult.times(upgradeEffect("aP",12))
       if (hasUpgrade("a",101)) mult = mult.pow(1.134)
       if (hasUpgrade("aM",11)) mult = mult.times(upgradeEffect("aM",11))
       if (hasUpgrade("aM",14)) mult = mult.times(upgradeEffect("aM",14))
       if (hasUpgrade("a",102)) mult = mult.times(5)
       if (hasUpgrade("aD",17)) mult = mult.times(upgradeEffect("aD",17))
       if (getBuyableAmount("ab",11).gte(4)) mult = mult.times(tmp.aT.effect)
       if (hasUpgrade("aD",31)) mult = mult.pow(2)
      
       if (hasUpgrade("aperdinal",31)) mult = mult.times(upgradeEffect("aperdinal",31))
       if (hasUpgrade("aperdinal",34)) mult = mult.times(upgradeEffect("aperdinal",34))
       if (hasUpgrade("aperdinal",44)) mult = mult.times(upgradeEffect("aperdinal",44))
       if (getBuyableAmount("aP",14).gte(1)) mult = mult.times(tmp.aP.buyables[14].effect.first)
        return mult

    },
    gainExp() { // Calculate the exponent on main currency from bonuses
   
       
        let exp = new Decimal(1)
      
       
        return exp;
    },

  autoUpgrade() {return hasUpgrade("aD",14)},

    passiveGeneration() { return (hasUpgrade("aD", 12)?1:(hasUpgrade("aP", 12)?0.05:0)) },
    softcap() { let cap = new Decimal(1e9)
        if (hasUpgrade("aD",32)) cap = cap.times(upgradeEffect("aD",32))
        return cap;},    softcapPower() {let power = new Decimal(0.09)
        
        return power;
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {
            key:"ctrl+a", description: "Ctrl+A: Reset for apotheized points", onPress() {
                if (canReset(this.layer)&&player.ab.unlocked)
                    doReset(this.layer)
            }
        },
    ],
  
    onPrestige() {return player.m.points = new Decimal(0)},
    layerShown(){return player.aN.tree == "apo"},
    tabFormat: {
        "Buyables": {
            buttonStyle() { return {'background-color': '#FFB5B9'} },
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
    automate(){
        if (hasMilestone("aperdinal",0)) {
          setBuyableAmount("aP",11,tmp.aP.buyables[11].canAfford?player.aP.points.div(1000).log(5).floor().add(1):getBuyableAmount("aP",11))
          setBuyableAmount("aP",12,tmp.aP.buyables[12].canAfford?player.aP.points.div(1e60).log(2.5e4).floor().add(1):getBuyableAmount("aP",12))
          }
          if (hasUpgrade("aperdinal",44)) {
       
            setBuyableAmount("aP",14,tmp.aP.buyables[14].canAfford?player.aP.points.div("1e600").log(1e10).floor().add(1):getBuyableAmount("aP",14))
            }
      },
   
    buyables: {
        11: {
          
            costScaling() {let cost =  new Decimal(1)
             
        return cost;
                 },
            freeLvls() {let free = new Decimal(0)
          
            return free;},
        title() {return "Sede"},
            cost(x) { return new Decimal(1000).mul(new Decimal(5).pow(x)) },
        
            display() { // Everything else displayed in the buyable button after the title
                let data = tmp[this.layer].buyables[this.id]
                return "Cost: " + format(data.cost) + " apotheized points\n\
                Amount: " + player[this.layer].buyables[this.id] + "\n\
               Multiply Multi Points gain by " + format(data.effect.first) + "x. "
            },
            effect(x) { // Effects of owning x of the items, x is a decimal
                let eff = {}
                if (x.gte(0)) eff.first = Decimal.pow(1.03, x.pow(1.07)).times(hasUpgrade("aP",16) ? 1.2 : 1).times(hasUpgrade("aperdinal",55) ? 2.5 : 1)
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
             unlocked() {return player.ab.unlocked}
           
        },
        12: {
          
            costScaling() {let cost =  new Decimal(1)
             
        return cost;
                 },
            freeLvls() {let free = new Decimal(0)
          
            return free;},
        title() {return "Supersede"},
            cost(x) { return new Decimal(1e60).mul(new Decimal(2.5e4).pow(x)) },
        
            display() { // Everything else displayed in the buyable button after the title
                let data = tmp[this.layer].buyables[this.id]
                return "Cost: " + format(data.cost) + " apotheized points\n\
                Amount: " + player[this.layer].buyables[this.id] + "\n\
               Multiply the effect of Cheapcap by " + format(data.effect.first) + "x. "
            },
            effect(x) { // Effects of owning x of the items, x is a decimal
                let eff = {}
                if (x.gte(0)) eff.first = Decimal.pow(1.1, x.pow(1.05))
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
             unlocked() {return hasUpgrade("aM",14)}
           
        },
        13: {
          
            costScaling() {let cost =  new Decimal(1)
             
        return cost;
                 },
            freeLvls() {let free = new Decimal(0)
          
            return free;},
        title() {return "Hypersede"},
            cost(x) { return new Decimal(1e185).mul(new Decimal(1e15).pow(x)) },
        
            display() { // Everything else displayed in the buyable button after the title
                let data = tmp[this.layer].buyables[this.id]
                return "Cost: " + format(data.cost) + " apotheized points\n\
                Amount: " + player[this.layer].buyables[this.id] + "/"+formatWhole(data.purchaseLimit)+"\n\
               Multiply the effect of Glazed Stupe and Apotheic Dimension gain by " + format(data.effect.first) + "x. "
            },
            effect(x) { // Effects of owning x of the items, x is a decimal
                let eff = {}
                if (x.gte(0)) eff.first = Decimal.pow(1.2, x.pow(1.055))
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
             unlocked() {return hasUpgrade("aD",27)},
           purchaseLimit() { let limit = new Decimal(45)
   
            return limit;
           },
        },
        14: {
          
            costScaling() {let cost =  new Decimal(1)
             
        return cost;
                 },
            freeLvls() {let free = new Decimal(0)
          
            return free;},
        title() {return "Ultrasede"},
            cost(x) { return new Decimal("1e600").mul(new Decimal(1e10).pow(x)) },
        
            display() { // Everything else displayed in the buyable button after the title
                let data = tmp[this.layer].buyables[this.id]
                return "Cost: " + format(data.cost) + " apotheized points\n\
                Amount: " + player[this.layer].buyables[this.id] + "\n\
               Multiply Apotheized Points (after softcap) by " + format(data.effect.first) + "x. "
            },
            effect(x) { // Effects of owning x of the items, x is a decimal
                let eff = {}
                if (x.gte(0)) eff.first = Decimal.pow(1.1815, x.pow(1.1))
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
             unlocked() {return hasUpgrade("aperdinal",44)},
          
        },
        21: {
          
            costScaling() {let cost =  new Decimal(1)
             
        return cost;
                 },
            freeLvls() {let free = new Decimal(0)
          
            return free;},
        title() {return "Supremesede"},
            cost(x) { return new Decimal("1e800").mul(new Decimal(1e100).pow(x)) },
        
            display() { // Everything else displayed in the buyable button after the title
                let data = tmp[this.layer].buyables[this.id]
                return "Cost: " + format(data.cost) + " apotheized points\n\
                Amount: " + player[this.layer].buyables[this.id] + "\n\
               Hardcap for Apotheic Mastery starts " + format(data.effect.first) + "x later. "
            },
            effect(x) { // Effects of owning x of the items, x is a decimal
                let eff = {}
                if (x.gte(0)) eff.first = Decimal.pow(1.1815, x.pow(1.1))
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
             unlocked() {return hasUpgrade("aperdinal",47)},
          
        },
    },

    upgrades: {
			
        11: {
            title: "Dolphin's Wrath",
            description: "Apotheic Points multiply Sessions gain.",
            cap() { let cap = new Decimal(1e9)
 if (hasUpgrade("aperdinal",57)) cap = cap.pow(3)
                return cap; },
            cost: new Decimal(5000),
            effect() {
                
              
                let eff = player.aP.points.plus(1).pow(0.064).min(tmp.aP.upgrades[this.id].cap);
        
               
                return eff;
            },
   
        
            
            
           effectDisplay() { return format(tmp.aP.upgrades[11].effect)+"x"+(tmp.aP.upgrades[11].effect.gte(tmp.aP.upgrades[this.id].cap)?" (HARDCAPPED)":"") },
            
        },	
        12: {
            title: "Jellysickles",
            description: "Apotheic Points multiply their own gain. Gain 5% Apotheic Points per second.",
            cost: new Decimal(50000),
            effect() {
                
              
                let eff = player.aP.points.plus(1).pow(0.06)
        
               
                return eff;
            },
   
        
            
unlocked() {return hasUpgrade("aP",11)},            
           effectDisplay() { return format(tmp.aP.upgrades[12].effect)+"x" },
            
        },
        13: {
            title: "Absolute Tree™",
            description: "Points gain is log10(Points.pow(0.05)+2)x",
            cost: new Decimal(125000),
            effect() {
                
              
                let eff = Decimal.log10(player.points.pow(0.05).add(2))
        
               
                return eff;
            },
   
        
            
unlocked() {return hasUpgrade("aP",12)},            
           effectDisplay() { return format(tmp.aP.upgrades[13].effect)+"x" },
            
        },	
        14: {
            title: "Chronic Cheapcaps",
            description: "Unlock Cheapcaps (buyables)",
            cost: new Decimal(600000),
          
            
unlocked() {return hasUpgrade("aP",13)},            
  
            
        },	
        15: {
            title: "Anti-Inflaters",
            description: "Apotheic Points multiply Passive Celestial gain.",
            cost: new Decimal(4000000),
          
            
unlocked() {return hasUpgrade("aP",14)},            
effect() {
                
              
    let eff = player.aP.points.plus(1).pow(0.004)

   
    return eff;
},



 
effectDisplay() { return format(tmp.aP.upgrades[15].effect)+"x" },
            
        },	
        16: {
            title: "Subsede",
            description: "Sede effect*1.2.",
            cost: new Decimal(6000000),
          
            
unlocked() {return hasUpgrade("aP",15)},            

            
        },	
        17: {
            title: "Lanlol",
            description: "Multy cap*50",
            cost: new Decimal(1e9),
          
            
unlocked() {return hasUpgrade("aP",16)},            

            
        },	
       21: {
            title: "Akan?",
            description: "Points gain is hatsuned into 1.01.",
            cost: new Decimal(1e11),
          
            
unlocked() {return hasUpgrade("aP",17)},            

            
        },	
        22: {
            title: "Supertoxin",
            description: "Ultratoxin's effect is multiplied by your Points.",
            cost: new Decimal(5e204),
          
            
unlocked() {return hasUpgrade("a",47)},            

effect() {
                
              
    let eff = player.points.plus(1).pow(3e-6)

   
    return eff;
},




effectDisplay() { return format(tmp.aP.upgrades[22].effect)+"x" },
        },	
        23: {
            title: "Count Bleck",
            description: "Cheapcap Power is raised ^1.5.",
            cost: new Decimal(1e208),
          
            
unlocked() {return hasUpgrade("aP",22)},            


        },	
        24: {
            title: "Buyable Bleck",
            description: "Unlock Strength II.",
            cost: new Decimal(2e208),
          
            
unlocked() {return hasUpgrade("aP",23)},            


        },	
        25: {
            title: "Pointexponentiatier",
            description: "Points gain is raised 1.05.",
            cost: new Decimal(5e208),
          
            
unlocked() {return hasUpgrade("aP",24)},            


        },	
    },
    
    doReset(resettingLayer) {
        let keep = [];
    
        if (player.ab.unlocked) keep.push("upgrades")
        if (player.ab.unlocked) keep.push("buyables")
        if (layers[resettingLayer].row > this.row) layerDataReset("aP", keep)
    },
 
})

addLayer("aM", {
    name: "apothetic mastery", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "aM", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#FF6A78",
    requires: new Decimal(1e37), // Can be a function that takes requirement increases into account
    resource: "apothetic mastery", // Name of prestige currency
    baseResource: "sessions", // Name of resource prestige is based on
    baseAmount() {return player.s.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.05, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses




       
        mult = new Decimal(1)
       if (hasUpgrade("aM",13)) mult = mult.times(2)
       if (hasUpgrade("a",102)) mult = mult.times(5)
       if (hasUpgrade("aB2",11)) mult = mult.times(upgradeEffect("aB2",11))
       if (hasUpgrade("aD",13)) mult = mult.pow(1.4)
       if (hasUpgrade("aperdinal",12)) mult = mult.times(upgradeEffect("aperdinal",12))
       if (hasUpgrade("aD",14)) mult = mult.pow(1.2)
       if (hasUpgrade("aD",17)) mult = mult.times(upgradeEffect("aD",17))
       if (getBuyableAmount("ab",11).gte(4)&&!hasMilestone("aperdinal",0)) mult = mult.times(tmp.aT.effect)
       if (hasUpgrade("aD",26)) mult = mult.times(tmp.aP.buyables[11].effect.first);
       if (hasUpgrade("aD",33)) mult = mult.pow(upgradeEffect("aD",33))
       if (hasUpgrade("aperdinal",43)) mult = mult.pow(1.75)
       if (hasUpgrade("aperdinal",14)) mult = mult.times(20)
       if (hasUpgrade("aperdinal",55)) mult = mult.times(1000)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
   
       
        let exp = new Decimal(1)
      
        if (hasUpgrade("aM",17)) exp = exp.add(1.15)
        if (hasUpgrade("aD",15)) exp = exp.add(0.5)
        return exp;
    },
    hardcapStart () {let hardcap = new Decimal(1e75)
   
  
    if (hasUpgrade("aperdinal",47)) hardcap = hardcap.times(tmp.aP.buyables[21].effect.first)
    if (hasUpgrade("aperdinal",56)) hardcap = hardcap.times(1e6)
    if (hasUpgrade("aperdinal",75)) hardcap = hardcap.times(tmp.aperdinal.buyables[33].effect.first)
    if (hasUpgrade("aperdinal",86)) hardcap = hardcap.pow(1.5)
    return hardcap;},
    passiveGeneration() { return (hasUpgrade("aM", 13))?1:0 },
branches: ["aP"],

    softcap: new Decimal(1e20),
    softcapPower() {let power = new Decimal(0.333)
        if (player.aM.points.gte(1e72)) power = power.sub(0.005)
        return power;
    },
    autoUpgrade() {return hasUpgrade("aD",14)},
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {
            key:"ctrl+m", description: "Ctrl+M: Reset for apotheic mastery points", onPress() {
                if ((canReset(this.layer)&&player.ab.unlocked)&&!hasMilestone("aperdinal",0))
                    doReset(this.layer)
            }
        },
    ],
  
    onPrestige() {return player.m.points = new Decimal(0),
        player.s.points = new Decimal(0),
    player.aP.upgrades = []},
    layerShown(){return player.aN.tree == "apo"&&getBuyableAmount("ab",11).gte(1)},
    update(diff) {
        if (player.aM.points.gte(tmp.aM.hardcapStart)) player.aM.points = new Decimal(tmp.aM.hardcapStart)
      },
    clickables: {
      
        11: {
            title: "Feed him with 1 Nacho",
            display() { return "Req: 1 Apothetic Dimension"},
            unlocked() { return hasUpgrade("aD",22) },
            canClick() { return hasUpgrade("aD",22) && player.aD.points.gt(0) },
            onClick() { 
                player.aD.nachoFed = player.aD.nachoFed.plus(1);
                player.aD.points = player.aD.points.minus(1);
            },
            style: {width: "160px", height: "160px",background:"orange",},
        },
        12: {
            title: "Feed him with all of your Nachoes",
            display() { return "Req: 1 Apothetic Dimension"},
            unlocked() { return hasUpgrade("aD",22) },
            canClick() { return hasUpgrade("aD",22) && player.aD.points.gt(0) },
            onClick() { 
                player.aD.nachoFed = player.aD.nachoFed.plus(player.aD.points);
                player.aD.points = new Decimal(0)
            },
            style: {width: "160px", height: "160px",background:"orange",},
        },
    
    },
   
    tabFormat: {
        "Main": {
            buttonStyle() { return {'background-color': '#FF6A78'} },
            content: ["main-display",
            "prestige-button",
            "resource-display", "blank",
           
            "upgrades",
           
            "blank",
        ]},
        "Mastery": {
     
            content: [
,
            "blank",    "blank",
            "buyables",    "blank",
            "blank",    "blank",
            "blank",    "blank",
        ]},

    
    },
   
    buyables: {
        11: {
          
            costScaling() {let cost =  new Decimal(1)
             
        return cost;
                 },
            freeLvls() {let free = new Decimal(0)
          
            return free;},
        title() {return "Mastered Points"},
            cost(x) { return new Decimal(10).mul(new Decimal(15).pow(x)) },
        
            display() { // Everything else displayed in the buyable button after the title
                let data = tmp[this.layer].buyables[this.id]
                return "Cost: " + format(data.cost) + " apothetic masteries\n\
                Amount: " + player[this.layer].buyables[this.id] + "\n\
               Points gain is multiplied by " + format(data.effect.first) + "x. "
            },
            effect(x) { // Effects of owning x of the items, x is a decimal
                let eff = {}
                if (x.gte(0)) eff.first = Decimal.pow(1.07, x.pow(1.05))
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
             unlocked() {return player.aM.unlocked}
           
        },
    },
    upgrades: {
			
        11: {
            title: "Mastered Apotheosis",
            description: "Apothetic Mastery multiplies Apothetic Points gain.",
            cost: new Decimal(2),
            effect() {
                
              
                let eff = player.aM.points.plus(1.5).pow(0.8)
        
               
                return eff;
            },
   
        
            
            
           effectDisplay() { return format(tmp.aM.upgrades[11].effect)+"x" },
            
        },	
        12: {
            title: "Full Power",
            description: "Sessions raise the Points gain.",
            cost: new Decimal(5),
            effect() {
                
              
                let eff = player.s.points.plus(1).pow(0.0001)
        if (hasUpgrade("aD",12)) eff = eff.times(1.05)
               
                return eff;
            },
   
        
            
            
           effectDisplay() { return "^"+format(tmp.aM.upgrades[12].effect) },
           unlocked() {return hasUpgrade("aM",11)},
            
        },	
        13: {
            title: "Salvaged Apotheosis",
            description: "Gain 100% of Apothetic Master gain. Double Apothetic Mastery gain.",
            cost: new Decimal(8),
            unlocked() {return hasUpgrade("aM",12)},
            
        },	
        14: {
            title: "Seded Effect",
            description: "Unlock Supersede. Apothetic Points gain is (log10(Multi Points.pow(0.005)))x",
            cost: new Decimal(300),
            effect() {
                
              
                let eff = Decimal.log10(player.m.points.pow(0.005).add(2))
        
               
                return eff;
            },
   
        
            unlocked() {return hasUpgrade("aM",13)},
            
           effectDisplay() { return format(tmp.aM.upgrades[14].effect)+"x" },
            
        },	
        15: {
            title: "Business Power",
            description: "Cheapcap I's effect is multiplied by 1.6.",
            cost: new Decimal(1000),
        
            unlocked() {return hasUpgrade("aM",14)},
            
    
            
        },	
        16: {
            title: "Expensivecap",
            description: "Cheapcap's effect is hatsuned to 1.45",
            cost: new Decimal(5000),
        
            unlocked() {return hasUpgrade("aM",15)||player.aB2.points.gte(1)},
            
    
            
        },	
        17: {
            title: "Fracktail",
            description: "Apothetic Mastery exponent is added by 1.15.",
            cost: new Decimal(12000),
        
            unlocked() {return hasUpgrade("aM",16)||player.aB2.points.gte(1)},
            
    
            
        },	
     
    },
    doReset(resettingLayer) {
        let keep = [];
    
        if (player.ab.unlocked) keep.push("upgrades")
        if (player.ab.unlocked) keep.push("buyables")
        if (layers[resettingLayer].row > this.row) layerDataReset("aM", keep)
    },
 
})
addLayer("aperdinal", {
    name: "aperdinal", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "<img src='/Hypotheis.png' style='width:calc(80% - 2px);height:calc(80% - 2px);margin:10%'></img>", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        best: new Decimal(0),
        total: new Decimal(0),
        nachoFed: new Decimal(0),
        dummies: new Decimal(0),
        stabs: new Decimal(0),
        stabPoints: new Decimal(0),
        rebirths: new Decimal(0),
        level: new Decimal(0),
        ExpressionErrorIs: "Harmful",
        levelGen: new Decimal(0),
        xp: new Decimal(0),
      tSP: new Decimal(0),
     tBP: new Decimal(0),
     exponentCoins: new Decimal(0),
     exponentCoinsTotal: new Decimal(0),
     exponentPoints: new Decimal(0),
     orbs: new Decimal(0),
     poachers: new Decimal(0),
       laniLoli: new Decimal(0),
       kos: new Decimal(0),
       tossedKos: new Decimal(0),
       lanberries: new Decimal(0),
    }},
    color: "#7ADBBA",
    exponent: 0.04,
    baseResource: "apothetic mastery",
    resource: "aperdinalities",
    requires() {let base =  new Decimal(1e34)
    if (hasMilestone("aperdinal",0)) base = base.pow(1.1)
    return base;
    }, // Can be a function that takes requirement increases into account
    baseAmount() {return player.aM.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
  
    gainMult() { // Calculate the multiplier for main currency from bonuses




       
        mult = new Decimal(1)
       
    if (hasMilestone("aperdinal",4)) mult = mult.times(5)
    if (hasMilestone("aperdinal",5)) mult = mult.times(10)
    if (hasUpgrade("aperdinal",16)) mult = mult.pow(2)
    if (hasUpgrade("aperdinal",22)) mult = mult.pow(upgradeEffect("aperdinal",22))
    if (hasUpgrade("aperdinal",24)) mult = mult.times(tmp.aperdinal.levelNerf)
    if (hasUpgrade("aperdinal",26)) mult = mult.times(upgradeEffect("aperdinal",26))
    if (hasUpgrade("aperdinal",52)) mult = mult.times(upgradeEffect("aperdinal",52))
    if (hasUpgrade("aperdinal",61)) mult = mult.times(1e12)
    if (hasMilestone("aperdinal",3)) mult = mult.times(2)
    if (hasMilestone("aperdinal",7)) mult = mult.times(milestoneEffect("aperdinal",7))
    if (hasMilestone("aperdinal",9)) mult = mult.times(8)
        return mult

    },
    directMult() { // Calculate the multiplier for main currency from bonuses




       
        mult = new Decimal(1)


    if (hasUpgrade("aperdinal",62)) mult = mult.times(upgradeEffect("aperdinal",62))
    if (hasUpgrade("aperdinal",63)) mult = mult.times(upgradeEffect("aperdinal",63))
    if (hasUpgrade("aperdinal",66)) mult = mult.times(upgradeEffect("aperdinal",66))
        return mult

    },
    effectNerf() {
        return Decimal.pow(this.effectNerfMult(), player.aperdinal.stabPoints.plus()).max(1).times(1);
    },
    effectNerfMult() {let nerf = new Decimal(1.05)
        if (hasMilestone("aperdinal",8)) nerf = nerf.sub(0.04)
    if (hasUpgrade("aperdinal",23)) nerf = nerf.sub(0.0025)
    if (hasUpgrade("aperdinal",25)) nerf = nerf.sub(upgradeEffect("aperdinal",25))
    return nerf;
    },
    stabGainEff() {
        if (!hasUpgrade("aperdinal",14)) return new Decimal(0);
        let eff = Decimal.pow(this.stabGainMult(), player.aperdinal.dummies.plus(1)).sub(1).div(tmp.aperdinal.effectNerf).max(0);

      if (player.aperdinal.stabs.gte(1e224)) eff = eff.div(player.aperdinal.stabs.div(1e224))
        return eff;
    },

    stabGainMult() { let mult = new Decimal(1.02) 
    if (hasUpgrade("aperdinal",15)) mult = mult.times(1.2)
    if (hasUpgrade("aperdinal",16)) mult = mult.times(1.1)
    if (hasUpgrade("aperdinal",17)) mult = mult.times(1.25)
    if (hasUpgrade("aperdinal",24)) mult = mult.times(tmp.aperdinal.levelNerf)
    if (hasUpgrade("aperdinal",33)) mult = mult.pow(upgradeEffect("aperdinal",33))
    if (hasUpgrade("aperdinal",35)) mult = mult.times(upgradeEffect("aperdinal",35))
    if (hasUpgrade("aperdinal",57)) mult = mult.times(tmp.a.buyables[42].effect.first)
    if (hasUpgrade("aperdinal",84)) mult = mult.times(upgradeEffect("aperdinal",84))
    return mult;},

      stabPoGainMult() { let mult = new Decimal(1.01) 
    if (hasUpgrade("aperdinal",15)) mult = mult.sub(0.001)
    if (hasUpgrade("aperdinal",16)) mult = mult.sub(0.0001)
   
    return mult;},
      stabPoGainEff() {
        if (!hasUpgrade("aperdinal",14)) return new Decimal(0);
        let eff = Decimal.pow(this.stabPoGainMult(), player.aperdinal.dummies.plus(1)).sub(1).max(0);
     
        return eff;
    },
    levelNerf() {
        return Decimal.pow(this.lvlNMult(), player.aperdinal.level.plus()).max(1).times(1);
    },
    lvlNMult() {let nerf = new Decimal(1.0985)

    return nerf;
    },
    xpMult() {let mult = new Decimal(1)


   if (hasUpgrade("aperdinal",27)) mult = mult.times(243)
   if (hasUpgrade("aperdinal",53)) mult = mult.times(upgradeEffect("aperdinal",53))
   if (hasUpgrade("aperdinal",54)) mult = mult.pow(2.5)
   if (player.aperdinal.level.gte(40)) mult = mult.pow(0.5)
   if (player.aperdinal.level.gte(100)) mult = mult.pow(0.1)

        return mult;
        },
    gainExp() { // Calculate the exponent on main currency from bonuses
   
       
        let exp = new Decimal(1)
      
       
        return exp;
    },
    update(diff) {
        if (hasUpgrade("aperdinal",14)) player.aperdinal.stabs = player.aperdinal.stabs.plus(tmp.aperdinal.stabGainEff.times(diff));
        if (hasUpgrade("aperdinal",14)) player.aperdinal.stabPoints = player.aperdinal.stabPoints.plus(tmp.aperdinal.stabPoGainEff.times(diff));
        if (hasUpgrade("aperdinal",24)) player.aperdinal.xp = player.aperdinal.xp.plus(player.aperdinal.levelGen.div(20).div(tmp.aperdinal.levelNerf).times(tmp.aperdinal.xpMult));
        if(player.aperdinal.xp.gte(10)&&hasUpgrade("aperdinal",24)) {
            player.aperdinal.xp = new Decimal(0)
            player.aperdinal.level = player.aperdinal.level.add(1)
        }

        if (getClickableState(this.layer, 11)||hasUpgrade("aperdinal",54)) player.aperdinal.tSP = player.aperdinal.tSP.plus(tmp.aperdinal.tSPGain.div(20));
        if (getClickableState(this.layer, 12)||hasAchievement("ach",112)) player.aperdinal.tBP = player.aperdinal.tBP.plus(tmp.aperdinal.tBPGain.div(20));
        if (hasUpgrade("aperdinal",61)) player.aperdinal.exponentPoints = player.aperdinal.exponentPoints.plus(tmp.aperdinal.expPointMulti.div(20));
        if (hasUpgrade("aperdinal",74)) player.aperdinal.exponentCoins = player.aperdinal.exponentCoins.add(tmp.aperdinal.clickables[31].gain.div(20))
        if (hasUpgrade("aperdinal",77)) player.aperdinal.poachers = player.aperdinal.poachers.add(tmp.aperdinal.clickables[51].gain.div(20))
        if (getBuyableAmount("aperdinal",51).gte(1)) player.aperdinal.kos = player.aperdinal.kos.add(tmp.aperdinal.kosGain.div(20))
    },


tSPGain() {let mult = new Decimal(0.1)
if (hasUpgrade("aperdinal",41)) mult = mult.times(upgradeEffect("aperdinal",41))
if (hasUpgrade("aperdinal",42)) mult = mult.times(upgradeEffect("aperdinal",42))
if (hasAchievement("ach",112)) mult = mult.times(125)
if (hasUpgrade("aperdinal",87)) mult = mult.times(1e7)
return mult;},

tBPGain() {let mult = new Decimal(0.1)
    if (hasUpgrade("aperdinal",54)) mult = mult.times(upgradeEffect("aperdinal",54))

if (hasUpgrade("aperdinal",87)) mult = mult.times(1e7)
    return mult;},

branches: ["aM","aT","aP","aB2","aD"],
position:0,
    softcap: new Decimal(1e18),
    softcapPower() {let power = new Decimal(0.133)
        
        return power;
    },
    row: 3, // Row the layer is in on the tree (0 is the first row)
  
  
    onPrestige() {return player.m.points = new Decimal(0),
      
        player.s.points = new Decimal(0),
        player.points = new Decimal(0)
    },
    layerShown(){return player.aN.tree == "apo"&&getBuyableAmount("ab",11).gte(4)},
    tabFormat: {
        "Main": {
            buttonStyle() { return {'background-color': '#7ADBBA'} },
            content: ["main-display",
            "prestige-button",
            "resource-display", "blank",
           
           
           "milestones",
            "blank",
        ]},
        "Upgrades": {
            unlocked() {return hasMilestone("aperdinal",2)},
            content: ["main-display",
            "prestige-button",
            "resource-display", "blank",
           
            ["row", [["upgrade", 11],["upgrade", 12],["upgrade", 13],["upgrade", 14],["upgrade", 15],["upgrade", 16],["upgrade", 17]]],
            ["row", [["upgrade", 21],["upgrade", 22],["upgrade", 23],["upgrade", 24],["upgrade", 25],["upgrade", 26],["upgrade", 27]]],
            ["row", [["upgrade", 31],["upgrade", 32],["upgrade", 33],["upgrade", 34],["upgrade", 35],["upgrade", 36],["upgrade", 37]]],
            "blank",
        ]},
        "Stabverse": {
           unlocked() {return hasUpgrade("aperdinal",14)},
            content: ["main-display",
            "prestige-button",
            "resource-display", "blank",
          
          ["microtabs", "stuff"],
        ]},
        "Tactics": {
            unlocked() {return hasUpgrade("aperdinal",37)},
             content: ["main-display",
             
             "resource-display", "blank",
             ["display-text", function() { return "You have <h1 style='color: #7ADBBA; text-shadow: #7ADBBA 0px 0px 10px;'>"+format(player.aperdinal.tSP)+"</h1> tSP (generated from Tactic 'Searching' active)" }],
             "blank",
             ["display-text", function() { return "You have <h1 style='color: #7ADBBA; text-shadow: #7ADBBA 0px 0px 10px;'>"+format(player.aperdinal.tBP)+"</h1> tBP (generated from Tactic 'Book' active)" }],
             "blank","blank",
             
             ["row", [["clickable", 11],["clickable", 12]]],
             ["row", [["clickable", 21]]],
             "blank",
             ["row", [["upgrade", 41],["upgrade", 42],["upgrade", 43],["upgrade", 44],["upgrade", 45],["upgrade", 46],["upgrade", 47]]],
             ["row", [["upgrade", 51],["upgrade", 52],["upgrade", 53],["upgrade", 54],["upgrade", 55],["upgrade", 56],["upgrade", 57]]],
        
           
         ]},
         "'Seded Rewards'": {
            buttonStyle() {return {'border-color': '#ff9f7f'}},
            unlocked() {return hasUpgrade("aperdinal",55)},
             content: ["main-display",
             
            
             ["display-text", () => (
                (hasUpgrade("aperdinal",55))
                ) ? "<h2>'Seded' Sede Buyable Reward:</h2>" : ""],
             "blank",  "blank",
             ["display-text", () => (
                (hasUpgrade("aperdinal",55))
                ) ? "<h3>Sede effect*2.5</h3>" : ""],
             "blank","blank",
             
             
           
           
         ]},
         "Exponent Tree": {
            buttonStyle() {return {'border-color': '#4BDC13'}},
            unlocked() {return hasAchievement("ach",111)},
             content: ["main-display",
             
            
             ["microtabs", "exponent"],
    
             
             
           
           
         ]},
         "Quantum Masks": {
            buttonStyle() {return {'border-color': 'darkcyan'}},
            unlocked() {return player.ab.points.gte(1e109)||getBuyableAmount("aperdinal",51).gte(1)},
             content: ["main-display",
             
            
             ["microtabs", "quantum"],
    
             
             
           
           
         ]},
    
    },
    clickables: {
        11: {
            title: "Tactic 'Searching'",
            display() {
                if(!getClickableState(this.layer, this.id)) return "Generate 0.1 tSP/s (Tactic-Searching Points)."; else return "Generate 0.1 tSP/s (Tactic-Searching Points).<br>ACTIVE"
            },
            canClick() {
               
               
               
                    if(!getClickableState(this.layer, 12)) return true; else return false
                
            },
            onClick() {
                setClickableState(this.layer, this.id, true)
            },
            unlocked() {return hasUpgrade("aperdinal",37)},
        },
        12: {
            title: "Tactic 'Book'",
            display() {
                if(!getClickableState(this.layer, this.id)) return "Generate 0.1 tBP/s (Tactic-Book Points)."; else return "Generate 0.1 tBP/s (Tactic-Book Points).<br>ACTIVE"
            },
            canClick() {
               
               
               
                    if(!getClickableState(this.layer, 11)) return true; else return false
                
            },
            onClick() {
                setClickableState(this.layer, this.id, true)
            },
            unlocked() {return hasUpgrade("aperdinal",37)},
        },
      
        21: {
            display() { return "Click here to reset Tactics"},
           
            canClick() {
               
               
               
                    if(getClickableState(this.layer, 11) || getClickableState(this.layer, 12)) return true; else return false
                
            },
            onClick() {
            
             

                for (var a = 11; a <= 12; a++) setClickableState(this.layer, a, false)
                  
            },
            unlocked() {return hasUpgrade("aperdinal",37)},
            
            style: {width: "180px", height: "20px",},
        },
        31: {
            gain() { 
                let n = player.aperdinal.points.add(1).max(1)
                if (n.lt("1e36")) return new Decimal(0)
                n = Decimal.pow(55,n.log10().div(50).sub(1)).max(1).mul(tmp.aperdinal.clickables[31].gainmult)
                return n.floor()
            },
            next() {
                let gain = tmp.aperdinal.clickables[31].gain.add(1).max(1)
                let next = Decimal.pow(3,gain.div(tmp.aperdinal.clickables[31].gainmult).log10().add(1).max(1).mul(50))
                return next
            },
            gainmult() {
                let mult = new Decimal(1)
            if (hasUpgrade("aperdinal",65)) mult = mult.times(upgradeEffect("aperdinal",65))
            if (hasUpgrade("aperdinal",67)) mult = mult.times(upgradeEffect("aperdinal",67))
            if (hasUpgrade("aperdinal",73)) mult = mult.pow(3)
            if (hasUpgrade("aperdinal",75)) mult = mult.times(tmp.aperdinal.buyables[21].effect.first)
            if (hasUpgrade("aperdinal",75)) mult = mult.pow(tmp.aperdinal.buyables[22].effect.first)
            if (hasUpgrade("aperdinal",76)) mult = mult.pow(2)
            if (hasUpgrade("aperdinal",81)) mult = mult.times(150)
            if (hasUpgrade("aperdinal",83)) mult = mult.pow(1.85)
                return mult;
            },
            display() {
                let dis = "Reset Aperdinalities for +<h3>" + formatWhole(tmp.aperdinal.clickables[31].gain) + "</h3> Exponent Coins<br>" 

           
                return dis
            },
            canClick() {
                return player.aperdinal.points.gte(1e36)&&hasAchievement("ach",111)
            },
            onClick() {
              player.aperdinal.exponentCoins =     player.aperdinal.exponentCoins.add(tmp.aperdinal.clickables[31].gain)
              player.aperdinal.exponentCoinsTotal =     player.aperdinal.exponentCoinsTotal.add(tmp.aperdinal.clickables[31].gain)
              if (!getBuyableAmount("aperdinal",51).gte(1))        player.aperdinal.points = new Decimal(0)
              if (!getBuyableAmount("aperdinal",51).gte(1))      player.aperdinal.exponentPoints = new Decimal(0)
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
                let cost = new Decimal(25000)
            if (getBuyableAmount("aperdinal",23).gte(1)) cost = cost.div(tmp.aperdinal.buyables[23].effect.first)
            if (player.aperdinal.orbs.gte(8)) cost = cost.pow(1.5)
            if (player.aperdinal.orbs.gte(9)) cost = cost.pow(player.aperdinal.orbs.sub(8).add(1))
            if (player.aperdinal.orbs.gte(16)) cost = cost.pow(player.aperdinal.orbs.sub(14).add(1))
                return cost;
                },
            display() {
                let dis = "Reset Aperdinalities, Exponent Coins, Exponent Points but gain Orbs <br><br>You will gain "+formatWhole(tmp.aperdinal.clickables[41].gain)+" Orbs on reset."
            
           
                return dis
            },
            canClick() {
                return player.aperdinal.exponentCoins.gte(tmp.aperdinal.clickables[41].cost.times(player.aperdinal.orbs.add(1)))
            },
            onClick() {
              player.aperdinal.orbs = player.aperdinal.orbs.add(tmp.aperdinal.clickables[41].gain)
   
           if (!getBuyableAmount("aperdinal",51).gte(1))    player.aperdinal.points = new Decimal(0)
           if (!getBuyableAmount("aperdinal",51).gte(1))  player.aperdinal.exponentCoins = new Decimal(0)
           if (!getBuyableAmount("aperdinal",51).gte(1))  player.aperdinal.exponentPoints = new Decimal(0)

                },
                style: {'height':'130px', 'width':'175px', 'font-size':'13px',
               
            
            },
            
      
        },
        51: {
            gain() { 
                let n = player.aperdinal.exponentCoins.add(1).max(1)
                if (n.lt("1e50")) return new Decimal(0)
                n = Decimal.pow(52,n.log10().div(50).sub(1)).max(1).mul(tmp.aperdinal.clickables[51].gainmult)
                return n.floor()
            },
            next() {
                let gain = tmp.aperdinal.clickables[51].gain.add(1).max(1)
                let next = Decimal.pow(3,gain.div(tmp.aperdinal.clickables[51].gainmult).log10().add(1).max(1).mul(50))
                return next
            },
            gainmult() {
           let mult = new Decimal(1)
           if (hasUpgrade("aperdinal",83)) mult = mult.times(1.5)
                return mult;
            },
            display() {
                let dis = "Reset Aperdinalities and previous progress for +<h3>" + formatWhole(tmp.aperdinal.clickables[51].gain) + "</h3> Poachers.<br>" 

           
                return dis
            },
            canClick() {
                return player.aperdinal.exponentCoins.gte(1e50)&&hasUpgrade("aperdinal",77)
            },
            onClick() {
                player.aperdinal.poachers = player.aperdinal.poachers.add(tmp.aperdinal.clickables[51].gain)
                player.aperdinal.points = new Decimal(0)
                player.aperdinal.exponentCoins = new Decimal(0)
                player.aperdinal.exponentPoints = new Decimal(0)
         
       
          
                },
                style: {'height':'130px', 'width':'175px', 'font-size':'13px',
               
            
            },
            
        },
        61: {
            gain() { 
                let n = new Decimal(1)
                return n
            },
            req() {
         let req = new Decimal(500)
   if (player.aperdinal.tossedKos.gte(6)) req = req.times(player.aperdinal.tossedKos.add(1))
         return req.times(player.aperdinal.tossedKos.plus(1))

            },
          
            display() {
                let dis = "Toss out your Kos<br><br>Req: "+formatWhole(tmp.aperdinal.clickables[61].req)+" Kos. You'll gain "+formatWhole(tmp.aperdinal.clickables[61].gain)+" Tossed Kos." 

           
                return dis
            },
            canClick() {
                return player.aperdinal.kos.gte(tmp.aperdinal.clickables[61].req)
            },
            onClick() {
                player.aperdinal.kos = new Decimal(0)
             
                player.aperdinal.tossedKos = player.aperdinal.tossedKos.add(1)
       
          
                },
                style: {'height':'130px', 'width':'175px', 'font-size':'13px',
               
            
            },
            unlocked() {return hasUpgrade("aN",11)},
        },
    },
    microtabs: {
        stuff: {
            "Stab Building": {
                content: [
                
                    ["row", [
                        ["column", [
                            ["display-text", function() { return "<h3>"+formatWhole(player.aperdinal.stabs)+"<br>Stabs</h3>" }],
                        
                            ["display-text", function() { return "You are gaining "+format(tmp.aperdinal.stabGainEff)+" Stabs per second." }],
                        ], {width: "9em"}],
                        ["tall-display-text", "<div class='vl2'></div>", {height: "223.667px"}],
                    "blank",	"blank",	"blank",	"blank",	"blank",	"blank",	"blank",	"blank",	"blank",
                        ["column", [
                            ["display-text", function() { return "<h3>"+formatWhole(player.aperdinal.stabPoints)+"<br>Stab Points</h3>" }],
                            
                            ["display-text", function() { return "You are gaining "+format(tmp.aperdinal.stabPoGainEff)+" Stab Points per second, but are divding Stabs gain." }],
                            ["display-text", function() { return "<br>Stab Points divide Stabs gain because of Divine Conflict. Your Stabs gain is being divided by /"+format(tmp.aperdinal.effectNerf)+"." }],
                        ], {width: "9em"}],
                    ], function() { return {display: hasUpgrade("aperdinal",14)?"":"none"} }], "blank", "blank",
                  
                    "blank",
                    ["display-text", function() { return "<h2>You have "+formatWhole(player.aperdinal.dummies)+" Dummies.</h2>" }],
                    ["row", [["buyable", 11]]],
                    ["blank", "95px"],
                ]
            },
            "Levels": {
                unlocked: () => 	(hasUpgrade("aperdinal",24)),
                content: [
                  

                   ["bar","level"],
                   "blank",
                   ["display-text", function() { return "You have "+formatWhole(player.aperdinal.xp)+" Experience Points</h3>" }],
                   "blank",
                   ["display-text", () => (
                    (player.aperdinal.level.gte(40))
                    ) ? "<br><span style='color:red'>After 40 levels, XP gain is ^0.5.</span><br>" : ""],
                   ["display-text", function() { return "You have "+formatWhole(player.aperdinal.level)+" Levels, which are dividing XP gain by "+format(tmp.aperdinal.levelNerf)+", but are multiplying Aperdinalities and Stabs gain by the same amount.</h3>" }],
                   "blank",
                   ["row", [["buyable", 12],["buyable", 13],["buyable", 14],["buyable", 15],["buyable", 16]]],
                ]
            },
           
           
        
        },
        exponent: {
            "Exponent Coins": {
                buttonStyle() {return {'border-color': '#4BDC13'}},
                unlocked() {return hasAchievement("ach",111)},
                content: [
                    ["display-text", function() { return "You have <h2 style='color: #4BDC13; text-shadow: #4BDC13 0px 0px 10px;'>"+formatWhole(player.aperdinal.exponentPoints)+"</h2> Exponent Points." }],
                    "blank",
                    ["display-text", function() { return "You have <h2 style='color: #4BDC13; text-shadow: #4BDC13 0px 0px 10px;'>"+formatWhole(player.aperdinal.exponentCoins)+"</h2> Exponent Coins." }],
                    "blank",
              
                    ["row", [["clickable", 31]]],
                    "blank",
                    "blank",
                    ["row", [["upgrade", 61],["upgrade", 62],["upgrade", 63],["upgrade", 64],["upgrade", 65],["upgrade", 66],["upgrade", 67]]],
                    ["row", [["upgrade", 71],["upgrade", 72],["upgrade", 73],["upgrade", 74],["upgrade", 75],["upgrade", 76],["upgrade", 77]]],
                 
                    ["blank", "95px"],
                ]
            },
            "Orbs": {
                buttonStyle() {return {'border-color': '#e83427'}},
                unlocked() {return hasUpgrade("aperdinal",75)},
                content: [
                    ["display-text", function() { return "You have <h2 style='color: #4BDC13; text-shadow: #4BDC13 0px 0px 10px;'>"+formatWhole(player.aperdinal.exponentCoins)+"</h2> Exponent Coins." }],
                    "blank",
                    ["display-text", function() { return "You have <h2 style='color: #e83427; text-shadow: #e83427 0px 0px 10px;'>"+formatWhole(player.aperdinal.orbs)+"</h2> Orbs." }],
                    "blank",
                    ["row", [["clickable", 41]]],
                    "blank",
                    ["row", [["buyable", 21],["buyable", 22],["buyable", 23]]],
                    ["row", [["buyable", 31],["buyable",32],["buyable", 33]]],
                    ["row", [["buyable", 41],["buyable", 42],["buyable", 43]]],
                    "blank",
                    "blank",
          
                    ["blank", "95px"],
                ]
            },
            "Poachers": {
                buttonStyle() {return {'border-color': 'cyan'}},
                unlocked() {return hasUpgrade("aperdinal",77)},
                content: [
                    ["display-text", function() { return "You have <h2 style='color: #4BDC13; text-shadow: #4BDC13 0px 0px 10px;'>"+formatWhole(player.aperdinal.exponentCoins)+"</h2> Exponent Coins." }],
                    "blank",
                    ["display-text", function() { return "You have <h2 style='color: #4BDC13; text-shadow: #4BDC13 0px 0px 10px;'>"+formatWhole(player.aperdinal.exponentPoints)+"</h2> Exponent Points." }],
                    "blank",
                    ["display-text", function() { return "You have <h2 style='color: cyan; text-shadow: cyan 0px 0px 10px;'>"+formatWhole(player.aperdinal.poachers)+"</h2> Poachers." }],
                    "blank",
                   
                    "blank",
                 
                    "blank",
                    "blank",
                    ["row", [["upgrade", 81],["upgrade", 82],["upgrade", 83],["upgrade", 84],["upgrade", 85],["upgrade", 86],["upgrade", 87]]],
                    ["blank", "95px"],
                ]
            },
           
           
           
        
        },
        quantum: {
            "Lani-Loli": {
                buttonStyle() {return {'border-color': 'darkcyan'}},
                unlocked() {return player.ab.points.gte(1e61)||getBuyableAmount("aperdinal",51).gte(1)},
                content: [
                   
                 ["display-text", function() { return "You have <h2 style='color: cyan; text-shadow: cyan 0px 0px 10px;'>"+formatWhole(player.aperdinal.poachers)+"</h2> Poachers." }],
                    "blank",
                    ["display-text", function() { return "You have <h3 style='color: darkcyan; text-shadow: drakcyan 0px 0px 10px;'>"+formatWhole(player.aperdinal.kos)+"</h3> Kos. You are gaining "+format(tmp.aperdinal.kosGain)+" Kos per second." }],
                    "blank",
                    ["row", [["buyable", 51]]],
                    "blank",
                    "blank",
                    ["row", [["clickable", 61]]],
                 
                    ["blank", "35px"],
                    ["display-text", function() { return "You have tossed out <h3 style='color: darkcyan; text-shadow: drakcyan 0px 0px 10px;'>"+formatWhole(player.aperdinal.tossedKos)+"</h3> Kos, which are raising Points gain by "+format(tmp.aperdinal.tosKosEff)+"." }],
                ]
            },
           
         
           
           
           
        
        },
    },
    tosKosEff() {
        return Decimal.pow(1.001, player.aperdinal.tossedKos.plus()).max(1).times(1);
    }, 
    expPointMulti() {
        let mult = new Decimal(1)
  if (hasUpgrade("aperdinal",64)) mult = mult.times(upgradeEffect("aperdinal",64))
  if (hasUpgrade("aperdinal",72)) mult = mult.pow(3)
        return mult;
    },    passiveGeneration() { return (hasUpgrade("aperdinal", 12)?1:0) },
    buyables: {
        11: {
            scalePow() {
             let pow = new Decimal(1)
            if (getBuyableAmount("aperdinal",11).gte(10)) pow = pow.add(.01).add(getBuyableAmount("aperdinal",11).add(1).div(50))
         return pow;   
         },
             cost(x) { return new Decimal(50000).pow(new Decimal(1.2).pow(x)).pow(tmp.aperdinal.buyables[11].scalePow) },
             title() { return "Dummy" },
 
             display() { // Everything else displayed in the buyable button after the title
                 let data = tmp[this.layer].buyables[this.id]
                 return "Cost: " + format(data.cost) + " Aperdinalities \n\
                 Amount: " + player[this.layer].buyables[this.id] + " / 11\n\
                Construct 1 Dummy"
             }, 
           
             canAfford() { return player.aperdinal.points.gte(this.cost()) },
             buy() {
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
               player.aperdinal.points = player.aperdinal.points.sub(this.cost())
                   player.aperdinal.dummies = player.aperdinal.dummies.add(1)
            
             },
         unlocked() {return hasUpgrade("aperdinal",14)},
         purchaseLimit:11,
            },
            12: {
                scalePow() {
                 let pow = new Decimal(1)
                
             return pow;   
             },
                 cost(x) { return new Decimal(3).pow(new Decimal(5).pow(x)) },
                 title() { return "Level Generator" },
     
                 display() { // Everything else displayed in the buyable button after the title
                     let data = tmp[this.layer].buyables[this.id]
                     return "Cost: " + format(data.cost) + " Aperdinalities \n\
                     Amount: " + player[this.layer].buyables[this.id] + "\n\
                    Generate 0.1 XP per second."
                 }, 
              
            effect(x) { // Effects of owning x of the items, x is a decimal
                let eff = {}
                if (x.gte(0)) eff.first = Decimal.pow(1.07, x.pow(1.05))
                else eff.first = Decimal.pow(1/50, x.times(-1).pow(1.0))
            
                if (x.gte(0)) eff.second = x.pow(0.8)
                else eff.second = x.times(-1).pow(0.8).times(-1)
                return eff;
            },
                 canAfford() { return player.aperdinal.points.gte(this.cost()) },
                 buy() {
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                   player.aperdinal.points = player.aperdinal.points.sub(this.cost())
                       player.aperdinal.levelGen = player.aperdinal.levelGen.add(0.1)
                
                 },
             unlocked() {return hasUpgrade("aperdinal",14)},
                },
                21: {
                    scalePow() {
                     let pow = new Decimal(1)
                    
                 return pow;   
                 },
                     cost(x) { return new Decimal(1000).times(new Decimal(12.5).pow(x)) },
                     title() { return "Orbic Exponent" },
         
                     display() { // Everything else displayed in the buyable button after the title
                         let data = tmp[this.layer].buyables[this.id]
                         return "Cost: " + format(data.cost) + " exponent points \n\
                         Amount: " + player[this.layer].buyables[this.id] + " / 75\n\
                        Multiply Exponent Coins gain & Exponential Frostbite effect by "+ format(data.effect.first)+"x."
                     }, 
                  
                effect(x) { // Effects of owning x of the items, x is a decimal
                    let eff = {}
                    if (x.gte(0)) eff.first = Decimal.pow(1.07, x.pow(1.05))
                    else eff.first = Decimal.pow(1/50, x.times(-1).pow(1.0))
                
                    if (x.gte(0)) eff.second = x.pow(0.8)
                    else eff.second = x.times(-1).pow(0.8).times(-1)
                    return eff;
                },
                     canAfford() { return player.aperdinal.exponentPoints.gte(this.cost()) },
                     buy() {
                               player.aperdinal.exponentPoints = player.aperdinal.exponentPoints.sub(this.cost())
                        setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
             
   
                    
                     },
                     purchaseLimit:75,
                 unlocked() {return hasUpgrade("aperdinal",75)},
                    },
                    22: {
                        scalePow() {
                         let pow = new Decimal(1)
                        
                     return pow;   
                     },
                         cost(x) { return new Decimal(500).times(new Decimal(10).pow(x)) },
                         title() { return "Square-up" },
             
                         display() { // Everything else displayed in the buyable button after the title
                             let data = tmp[this.layer].buyables[this.id]
                             return "Cost: " + format(data.cost) + " exponent points \n\
                             Amount: " + player[this.layer].buyables[this.id] + " / "+tmp.aperdinal.buyables[22].purchaseLimit+"\n\
                            Raise Exponent Coins gain by ^"+ format(data.effect.first)+"."
                         }, 
                      
                    effect(x) { // Effects of owning x of the items, x is a decimal
                        let eff = {}
                        if (x.gte(0)) eff.first = Decimal.pow(1.05, x.pow(1.02)).times(tmp.aperdinal.buyables[31].effect.first)
                        else eff.first = Decimal.pow(1/50, x.times(-1).pow(1.0))
                    
                        if (x.gte(0)) eff.second = x.pow(0.8)
                        else eff.second = x.times(-1).pow(0.8).times(-1)
                        return eff;
                    },
                         canAfford() { return player.aperdinal.exponentPoints.gte(this.cost()) },
                         buy() {
                                   player.aperdinal.exponentPoints = player.aperdinal.exponentPoints.sub(this.cost())
                            setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                 
       
                        
                         },
                         purchaseLimit() {let limit = new Decimal(18)
                        if (hasUpgrade("aperdinal",77)) limit = limit.add(1)
                        if (hasUpgrade("aperdinal",82)) limit = limit.add(1)
                        return limit;},
                     unlocked() {return player.aperdinal.orbs.gte(2)||getBuyableAmount("aperdinal",22).gte(1)},
                        },
                        23: {
                            scalePow() {
                             let pow = new Decimal(1)
                            
                         return pow;   
                         },
                             cost(x) { return new Decimal(1700).times(new Decimal(15).pow(x)) },
                             title() { return "Cube-up" },
                 
                             display() { // Everything else displayed in the buyable button after the title
                                 let data = tmp[this.layer].buyables[this.id]
                                 return "Cost: " + format(data.cost) + " exponent points \n\
                                 Amount: " + player[this.layer].buyables[this.id] + "\n\
                                Divide Orbs cost by /"+ format(data.effect.first)+"."
                             }, 
                          
                        effect(x) { // Effects of owning x of the items, x is a decimal
                            let eff = {}
                            if (x.gte(0)) eff.first = Decimal.pow(1.06, x.pow(1.0251))
                            else eff.first = Decimal.pow(1/50, x.times(-1).pow(1.0))
                        
                            if (x.gte(0)) eff.second = x.pow(0.8)
                            else eff.second = x.times(-1).pow(0.8).times(-1)
                            return eff;
                        },
                             canAfford() { return player.aperdinal.exponentPoints.gte(this.cost()) },
                             buy() {
                                       player.aperdinal.exponentPoints = player.aperdinal.exponentPoints.sub(this.cost())
                                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                     
           
                            
                             },
                         unlocked() {return player.aperdinal.orbs.gte(3)||getBuyableAmount("aperdinal",23).gte(1)},
                            },
                            31: {
                                scalePow() {
                                 let pow = new Decimal(1)
                                
                             return pow;   
                             },
                                 cost(x) { return new Decimal(3600).times(new Decimal(11).pow(x)) },
                                 title() { return "Square-square-up" },
                     
                                 display() { // Everything else displayed in the buyable button after the title
                                     let data = tmp[this.layer].buyables[this.id]
                                     return "Cost: " + format(data.cost) + " exponent points \n\
                                     Amount: " + player[this.layer].buyables[this.id] + " / 23\n\
                                    Multiply the effect of Square-up by "+ format(data.effect.first)+"x."
                                 }, 
                              
                            effect(x) { // Effects of owning x of the items, x is a decimal
                                let eff = {}
                                if (x.gte(0)) eff.first = Decimal.pow(1.04, x.pow(1.001))
                                else eff.first = Decimal.pow(1/50, x.times(-1).pow(1.0))
                            
                                if (x.gte(0)) eff.second = x.pow(0.8)
                                else eff.second = x.times(-1).pow(0.8).times(-1)
                                return eff;
                            },
                                 canAfford() { return player.aperdinal.exponentPoints.gte(this.cost()) },
                                 buy() {
                                           player.aperdinal.exponentPoints = player.aperdinal.exponentPoints.sub(this.cost())
                                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                         
               
                                
                                 },
                                 purchaseLimit() {let limit = new Decimal(23)
                        
                                    return limit;},
                             unlocked() {return player.aperdinal.orbs.gte(4)||getBuyableAmount("aperdinal",31).gte(1)},
                                },
                                32: {
                                    scalePow() {
                                     let pow = new Decimal(1)
                                    
                                 return pow;   
                                 },
                                     cost(x) { return new Decimal(2).pow(new Decimal(2).pow(x)) },
                                     title() { return "Superseders" },
                         
                                     display() { // Everything else displayed in the buyable button after the title
                                         let data = tmp[this.layer].buyables[this.id]
                                         return "Cost: " + format(data.cost) + " exponent points \n\
                                         Amount: " + player[this.layer].buyables[this.id] + "\n\
                                        Multiply Nursery Point gain by "+ format(data.effect.first)+"x."
                                     }, 
                                  
                                effect(x) { // Effects of owning x of the items, x is a decimal
                                    let eff = {}
                                    if (x.gte(0)) eff.first = Decimal.pow(2, x.pow(1.5))
                                    else eff.first = Decimal.pow(1/50, x.times(-1).pow(1.0))
                                
                                    if (x.gte(0)) eff.second = x.pow(0.8)
                                    else eff.second = x.times(-1).pow(0.8).times(-1)
                                    return eff;
                                },
                                     canAfford() { return player.aperdinal.exponentPoints.gte(this.cost()) },
                                     buy() {
                                               player.aperdinal.exponentPoints = player.aperdinal.exponentPoints.sub(this.cost())
                                        setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                             
                   
                                    
                                     },
                                 unlocked() {return player.aperdinal.orbs.gte(5)||getBuyableAmount("aperdinal",32).gte(1)},
                                    },
                                    33: {
                                        scalePow() {
                                         let pow = new Decimal(1)
                                        
                                     return pow;   
                                     },
                                         cost(x) { return new Decimal(2).pow(new Decimal(2.5).pow(x)) },
                                         title() { return "Stripper-Power" },
                             
                                         display() { // Everything else displayed in the buyable button after the title
                                             let data = tmp[this.layer].buyables[this.id]
                                             return "Cost: " + format(data.cost) + " exponent points \n\
                                             Amount: " + player[this.layer].buyables[this.id] + "\n\
                                            Hardcap for Apotheic Mastery starts "+ format(data.effect.first)+"x later."
                                         }, 
                                      
                                    effect(x) { // Effects of owning x of the items, x is a decimal
                                        let eff = {}
                                        if (x.gte(0)) eff.first = Decimal.pow(1.75, x.pow(1.45))
                                        else eff.first = Decimal.pow(1/50, x.times(-1).pow(1.0))
                                    
                                        if (x.gte(0)) eff.second = x.pow(0.8)
                                        else eff.second = x.times(-1).pow(0.8).times(-1)
                                        return eff;
                                    },
                                         canAfford() { return player.aperdinal.exponentPoints.gte(this.cost()) },
                                         buy() {
                                                   player.aperdinal.exponentPoints = player.aperdinal.exponentPoints.sub(this.cost())
                                            setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                                 
                       
                                        
                                         },
                                     unlocked() {return player.aperdinal.orbs.gte(6)||getBuyableAmount("aperdinal",33).gte(1)},
                                        },
                                        41: {
                                            scalePow() {
                                             let pow = new Decimal(1)
                                   
                                         return pow;   
                                         },
                                             cost(x) { return new Decimal(50).pow(new Decimal(3).pow(x)) },
                                             title() { return "Power Combo" },
                                 
                                             display() { // Everything else displayed in the buyable button after the title
                                                 let data = tmp[this.layer].buyables[this.id]
                                                 return "Cost: " + format(data.cost) + " exponent points \n\
                                                 Amount: " + player[this.layer].buyables[this.id] + "\n\
                                                Impossible Errors effect is multiplied by "+ format(data.effect.first)+"x."
                                             }, 
                                          
                                        effect(x) { // Effects of owning x of the items, x is a decimal
                                            let eff = {}
                                            if (x.gte(0)) eff.first = Decimal.pow(1.5, x.pow(1.35))
                                            else eff.first = Decimal.pow(1/50, x.times(-1).pow(1.0))
                                        
                                            if (x.gte(0)) eff.second = x.pow(0.8)
                                            else eff.second = x.times(-1).pow(0.8).times(-1)
                                            return eff;
                                        },
                                             canAfford() { return player.aperdinal.exponentPoints.gte(this.cost()) },
                                             buy() {
                                                       player.aperdinal.exponentPoints = player.aperdinal.exponentPoints.sub(this.cost())
                                                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                                     
                           
                                            
                                             },
                                         unlocked() {return player.aperdinal.orbs.gte(7)||getBuyableAmount("aperdinal",41).gte(1)},
                                            },
                                            51: {
                                                scalePow() {
                                                 let pow = new Decimal(1)
                                                
                                             return pow;   
                                             },
                                                 cost(x) { return new Decimal(1e109).times(new Decimal(10).pow(x)) },
                                                 title() { return "Kos Buyable" },
                                     
                                                 display() { // Everything else displayed in the buyable button after the title
                                                     let data = tmp[this.layer].buyables[this.id]
                                                     return "Cost: " + format(data.cost) + " apeoblabla points \n\
                                                     Amount: " + player[this.layer].buyables[this.id] + "\n\
                                                    Gain 1 Kos per second each purchased."
                                                 }, 
                                               
                                                 canAfford() { return player.ab.points.gte(this.cost()) },
                                                 buy() {
                                                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                                                   player.ab.points = player.ab.points.sub(this.cost())
                                           
                                                
                                                 },
                                             unlocked() {return player.ab.points.gte(1e109)||getBuyableAmount("aperdinal",51).gte(1)},
                                            
                                                },
               
    },
    kosGain() { let kos = new Decimal(player.aperdinal.buyables[51])
    if (hasUpgrade("aN",12)) kos = kos.pow(1.5)
    return kos;},
    bars: {
        level: {
            direction: UP,
            height: 200,
            width: 100,
            progress() {return player.aperdinal.xp.div(10)},
        },
    },
    upgrades: {
			
        11: {
            title: "Inflated Workshop",
            description: "Raise points gain by 1.005.",
          
            cost: new Decimal(300),
         
            
        },	
        12: {
            title: "Impossible Errors",
            description: "Gain more Apotheic Mastery based on Multi Points. Gain 100% of Aperdinalities per second.",
          
            cost: new Decimal(600),
            unlocked() {return hasUpgrade("aperdinal",11)},
            effect() {
                
              
                let eff = player.m.points.plus(1).pow(1e-6)
         if (hasUpgrade("aperdinal",75)) eff = eff.times(tmp.aperdinal.buyables[41].effect.first)
               
                return eff;
            },
   
        
        
            
           effectDisplay() { return format(tmp.aperdinal.upgrades[12].effect)+"x" },
            
        },	
        13: {
            title: "'BeetleDancer999'",
            description: "Apeoblabla Points is multiplied by your Aperdinalities.",
          
            cost: new Decimal(1000),
            unlocked() {return hasUpgrade("aperdinal",12)},
            effect() {
                
              
                let eff = player.aperdinal.points.plus(1).pow(0.09)
        
               
                return eff;
            },
   
        
        
            
           effectDisplay() { return format(tmp.aperdinal.upgrades[13].effect)+"x" },
            
        },	
        14: {
            title: "Stabverse",
            description: "Unlock Stabverse. Awakening Power buyable cost is ^0.5, Gain 20 times more Apothetic Masteries.",
          
            cost: new Decimal(50000),
            unlocked() {return hasUpgrade("aperdinal",13)},
         
            
        },	
        15: {
            title: "Stabmania", 
            description: "Stab gain*1.2, Stab Point gain-0.001",
          
            cost: new Decimal(5000000),
            unlocked() {return hasUpgrade("aperdinal",14)},
         
            
        },
        16: {
            title: "Zombie",
            description: "Stab gain*1.1, Stab Point gain-0.0001, Aperdinallity gain^2",
          
            cost: new Decimal(6000000),
            unlocked() {return hasUpgrade("aperdinal",15)},
         
            
        },
        17: {
            title: "Frogs",
            description: "Stab gain*1.25.",
          
            cost: new Decimal(1e8),
            unlocked() {return hasUpgrade("aperdinal",16)},
         
            
        },
        21: {
            title: "Frog Knight",
            description: "Gain more Points based on Stabs. You autoclick 'Feed him with all of your nachoes' every tick without 'actually' spending any Apotheic Dimensions.",
          
            cost: new Decimal(2e8),
            unlocked() {return hasUpgrade("aperdinal",17)},
            effect() {
                
              
                let eff = player.aperdinal.stabs.plus(1).pow(0.1)
        
               
                return eff;
            },
   
        
        
            
           effectDisplay() { return format(tmp.aperdinal.upgrades[21].effect)+"x" },
            
        },
        22: {
            title: "Frog King",
            description: "Aperdinalities gain is boosted based on Stabs.",
          
            cost: new Decimal(2.5e8),
            unlocked() {return hasUpgrade("aperdinal",21)},
            effect() {
                
              
                let eff = player.aperdinal.stabs.plus(1).pow(0.05).min(tmp.aperdinal.upgrades[this.id].cap);
        
               
                return eff;
            },
            cap() { let cap = new Decimal(30)

                return cap; },
        
        
            
           effectDisplay() { return "^"+format(tmp.aperdinal.upgrades[22].effect)+(tmp.aperdinal.upgrades[22].effect.gte(tmp.aperdinal.upgrades[this.id].cap)?" (HARDCAPPED)":"") }, 
      



            
        },
        23: {
            title: "Wooden Golem",
            description: "Weaken the effect from Stab Points.",
          
            cost: new Decimal(5e9),
            unlocked() {return hasUpgrade("aperdinal",22)},
           tooltip() {return "-0.0025"},
            
        },
        24: {
            title: "Stone Golem",
            description: "Unlock Levels.",
          
            cost: new Decimal(1e10),
            unlocked() {return hasUpgrade("aperdinal",23)},

            
        },
        25: {
            title: "Heavenly Midbus",
            description: "Subtract the Stab Point negative effect based on Points.",
            effect() {           
                let eff = player.points.add(1).log10().sqrt().div(1e5).times(1);
                return eff;
            },
            effectDisplay() { return "-"+format(tmp.aperdinal.upgrades[25].effect) },
            cost: new Decimal(7e10),
            unlocked() {return hasUpgrade("aperdinal",24)},

            
        },
        26: {
            title: "Amethyster",
            description: "Aperdinalities gain is multiplied by your Levels.",
            
            cost: new Decimal(1e11),
            effect() {           
                let eff = player.aperdinal.level.plus(1).pow(0.651)


                return eff;
            },
            effectDisplay() { return format(tmp.aperdinal.upgrades[26].effect)+"x" },
            unlocked() {return hasUpgrade("aperdinal",25)},

            
        },
        27: {
            title: "P&G Demon",
            description: "XP gain is multiplied by 243.",
            
            cost: new Decimal(6e11),
          
            unlocked() {return hasUpgrade("aperdinal",26)},

            
        },
        31: {
            title: "Kraken",
            description: "Apotheized Points is multiplied by your Stabs.",
            
            cost: new Decimal(1e22),
            effect() {           
                let eff = player.aperdinal.stabs.plus(1).pow(0.8)

if (hasUpgrade("aperdinal",36)) eff = eff.pow(1.2)
                return eff;
            },
            effectDisplay() { return format(tmp.aperdinal.upgrades[31].effect)+"x" },
            unlocked() {return hasUpgrade("aperdinal",27)},

            
        },
        32: {
            title: "Pelle",
            description: "Stabs multiply Axis Normal gain.",
            
            cost: new Decimal(1e23),
            effect() {           
                let eff = player.aperdinal.stabs.plus(1).pow(0.03)


                return eff;
            },
            effectDisplay() { return format(tmp.aperdinal.upgrades[32].effect)+"x" },
            unlocked() {return hasUpgrade("aperdinal",31)},

            
        },
        33: {
            title: "Dragon",
            description: "Stabs raise their own gain.",
            
            cost: new Decimal(3e23),
            effect() {           
                let eff = player.aperdinal.stabs.plus(1).pow(0.0025)


                return eff;
            },
            effectDisplay() { return "^"+format(tmp.aperdinal.upgrades[33].effect) },
            unlocked() {return hasUpgrade("aperdinal",32)},

            
        },
        34: {
            title: "Terminal Stabs",
            description: "Apotheic Points gain is multiplied by your Levels.",
            
            cost: new Decimal(4e26),
            effect() {           
                let eff = player.aperdinal.level.plus(1).pow(0.2)


                return eff;
            },
            effectDisplay() { return format(tmp.aperdinal.upgrades[34].effect)+"x" },
            unlocked() {return hasUpgrade("aperdinal",33)},

            
        },
        35: {
            title: "Rebirthed",
            description: "Stabs gain is multiplied by your Levels.",
            
            cost: new Decimal(7.5e27),
            effect() {           
                let eff = player.aperdinal.level.plus(1).pow(0.15)


                return eff;
            },
            effectDisplay() { return format(tmp.aperdinal.upgrades[35].effect)+"x" },
            unlocked() {return hasUpgrade("aperdinal",34)},

            
        },
        36: {
            title: "Master",
            description: "Kraken effect^1.2",
            
            cost: new Decimal(1e32),
           
            unlocked() {return hasUpgrade("aperdinal",35)},

            
        },
        37: {
            title: "Tactical Nuke",
            description: "Unlock Tactics.",
            
            cost: new Decimal(1e33),
           
            unlocked() {return hasUpgrade("aperdinal",36)},

            
        },
        41: {
            title: "Frosty Thing",
            description: 'Points multiply tSP gain.',
            
            cost: new Decimal(3),
            currencyDisplayName: "tSP",
            currencyInternalName: "tSP",
            currencyLayer: "aperdinal",
            effect() {           
                let eff = player.points.plus(1).pow(0.000006)


                return eff;
            },
            effectDisplay() { return format(tmp.aperdinal.upgrades[41].effect)+"x" },
            unlocked() {return hasUpgrade("aperdinal",37)},

            
        },
        42: {
            title: "Chili Thing",
            description: 'Multi Points multiply tSP gain.',
            
            cost: new Decimal(10),
            currencyDisplayName: "tSP",
            currencyInternalName: "tSP",
            currencyLayer: "aperdinal",
            effect() {           
                let eff = player.m.points.plus(1).pow(2e-6)


                return eff;
            },
            effectDisplay() { return format(tmp.aperdinal.upgrades[42].effect)+"x" },
            unlocked() {return hasUpgrade("aperdinal",41)},

            
        },
        43: {
            title: "Chilli Rating",
            description: 'Apotheic Mastery gain is raised 1.75.',
            
            cost: new Decimal(15),
            currencyDisplayName: "tSP",
            currencyInternalName: "tSP",
            currencyLayer: "aperdinal",
            
            unlocked() {return hasUpgrade("aperdinal",42)},

            
        },
        44: {
            title: "Frostbite",
            description: 'Unlock Ultrasede. Apotheic Points multiply their own gain (after softcap).',
            
            cost: new Decimal(20),
            currencyDisplayName: "tSP",
            currencyInternalName: "tSP",
            currencyLayer: "aperdinal",
            effect() {           
                let eff = player.aP.points.plus(1).pow(0.003)
  if (hasUpgrade("aperdinal",71)) eff = eff.times(upgradeEffect("aperdinal",71))

                return eff;
            },
            effectDisplay() { return format(tmp.aperdinal.upgrades[44].effect)+"x" },
            unlocked() {return hasUpgrade("aperdinal",43)},

            
        },
        45: {
            title: "Glacial Frosties",
            description: 'tSP multiply Nursery Points gain.',
            
            cost: new Decimal(25),
            currencyDisplayName: "tSP",
            currencyInternalName: "tSP",
            currencyLayer: "aperdinal",
            effect() {           
                let eff = player.aperdinal.tSP.plus(1).pow(0.08)


                return eff;
            },
            effectDisplay() { return format(tmp.aperdinal.upgrades[45].effect)+"x" },
            unlocked() {return hasUpgrade("aperdinal",44)},

            
        },
        46: {
            title: "Ice Spice",
            description: "Chilli Rating's effect is multiplied by Apotheic Dimensions. Apotheic Dimensions gain is multiplied by 26,000x.",
            
            cost: new Decimal(30),
            currencyDisplayName: "tSP",
            currencyInternalName: "tSP",
            currencyLayer: "aperdinal",
            effect() {           
                let eff = player.aD.points.plus(1).pow(0.01)


                return eff;
            },
            effectDisplay() { return format(tmp.aperdinal.upgrades[46].effect)+"x" },
            unlocked() {return hasUpgrade("aperdinal",45)},

            
        },
        47: {
            title: "Smite Virtutis",
            description: "Unlock Supremesede. Apotheic Dimensions multiply Cheapcap Power.",
            
            cost: new Decimal(35),
            currencyDisplayName: "tSP",
            currencyInternalName: "tSP",
            currencyLayer: "aperdinal",
            effect() {           
                let eff = player.aD.points.plus(1).pow(0.01)


                return eff;
            },
            effectDisplay() { return format(tmp.aperdinal.upgrades[47].effect)+"x" },
            unlocked() {return hasUpgrade("aperdinal",46)},

            
        },
        51: {
            title: "Poorcap",
            description: "Nursery Points is multiplied by your Production of Axis.",
            
            cost: new Decimal(4),
            currencyDisplayName: "tBP",
            currencyInternalName: "tBP",
            currencyLayer: "aperdinal",
            effect() {           
                let eff = tmp.s.axisProduction.plus(1).pow(0.0275)


                return eff;
            },
            effectDisplay() { return format(tmp.aperdinal.upgrades[51].effect)+"x" },
            unlocked() {return hasUpgrade("aperdinal",47)},

            
        },
        52: {
            title: "Richcap",
            description: "Nursery Points multiply Aperdinalities gain.",
            
            cost: new Decimal(15),
            currencyDisplayName: "tBP",
            currencyInternalName: "tBP",
            currencyLayer: "aperdinal",
            effect() {           
                let eff = player.n.points.plus(1).pow(0.08)


                return eff;
            },
            effectDisplay() { return format(tmp.aperdinal.upgrades[52].effect)+"x" },
            unlocked() {return hasUpgrade("aperdinal",51)},

            
        },
        53: {
            title: "Buff(alo)-less (<s>64</s> 4 layers tree reference?!)",
            description: "XP gain is multiplied by your Nursery Points and buffed by tBP",
            
            cost: new Decimal(30),
            currencyDisplayName: "tBP",
            currencyInternalName: "tBP",
            currencyLayer: "aperdinal",
            effect() {           
                let eff = player.n.points.plus(1).pow(0.005).times(player.aperdinal.tBP.add(1).pow(0.15))


                return eff;
            },
            effectDisplay() { return format(tmp.aperdinal.upgrades[53].effect)+"x" },
            unlocked() {return hasUpgrade("aperdinal",52)},

            
        },
        54: {
            title: "Major Tacticals",
            description: "XP gain is raised ^2.5, tBP gain is multiplied by your tSP. Gain tSP outside of Tactic Searching.",
            
            cost: new Decimal(40),
            currencyDisplayName: "tBP",
            currencyInternalName: "tBP",
            currencyLayer: "aperdinal",
            effect() {           
                let eff = player.aperdinal.tSP.add(1).pow(0.35)


                return eff;
            },
            effectDisplay() { return format(tmp.aperdinal.upgrades[54].effect)+"x" },
            unlocked() {return hasUpgrade("aperdinal",53)},

            
        },
        55: {
            title: "Agitation Frostbite",
            description: "'Sede' buyable is now 'Seded'. Apotheic Mastery gain is multiplied by 1000.",
            
            cost: new Decimal(100),
            currencyDisplayName: "tBP",
            currencyInternalName: "tBP",
            currencyLayer: "aperdinal",
          
            unlocked() {return hasUpgrade("aperdinal",54)},

            
        },
        56: {
            title: "Ice Chills",
            description: "Multiply the hardcap of Apotheic Mastery by 1,000,000x.",
            
            cost: new Decimal(150),
            currencyDisplayName: "tBP",
            currencyInternalName: "tBP",
            currencyLayer: "aperdinal",
          
            unlocked() {return hasUpgrade("aperdinal",55)},

            
        },
        57: {
            title: "Aperdinalities of Nothing",
            description: "Dolphin's Wrath hardcap starts ^3 later. Unlock Cheapcap II (buyable)",
            
            cost: new Decimal(175),
            currencyDisplayName: "tBP",
            currencyInternalName: "tBP",
            currencyLayer: "aperdinal",
          
            unlocked() {return hasUpgrade("aperdinal",56)},

            
        },
        61: {
            title: "Boosting Exponential",
            description: "Start gaining Exponent Points. Aperdinalities gain is multiplied by 1e12.",
            
            cost: new Decimal(1),
            currencyDisplayName: "exponent coins",
            currencyInternalName: "exponentCoins",
            currencyLayer: "aperdinal",
          
            unlocked() {return hasUpgrade("aperdinal",57)},

            
        },
        62: {
            title: "Possible Trees",
            description: "Exponent Coins multiply Aperdinal gain (after softcap).",
            
            cost: new Decimal(2),
            currencyDisplayName: "exponent coins",
            currencyInternalName: "exponentCoins",
            currencyLayer: "aperdinal",
            effect() {           
                let eff = player.aperdinal.exponentCoins.add(1).pow(0.1)


                return eff;
            },
            effectDisplay() { return format(tmp.aperdinal.upgrades[62].effect)+"x" },
            unlocked() {return hasUpgrade("aperdinal",61)},

            
        },
        63: {
            title: "Paying Taxes",
            description: "Exponent Points multiply Aperdinal gain (after softcap).",
            
            cost: new Decimal(5),
            currencyDisplayName: "exponent coins",
            currencyInternalName: "exponentCoins",
            currencyLayer: "aperdinal",
            effect() {           
                let eff = player.aperdinal.exponentPoints.add(1).pow(0.05)


                return eff;
            },
            effectDisplay() { return format(tmp.aperdinal.upgrades[63].effect)+"x" },
            unlocked() {return hasUpgrade("aperdinal",62)},

            
        },
        64: {
            title: "Eternalized Exponent",
            description: "Exponent Coins multiply Exponent Points gain.",
            
            cost: new Decimal(8),
            currencyDisplayName: "exponent coins",
            currencyInternalName: "exponentCoins",
            currencyLayer: "aperdinal",
            effect() {           
                let eff = player.aperdinal.exponentCoins.add(1).pow(0.28)


                return eff;
            },
            effectDisplay() { return format(tmp.aperdinal.upgrades[64].effect)+"x" },
            unlocked() {return hasUpgrade("aperdinal",63)},

            
        },
        65: {
            title: "Aperdinal Exponent",
            description: "Aperdinalities multiply Exponent Coins gain.",
            
            cost: new Decimal(12),
            currencyDisplayName: "exponent coins",
            currencyInternalName: "exponentCoins",
            currencyLayer: "aperdinal",
            effect() {           
                let eff = player.aperdinal.points.add(1).pow(0.0095)


                return eff;
            },
            effectDisplay() { return format(tmp.aperdinal.upgrades[65].effect)+"x" },
            unlocked() {return hasUpgrade("aperdinal",64)},

            
        },
        66: {
            title: "Nursery Aperdinals",
            description: "Nursery Points multiply Aperdinal gain (after softcap).",
            
            cost: new Decimal(15),
            currencyDisplayName: "exponent coins",
            currencyInternalName: "exponentCoins",
            currencyLayer: "aperdinal",
            effect() {           
                let eff = player.n.points.add(1).pow(0.00175)


                return eff;
            },
            effectDisplay() { return format(tmp.aperdinal.upgrades[66].effect)+"x" },
            unlocked() {return hasUpgrade("aperdinal",65)},

            
        },
        67: {
            title: "Nursery-eries",
            description: "Nursery Points gain is raised ^1.5. Production of Axis multiplies Exponent Points gain.",
            
            cost: new Decimal(20),
            currencyDisplayName: "exponent coins",
            currencyInternalName: "exponentCoins",
            currencyLayer: "aperdinal",
            effect() {           
                let eff = tmp.s.axisProduction.add(1).pow(0.005)


                return eff;
            },
            effectDisplay() { return format(tmp.aperdinal.upgrades[67].effect)+"x" },
            unlocked() {return hasUpgrade("aperdinal",66)},

            
        },
        71: {
            title: "Exponential Frostbite",
            description: "Frostbite's effect multiply their own effect.",
            
            cost: new Decimal(80),
            currencyDisplayName: "exponent coins",
            currencyInternalName: "exponentCoins",
            currencyLayer: "aperdinal",
            effect() {           
                let eff = tmp.aperdinal.upgrades[44].effect.add(1).pow(0.05)
 if (hasUpgrade("aperdinal",75)) eff = eff.times(tmp.aperdinal.buyables[21].effect.first)

                return eff;
            },
            effectDisplay() { return format(tmp.aperdinal.upgrades[71].effect)+"x" },
            unlocked() {return hasUpgrade("aperdinal",67)},

            
        },
        72: {
            title: "Nursery Doppelgänger",
            description: "Exponent Points gain is cubed.",
            
            cost: new Decimal(125),
            currencyDisplayName: "exponent coins",
            currencyInternalName: "exponentCoins",
            currencyLayer: "aperdinal",
          
            unlocked() {return hasUpgrade("aperdinal",71)},

            
        },
        73: {
            title: "Exponent Doppelgänger",
            description: "Exponent Coin gain is cubed.",
            
            cost: new Decimal(150),
            currencyDisplayName: "exponent coins",
            currencyInternalName: "exponentCoins",
            currencyLayer: "aperdinal",
          
            unlocked() {return hasUpgrade("aperdinal",72)},

            
        },
        74: {
            title: "Brave Frostbite",
            description: "Gain 100% of Exponent Coins per second.",
            
            cost: new Decimal(4000),
            currencyDisplayName: "exponent coins",
            currencyInternalName: "exponentCoins",
            currencyLayer: "aperdinal",
          
            unlocked() {return hasUpgrade("aperdinal",73)},

            
        },
        75: {
            title: "Orbitation of Orbs",
            description: "Unlock Orbs.",
            
            cost: new Decimal(1e5),
            currencyDisplayName: "exponent points",
            currencyInternalName: "exponentPoints",
            currencyLayer: "aperdinal",
          
            unlocked() {return hasUpgrade("aperdinal",74)},

            
        },
        76: {
            title: "Vitamin Connectors",
            description: "Exponent Coins gain is squared.",
            
            cost: new Decimal(2.5e6),
            currencyDisplayName: "exponent points",
            currencyInternalName: "exponentPoints",
            currencyLayer: "aperdinal",
          
            unlocked() {return hasUpgrade("aperdinal",75)||player.aperdinal.orbs.gte(8)},

            
        },
        77: {
            title: "Poached Squares",
            description: "Unlock Poachers. You can purchase Square-Up 1 more time.",
            
            cost: new Decimal(1e46),
            currencyDisplayName: "exponent coins",
            currencyInternalName: "exponentCoins",
            currencyLayer: "aperdinal",
          
            unlocked() {return hasUpgrade("aperdinal",76)||player.aperdinal.orbs.gte(16)},

            
        },
        81: {
            title: "Hypnosis",
            description: "Exponent Coin gain*150",
            
            cost: new Decimal(1),
            currencyDisplayName: "poachers",
            currencyInternalName: "poachers",
            currencyLayer: "aperdinal",
          
            unlocked() {return hasUpgrade("aperdinal",77)},

            
        },
        82: {
            title: "Hypnoic Power",
            description: "You can purchase 1 more Square-up.",
            
            cost: new Decimal(35),
            currencyDisplayName: "poachers",
            currencyInternalName: "poachers",
            currencyLayer: "aperdinal",
            
            unlocked() {return hasUpgrade("aperdinal",81)},

            
        },
        83: {
            title: "Extensive Tortoiches",
            description: "Poachers gain is multiplied by 1.5, Gain ^1.85 more Exponent Coins.",
            
            cost: new Decimal(60),
            currencyDisplayName: "poachers",
            currencyInternalName: "poachers",
            currencyLayer: "aperdinal",
            
            unlocked() {return hasUpgrade("aperdinal",82)},

            
        },
        84: {
            title: "Powerpuff Poachers",
            description: "Iron multiply Stabs gain.",
            
            cost: new Decimal(2.5e5),
            currencyDisplayName: "poachers",
            currencyInternalName: "poachers",
            currencyLayer: "aperdinal",
            effect() {           
                let eff = player.ir.points.add(1).pow(0.5)


                return eff;
            },
            effectDisplay() { return format(tmp.aperdinal.upgrades[84].effect)+"x" },
            unlocked() {return hasUpgrade("aperdinal",83)},

            
        },
        85: {
            title: "Omega Beano",
            description: "Points gain is raised ^1.01.",
            
            cost: new Decimal(1e6),
            currencyDisplayName: "poachers",
            currencyInternalName: "poachers",
            currencyLayer: "aperdinal",
         
            unlocked() {return hasUpgrade("aperdinal",84)},

            
        },
        86: {
            title: "Remastered Extense",
            description: "Apotheic Mastery cap starts ^1.5 later.",
            
            cost: new Decimal(1.5e6),
            currencyDisplayName: "poachers",
            currencyInternalName: "poachers",
            currencyLayer: "aperdinal",
         
            unlocked() {return hasUpgrade("aperdinal",85)},

            
        },
        87: {
            title: "Exotic Aeons",
            description: "Multiply all Tactic gain by 1e7.",
            
            cost: new Decimal(1.5e6),
            currencyDisplayName: "poachers",
            currencyInternalName: "poachers",
            currencyLayer: "aperdinal",
         
            unlocked() {return hasUpgrade("aperdinal",86)&&getBuyableAmount("aperdinal",51).gte(3)},

            
        },
    },
    tooltip() { // Optional, tooltip displays when the layer is unlocked
        let tooltip = formatWhole(player[this.layer].points) + " " + this.resource
        if (hasAchievement("ach",111)) tooltip += "<small><i><br>" + formatWhole(player.aperdinal.exponentCoins) + " Exponent Coins</i></small>"
        if (hasUpgrade("aperdinal",74)) tooltip += "<small><i><br>" + formatWhole(player.aperdinal.orbs) + " Orbs</i></small>"
        if (hasUpgrade("aperdinal",77)) tooltip += "<small><i><br>" + formatWhole(player.aperdinal.poachers) + " Poachers</i></small>"
        return tooltip
    },
    milestones: {
        0: {
            requirementDescription: "1 Total Aperdinalities",
            effectDescription: "Points gain is raised ^1.15, Sessions gain is raised ^1.1, but you will lose access to Apotheic Boosters and Time",
            done() { return player.aperdinal.total.gte(1) },

        },
        1: {
            requirementDescription: "10 Total Aperdinalities",
            effectDescription: "Global speed is multiplied by 1.1.",
            done() { return player.aperdinal.total.gte(10) },

        },
        2: {
            requirementDescription: "300 Total Aperdinalities",
            effectDescription: "Unlock Aperdinal Upgrades.",
            done() { return player.aperdinal.total.gte(300) },
         unlocked() {return hasMilestone("aperdinal",1)}
        },
        3: {
            requirementDescription: "500 Total Aperdinalities",
            effectDescription: "Aperdinal Gain is doubled.",
            done() { return player.aperdinal.total.gte(500) },
            unlocked() {return hasMilestone("aperdinal",2)}
        },
        4: {
            requirementDescription: "3,000 Aperdinalities",
            effectDescription: "Apeoblabla Points is raised ^1.15, and gain 5 times more Aperdinalities.",
            done() { return player.aperdinal.points.gte(3000) },
            unlocked() {return hasMilestone("aperdinal",3)}
        },
        5: {
            requirementDescription: "25,000 Aperdinalities",
            effectDescription: "Aperdinality gain is decupled.",
            done() { return player.aperdinal.points.gte(25000) },
            unlocked() {return hasMilestone("aperdinal",4)}
        },
        6: {
            requirementDescription: "300,000 Aperdinalities",
            effectDescription: "Apotheic Dimension gain is squared.",
            done() { return player.aperdinal.points.gte(3e5) },
            unlocked() {return hasMilestone("aperdinal",5)}
        },
        7: {
            requirementDescription: "700,000 Total Aperdinalities",
            effect() {
                let eff = player.aperdinal.points.plus(1).pow(0.08)
                return eff
            },
            effectDescription() {
                return "Aperdinalities multiply their own gain.<br>Currently: "+format(milestoneEffect("aperdinal",7))+"x"},
            done() { return player.aperdinal.total.gte(7e5) },
            unlocked() {return hasMilestone("aperdinal",6)}
        },
        8: {
            requirementDescription: "7,350,000 Total Aperdinalities",
           
            effectDescription: "Stab Point effect is subtracted by 0.04.",
            done() { return player.aperdinal.total.gte(7.35e6) },
            unlocked() {return hasMilestone("aperdinal",7)}
        },
        9: {
            requirementDescription: "14,700,000 Total Aperdinalities",
           
            effectDescription: "Aperdinality Gain is multiplied by 8.",
            done() { return player.aperdinal.total.gte(1.47e7) },
            unlocked() {return hasMilestone("aperdinal",8)}
        },
        10: {
            requirementDescription: "1.5e11 Total Aperdinalities",
           
            effectDescription: "Points gain is hatsuned to 1.001.",
            done() { return player.aperdinal.total.gte(1.5e11) },
            unlocked() {return hasMilestone("aperdinal",9)}
        },
       
    },
    doReset(resettingLayer) {
        let keep = [];
    
        if (player.ab.unlocked) keep.push("upgrades")
        if (player.ab.unlocked) keep.push("milestones")
        if (player.ab.unlocked) keep.push("buyables")
        if (layers[resettingLayer].row > this.row) layerDataReset("aperdinal", keep)
    },
 
})
addLayer("aB2", {
    name: "apothetic boosters", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "aB", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#5D46E4",
    nodeStyle() {return {
			"background": (((player.aB2.unlocked||canReset("aB2"))))?((player.grad)?"radial-gradient(#8046E4, #234EE4)":"#D174E4"):"#bf8f8f" ,
        }},
		componentStyles: {
			"prestige-button"() {return { "background": (canReset("aB2"))?((player.grad)?"radial-gradient(#8046E4, #234EE4)":"#D174E4"):"#bf8f8f" }},
		},
    requires: new Decimal("1e11715"), // Can be a function that takes requirement increases into account
    resource: "apothetic boosters", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent() {let baseExp = new Decimal(3)
    if (player.aB2.points.gte(9)) baseExp = baseExp.add(player.aB2.points).div(3.5)
        return baseExp;   
    }, // Prestige currency exponent
    base: 999,
    gainMult() { // Calculate the multiplier for main currency from bonuses




       
        mult = new Decimal(1)

        return mult
    },
    autoUpgrade() {return hasUpgrade("aD",14)&&!hasMilestone("aperdinal",0)},
    gainExp() { // Calculate the exponent on main currency from bonuses
   
       
        let exp = new Decimal(1)
      
       
        return exp;
    },
    resetsNothing() {return hasMilestone("aperdinal",1)},

branches: ["aP"],

    softcap: new Decimal(1e20),
    softcapPower() {let power = new Decimal(0.333)
        
        return power;
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {
            key:"ctrl+m", description: "Ctrl+M: Reset for apotheic mastery points", onPress() {
                if ((canReset(this.layer)&&player.ab.unlocked)&&!hasMilestone("aperdinal",0))
                    doReset(this.layer)
            }
        },
    ],
  
    onPrestige() {return player.m.points = new Decimal(0),
        player.s.points = new Decimal(0),
    player.aP.upgrades = []},
    layerShown(){return (player.aN.tree == "apo"&&getBuyableAmount("ab",11).gte(2))&&!hasMilestone("aperdinal",0)},
    tabFormat: {
        "Main": {
            buttonStyle() { return {'background-color': '#5D46E4'} },
            content: ["main-display",
            "prestige-button",
            "resource-display", "blank",
           
            "upgrades",
           
            "blank",
        ]},
       

    
    },
   
    effectDescription() {
        return "which are boosting normal Axis Production and Apeoblabla Points by "+format(tmp.aB2.effect)+"x."
    },
    
    addToBase() {
        let base = new Decimal(0);
    
        return base;
    },
   
    effectBase() {
        let base = new Decimal(3);
        
        // ADD
        base = base.plus(tmp.aB2.addToBase);
        
        // MULTIPLY
      
        
        return base.pow(tmp.aB2.power);
    },
    power() {
        let power = new Decimal(1);
     
        return power;
    },
    

    effect() {
        return Decimal.pow(tmp.aB2.effectBase, player.aB2.points.plus()).max(1).times(1);
    },
    upgrades: {
			
        11: {
            title: "Booster<sup>Booster</sup>",
            description: "Multi Points multiply Apothetic Mastery gain.",
            cost: new Decimal(2),
            effect() {
                
              
                let eff = player.m.points.plus(1).pow(0.000025)
        
               
                return eff;
            },
   
        
            
            
           effectDisplay() { return format(tmp.aB2.upgrades[11].effect)+"x" },
            
        },	
      
     
    },
    doReset(resettingLayer) {
        let keep = [];
    
        if (player.ab.unlocked) keep.push("upgrades")
        if (player.ab.unlocked) keep.push("buyables")
        if (layers[resettingLayer].row > this.row) layerDataReset("aB2", keep)
    },
 
})

addLayer("aD", {
    name: "apothetic dimensions", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "aD", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        nachoFed: new Decimal(0),
    }},
    color: "aqua",
  
   exponent: 0.5,
    baseResource: "apothetic mastery",
    resource: "apothetic dimensions",
    requires: new Decimal(1e10), // Can be a function that takes requirement increases into account
    baseAmount() {return player.aM.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
  
    gainMult() { // Calculate the multiplier for main currency from bonuses




       
        mult = new Decimal(1)
        if (hasUpgrade("aD",27)) mult = mult.times(tmp.aP.buyables[13].effect.first)
     if (hasUpgrade("aD",21)) mult = mult.times(upgradeEffect("aD",21))
     if (hasUpgrade("aD",23)) mult = mult.times(8)
     if (hasUpgrade("aD",24)) mult = mult.times(upgradeEffect("aD",24))
     if (getBuyableAmount("ab",11).gte(4)) mult = mult.times(tmp.aT.effect)
     if (hasMilestone("aperdinal",6)) mult = mult.pow(2)
     if (hasUpgrade("aperdinal",46)) mult = mult.times(26000)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
   
       
        let exp = new Decimal(1)
      
       
        return exp;
    },

branches: ["aB2"],

    softcap: new Decimal(1e20),
    softcapPower() {let power = new Decimal(0.333)
        
        return power;
    },
    row: 2, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {
            key:"ctrl+d", description: "Ctrl+D: Reset for apotheic dimensions", onPress() {
                if (canReset(this.layer)&&player.ab.unlocked)
                    doReset(this.layer)
            }
        },
    ],
    update(diff) {
      
        if (hasUpgrade("aperdinal", 21)) {
          
            if (layers.aD.clickables[12].canClick()) layers.aD.clickables[12].onClick();
         
        }
    
      },
    onPrestige() {return player.m.points = new Decimal(0),
        player.s.points = new Decimal(0),
    player.aP.upgrades = [],
    player.aM.upgrades = [],

    player.aB2.upgrades = []},
    layerShown(){return player.aN.tree == "apo"&&getBuyableAmount("ab",11).gte(3)},
    tabFormat: {
        "Main": {
            buttonStyle() { return {'background-color': 'aqua'} },
            content: ["main-display",
            "prestige-button",
            "resource-display", "blank",
           
            "upgrades",
           
            "blank",
        ]},
        "Nacho Intubatiers": {
            buttonStyle() { return {'background-color': 'orange','border-color': 'orange'} },
            unlocked() { return hasUpgrade("aD",22) },
            content: ["main-display",
            "prestige-button",
            "resource-display", "blank",
            ["display-text", () =>   '<img src="/NACHO NEEDED.png" style="width:25%; height:25%">'],
            "blank",
            ["display-text", () =>   "Oh no! This tank needs nachos as its mouth is sad! Feed him some nachos! (Willy from Exponent Tree reference?!)"],
            "clickables",
            ["display-text",
            function() {return 'You fed him with a total of '+formatWhole(player.aD.nachoFed)+' nachos.'},
                {}],
            "blank",
        ]},
       

    
    },
    clickables: {
      
        11: {
            title: "Feed him with 1 Nacho",
            display() { return "Req: 1 Apothetic Dimension"},
            unlocked() { return hasUpgrade("aD",22) },
            canClick() { return hasUpgrade("aD",22) && player.aD.points.gt(0) },
            onClick() { 
                player.aD.nachoFed = player.aD.nachoFed.plus(1);
              if (!hasUpgrade("aperdinal",21))  player.aD.points = player.aD.points.minus(1);
            },
            style: {width: "160px", height: "160px",background:"orange",},
        },
        12: {
            title: "Feed him with all of your Nachoes",
            display() { return "Req: 1 Apothetic Dimension"},
            unlocked() { return hasUpgrade("aD",22) },
            canClick() { return hasUpgrade("aD",22) && player.aD.points.gt(0) },
            onClick() { 
                player.aD.nachoFed = player.aD.nachoFed.plus(player.aD.points);
                if (!hasUpgrade("aperdinal",21))   player.aD.points = new Decimal(0)
            },
            style: {width: "160px", height: "160px",background:"orange",},
        },
    
    },
    passiveGeneration() { return (hasUpgrade("aD", 16))?0.15:0 },
    upgrades: {
			
        11: {
            title: "Panko Desire",
            description: "Apeoblabla Points exponent+0.04",
            cost: new Decimal(1),
           
            
        },	
      	
        12: {
            title: "Tetracore",
            description: "Gain 100% of Apothetic Points per second, Full Power effect is 5% stronger.",
            cost: new Decimal(1),
           unlocked() {return hasUpgrade("aD",11)}
            
        },	
        13: {
            title: "Ignotus",
            description: "Apothetic Mastery gain is raised ^1.4, and Therapy Sessions cost are divided by 1e16 and divides your Sessions by its cost req.",
            cost: new Decimal(8),
           unlocked() {return hasUpgrade("aD",12)},
           effectDisplay() { return "On Unalive: /"+format(tmp.s.clickables[11].cost)},
        },	
        14: {
            title: "Ethica Hacking",
            description: "Therapy Sessions cost is raised ^0.25, Apotheic Mastery gain is raised by another ^1.2, and automatically get Apothetic Points, Apothetic Mastery and Apotheic Boosters upgrade.",
            cost: new Decimal(16),
           unlocked() {return hasUpgrade("aD",13)},
  
        },	
        15: {
            title: "Breviceps macrops<br><small><small>Scientific name for Desert Rain Frog (one of the cutest frogs in world)</small></small>",
            description: "Apothetic Mastery exponent is added by 0.25.",
            cost: new Decimal(16),
           unlocked() {return hasUpgrade("aD",14)},
  
        },	
        16: {
            title: "Aperdinal Dominium Glaive",
            description: "Gain 15% of Apotheic Dimensions per second.",
            cost: new Decimal(36),
           unlocked() {return hasUpgrade("aD",15)},
  
        },	
        17: {
            title: "Glazed Stupe",
            description: "Apotheic Dimensions multiply the gain of Apothetic layers row above it (excluding for Boosters)",
            cost: new Decimal(1e5),
           unlocked() {return hasUpgrade("aD",16)},
           effect() {
                
              
            let eff = player.aD.points.plus(1).pow(0.1006)
    if (hasUpgrade("aD",27)) eff = eff.times(tmp.aP.buyables[13].effect.first)
           
            return eff;
        },

    
        
        
       effectDisplay() { return format(tmp.aD.upgrades[17].effect)+"x" },
        

        },	
        21: {
            title: "ʎɹǝʌoɔsıᗡ ʇɐǝɹ⅁ ∀",
            description: "˙pǝsɐǝlǝɹ uoʎ sɓuos ʎuɐɯ ʍoɥ ʎq uıɐɓ ǝʇou ɹuoʎ ʇsooq uoʎ splǝɥ oslɐ uʞıW ǝuusʇɐH ˙ʎlǝʌıl ǝɹoɯ lǝǝɟ sɓuos ɹuoʎ plǝɥ oʇ ,uʞıW ǝuusʇɐH ,pıolɐɔoʌ uʍouʞ ʇsoɯ ǝɥʇ pǝsu puɐ ,pıolɐɔoΛ pǝɹǝʌoɔsıp uo⅄",
            cost: new Decimal(1e6),
           unlocked() {return hasUpgrade("aD",17)},
           effect() {
                
              
            let eff = player.aM.points.plus(1).pow(0.09)
    
           
            return eff;
        },

    
        
        
       effectDisplay() { return format(tmp.aD.upgrades[21].effect)+"x" },
        

        },	
        22: {
            title: "Armageddon",
            description: "𝓤𝓷𝓵𝓸𝓬𝓴 𝓝𝓪𝓬𝓱𝓸 𝓘𝓷𝓽𝓾𝓫𝓪𝓽𝓲𝓮𝓻𝓼",
            cost: new Decimal(5e8),
           unlocked() {return hasUpgrade("aD",21)},

        

        },	
        23: {
            title: "Nacho F̶́̾̍̿̈́̆̽͗̒̐͘͝͝ͅa̴̻͎̰͕̣̠͖̳̯͓̙̒̉͋͂̎͒̃̋̕͘̕i̸̛̻͉̣̭̰͉̙̬̦͖͚͌̍́̿̋̇̆͂̕͝l̴̪̺̳͇̝̪͕͌̿̾̋ų̴̯̙̟͎̆ṟ̴̡͚̦̳̭̒̑̊̔̀͆̕ę̸̮̼͙͎̫͖̰͉̥͍͓̥̜́̔",
            description: "Ą̶̜͓̖̈́͊̊̌̍͗̔̊͆͆́͘p̵̢̢̤̣̺̼̟̫̈̽̋̔͊ͅo̸̝̙̘͓̳̗̪͕̙͍̪̽́͆͛̓̾̓̌̓̽̕͜͝͝͝ę̶̮͖̤͚̩̮̠̹͋̀̐̌͑̌̏̔̏̌͛͆̀̕͜b̴͈̝̲̹͔̌̈͒̾͝͝͠l̵͈͕̤͍̐͗͂̾͂̄̚͠͝ả̴̧̨̖̰̩̲̭̘̦̫̣̮̈́͌͗͐̏̋̃͝ͅb̴̨̢̭̦̟̥̘̰̅̋̊̏̾̕͠l̷̨͉̭̲͖͙̤͓̋̿͊̒͊a̸͚̗͎͇̓͛̀̍̄́̔͗̿ ̴̘̪̺̭̻̮͇̜̯̍͊P̵̣͚͍̺̼̟̣͇̪̻͆̄̋͗͆̐̓̄̌̒͐͝ǫ̶͛ī̷̩͙̻͚͔͙͙̮͍͔̣̥̣͕̔̽̓̇͐̽̈̎̀̈́͝͝ͅn̸̢̫͙͊́͋̉̊͑͠t̵͓̖̩̓̐͆̆͛̔̇̎̆͂͌̊̆̚͘s̷̛̞̔͌̃ ̷̣͔̞͕̞͔̇̌́͘͘̚ĝ̸̠̩̠̜̻͔̇̓̍̐̉a̶̡̧͔͉̭͎͎͙̼͍͈̥̻̦̯̽̄͋̈́͝i̶̢̜̺̥̎͋̌̓͜n̵̨̛̯̩̬͋̈́ ̵̡̙͕̪͙̳̼̜̲͍̈́́̍̑̊́̀͜͜ͅi̴̱̼̺̩͍̟͛̔̓͛͑̒͝ͅs̷̨̥̬̺̣̻̦̻̭̬̙̖̅́̈̈́̈́͆͌̃̕ͅ ̷̠̼͈̥̖̰͙̻͗̔̒̏̈́̚ͅm̶̗̹̩̺̪͇̝̰̅̍̃͒ứ̶̼̑͒̇̌̑̚̚͝ļ̸̢̨̫͓̘̬̙̝́̌t̶͔̺͉̭̹̍͑͛̄͆̚͠î̴͚̯̻̱͉̥̄͛͛̒̒ͅp̴̤̰͓̳͙͕͕̟̅͒̈̒͌͘͝l̶̢̞̤̲͘ḭ̴̛̝̣̤͉͙͕̞̩̽̄͂̋̒̎̇̀̓͛͛̂͝͝e̵̻̬̩̟̜͖̝̘̔̓̏͜͝͝d̷̢̳̼̯̹̥̦̟̥̦̯̰͖̯̈́̉̔̒͑͌̇̾̓͐͐͝͝ ̷̨̢̲͇̲̺̠̣̯̪̭̅̂͋͗̿͋̓̓͒̒b̶̭͍̩̐͋̈͠͝ͅý̸̨̠͖̹̗͕̰̟̭̹̫̥̾̋̈́͛̀̏̀̔̐̍ ̶̡̰̥̣͙̀̆̌͗̊̇y̷̨̛͔̝͋̊̅̃̎̔̐̚ͅö̴̻̞͙̣̬͓̩̲͛̔͑͠ừ̴̡̪̭̤̥͉̜͉̜͕̩̜̫͕̞̓̔̅̇͌̎̀̐̈́̕͝͝ṟ̵̛͕̙̜̙͎̗̍͊̈̏̌̔͑̅̍̕͝͝͠ͅ ̸̨͚̟̻̺̖̩̦̥̱̼̬̮̥͇͑̾̂A̶̞͚͈͖̾̀͐́͋͑̊̽̈́̄̅͘͝͝p̵̨̛̩̬̼̤̏̽̒̇͐͂̂͒̀̄̕ͅo̷̹̪͇͒t̸̡̠̮̩̫̰͉͈͔̣͓̲̙͍̄̅̆̂̈́̓h̶͓̻̱͕̬̤̏͊́̇̂e̶̦̠̝̪͕̳̖̩̖̓̈͜͝t̸͍͖͓̊̋̋͐̒̋͑̚͜ǐ̵̛͎̙̯͈͇̙̗̣̜̇́́͂̎͌̅̉ç̸̛̫͓͕̆̓̒̿̊̋̔̒ ̸̢̧̹͙̄B̴͍̬̱̯̤͍̱̩̦͙̺̎̿͒̑̄͂͌̄͘͝ͅͅơ̴̡̧̥̩̫̩̗̥̘̠̲̐̓̋͆́͒͋̑͑̚ó̵̪̔͒̓͌̀̏s̸̝̩̪̜͔̠̝̳͌̿̍̿̍ͅṯ̸͉̯̪̍̈́̊̆̒̌́͠é̵͎͇̠̻̺̖͊̈́̈̀̾̈̄͑̄͆̚̕r̵̡̳͙̲̲̜͈̣̔̆͐̀s̶̩͔̳͉̝̻͎̦̙̜͍̠͑̐͜͜ͅ,̷̡̨̬̖̺̖̯̻̜͌̎̋̇͛̊̑̉͘͠ ̸̛̛͍͎̺͉̩̤̬̣̰̞͔͂̑̽͌̂̓͠ą̵̞̩͖̗̻̰̟̹̬̬̪͖̜̒̈́̆̃͠ņ̴̱̥̳̤͖͉̻̲̯̘͝d̴̨̦̥̬̰́̋ ̴̡̡̰͇̯͇̤͙͇̹̰̟̗̃́͂͛̒͆́̃̈̔̾̏͗͒͝ͅḿ̵̢̧̛̛͙͕̟̘̣̰͕̫̼̙͈̠̲̄̀̿̽̈́̄̃͘̕͝ư̴̢͙̬̺̣̯̻̗̰̮͖͊͊̇͛͌͂͠ͅḽ̸̦̤̱̹͎̖̖̫̪͍͗̉t̴̡̞̥̠̣͖̟̪͙̣̱̜́̒̈́͒̓̎͜͠ͅi̶̛͈͓͚̯̹̮̱̘͓̅̆̈͑̀p̶̧̲͎͉̺̗̰̠̟̘̗̮̮͛̐̑̍̒͂͐͗̚͜͜͝͝l̵̨̧̙̗̣͉̲̜̲̞̒̐̔͜ŷ̷̢̳̣̞̪̞̼͇̜͓̠̦̜͇͎̒̅̔̋͗̏̍̓̉͝ ̷̨̛͈̼͔͎̃̽̈̐̏͂̒̄A̶̡̳̝̱̬͍̞͝p̸͔̬͍̜͉͕͇̈́ͅo̵̱̗̅̅͑ͅt̶̢̞̝̮̻̉̎͑̑̌͛̿͒͐̓̀̕̕͜h̵̡̞̠̫̭͍̯̮̱̻̜̏̈͆̾̽̅͜e̷̝̍̍̉̈́́͒̑̔̃̕͘͝ì̵̡̝̜̥̥̳̘̗͓̙̗̤̤̩c̶̡̧̡̭̠͉͉͎̙̘͈̮̜̯̈́͋̀͂̎̆̽̂̽̆͑̊͗͠͝ ̶̢̫̠̪͈̰͕̽̑Ḑ̴̨̨̧̢̛͕̭̳͔͇̜̱̙̦̀̐̃͊̃ͅỉ̶̧̩̩̊́̆͆͑͊̒͆ṃ̴̨̻̜̟͇̺̳͖̪̤̒́̏͜͠e̴͈̘̲̞̼͎̝̥̱̣̣͜͠͝n̶̥̼͉͚͈̜̗͔̣̤̦̟̂̄̒̀̎̈́͒͂̋̕͠s̶̡͔̺̦͂̊́͋̒͊͂͛ỉ̴̢̡̤̘͋̌͝ͅò̸̖̳̼̬̻̼̟̪̖̬̮̯̮͜n̷̢̗̼̰̼̭̫̤̝̙̅ ̷͙̯̹̱̦̞̬̖̜͉͎̥̤̗̗̕g̷̢̡̜͖̜̻͔̱̳͈̻̤͍͂͜ͅa̸͉͈͋̑̏͑ȋ̴̧̱̘͉͓͇̬̭̬͝n̵̢̰͉̭̫̘̝̪̪̞̭̰̈́̅͜ ̶̱̜̳̜͎͕̝͎̹̓̓̇̌̂̆̈́̋͆͐̅̇͘͜͜͝ͅb̶̛̝͎̰̌̒͐̑̓͂̐̀͂̽̃̄͒y̶̮̐ ̶̰͕̺̒́̌̈̽͌̏͋8̶̢̭̖̱̤͙̞͕̭͈̠͂.̷̛̹̤͙͔̺̳̭̼̹͐̄͊͌",
            cost: new Decimal(5e9),
            currencyDisplayName: "nachos fed",
            currencyInternalName: "nachoFed",
            currencyLayer: "aD",
           unlocked() {return hasUpgrade("aD",21)},
           effect() {
                
              
            let eff = player.aB2.points.plus(1).pow(0.11)
    
           
            return eff;
        },

    
        
        
       effectDisplay() { return format(tmp.aD.upgrades[23].effect)+"x" },
        

        },	
        24: {
            title: "Distancing Nachos",
            description: "Apothetic Dimensions multiply their own gain.",
            cost: new Decimal(1e11),
           unlocked() {return hasUpgrade("aD",23)},
           effect() {
                
              
            let eff = player.aD.points.plus(1).pow(0.14)
    
           
            return eff;
        },

    
        
        
       effectDisplay() { return format(tmp.aD.upgrades[24].effect)+"x" },
        

        },	
        25: {
            title: "Non-Distancing Nachos",
            description: "Apeoblabla Points exponent+0.01. Points gain is multiplied for every OoM of Multi Points",
            cost: new Decimal(1e12),
           unlocked() {return hasUpgrade("aD",24)},
           effect() {
                
              
            let eff = player.m.points.max(1).log10().floor().add(1)
    
           
            return eff;
        },

    
        
        
       effectDisplay() { return format(tmp.aD.upgrades[25].effect)+"x" },

        },
        26: {
            title: "Brassica oleracea botrytis",
            description: "Sede effect now affects Apotheic Mastery gain.",
            cost: new Decimal(1e13),
           unlocked() {return hasUpgrade("aD",25)},
        

        },	
        27: {
            title: "Crosslayer Points",
            description: "Unlock Hypersede.",
            cost: new Decimal(1e15),
           unlocked() {return hasUpgrade("aD",26)},
        

        },	
        31: {
            title: "Decimal Goat",
            description: "Apotheic Points gain is squared.",
            cost: new Decimal(1e16),
           unlocked() {return hasUpgrade("aD",27)},
        

        },	
        32: {
            title: "Apocap",
            description: "Softcap for Apothetic Points starts later based on Points.",
            cost: new Decimal(1.6e20),
           unlocked() {return hasUpgrade("aD",31)},
           effect() {
                
              
            let eff = player.points.plus(1).pow(0.002)
    
           
            return eff;
        },

    
        
        
       effectDisplay() { return format(tmp.aD.upgrades[32].effect)+"x" },
        

        },
        33: {
            title: "Antimastery",
            description: "Points gain boost Apotheic Mastery's gain",
            cost: new Decimal(2.2e21),
           unlocked() {return hasUpgrade("aD",32)},
           effect() {
                
              
            let eff = player.points.plus(1).pow(1.2e-6)
    
           
            return eff;
        },

    
        
        
       effectDisplay() { return "^"+format(tmp.aD.upgrades[33].effect) },
        

        },	
        34: {
            title: "Antibiotics",
            description: "Points gain is raised 1.01.",
            cost: new Decimal(1e28),
           unlocked() {return hasUpgrade("aD",33)&&hasMilestone("aperdinal",2)},
           
        

        },	
     
    },
    doReset(resettingLayer) {
        let keep = [];
    
        if (player.ab.unlocked) keep.push("upgrades")
        if (player.ab.unlocked) keep.push("buyables")
        if (layers[resettingLayer].row > this.row) layerDataReset("aD", keep)
    },
 
})
addLayer("aT", {
    name: "apothetic times", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "aT", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        nachoFed: new Decimal(0),
    }},
    color: "chartreuse",
  
   exponent: 4,
   base: 300,
    baseResource: "apothetic points",
    resource: "apothetic time",
    requires: new Decimal(1e280), // Can be a function that takes requirement increases into account
    baseAmount() {return player.aP.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
  
    gainMult() { // Calculate the multiplier for main currency from bonuses




       
        mult = new Decimal(1)

   
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
   
       
        let exp = new Decimal(1)
      
       
        return exp;
    },
    resetsNothing() {return hasMilestone("aperdinal",1)},

branches: ["aM","aD"],
position:1,
    softcap: new Decimal(1e20),
    softcapPower() {let power = new Decimal(0.333)
        
        return power;
    },
    row: 2, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {
            key:"ctrl+t", description: "Ctrl+T: Reset for apotheic time", onPress() {
                if ((canReset(this.layer)&&player.ab.unlocked)&&!hasMilestone("aperdinal",0))
                    doReset(this.layer)
            }
        },
    ],
  
    onPrestige() {return player.m.points = new Decimal(0),
        player.s.points = new Decimal(0),
    player.aP.upgrades = [],
    player.aM.upgrades = [],

    player.aB2.upgrades = []},
    layerShown(){return (player.aN.tree == "apo"&&getBuyableAmount("ab",11).gte(4))&&!hasMilestone("aperdinal",0)},
    tabFormat: {
        "Main": {
            buttonStyle() { return {'background-color': 'chartreuse'} },
            content: ["main-display",
            "prestige-button",
            "resource-display", "blank",
           
            "upgrades",
           
            "blank",
        ]},
      
       

    
    },
    
    effectDescription() {
        return "which are boosting Multi Points, Session, Apeoblabla Points, previous Apotheic Layers that is not static by "+format(tmp.aT.effect)+"x."
    },
    
    addToBase() {
        let base = new Decimal(0);
    
        return base;
    },
   
    effectBase() {
        let base = new Decimal(5);
        
        // ADD
        base = base.plus(tmp.aT.addToBase);
        
        // MULTIPLY
      
        
        return base.pow(tmp.aT.power);
    },
    power() {
        let power = new Decimal(1);
     
        return power;
    },
    

    effect() {
        return Decimal.pow(tmp.aT.effectBase, player.aT.points.plus()).max(1).times(1);
    },
    
    doReset(resettingLayer) {
        let keep = [];
    
        if (player.ab.unlocked) keep.push("upgrades")
        if (player.ab.unlocked) keep.push("buyables")
        if (layers[resettingLayer].row > this.row) layerDataReset("aT", keep)
    },
 
})

