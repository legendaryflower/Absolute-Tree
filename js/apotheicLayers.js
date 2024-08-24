
addLayer("aP", {
    name: "apotheized points", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "aP", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#FFB5B9",
    requires: new Decimal("1e340"), // Can be a function that takes requirement increases into account
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
       if (hasMilestone("aperdinal",0)) mult = mult.pow(3)
       if (hasUpgrade("aperdinal",31)) mult = mult.times(upgradeEffect("aperdinal",31))
       if (hasUpgrade("aperdinal",34)) mult = mult.times(upgradeEffect("aperdinal",34))
        return mult

    },
    gainExp() { // Calculate the exponent on main currency from bonuses
   
       
        let exp = new Decimal(1)
      
       
        return exp;
    },

  autoUpgrade() {return hasUpgrade("aD",14)},

    passiveGeneration() { return (hasUpgrade("aD", 12)?1:(hasUpgrade("aP", 12)?0.05:0)) },
    softcap() { let cap = new Decimal(1e20)
        if (hasUpgrade("s",32)) cap = cap.times(upgradeEffect("aD",32))
        return cap;},    softcapPower() {let power = new Decimal(0.333)
        
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
                if (x.gte(0)) eff.first = Decimal.pow(1.03, x.pow(1.07)).times(hasUpgrade("aP",16) ? 1.2 : 1)
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
            cost(x) { return new Decimal(1e9).mul(new Decimal(125).pow(x)) },
        
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
            cost(x) { return new Decimal(1e18).mul(new Decimal(1500).pow(x)) },
        
            display() { // Everything else displayed in the buyable button after the title
                let data = tmp[this.layer].buyables[this.id]
                return "Cost: " + format(data.cost) + " apotheized points\n\
                Amount: " + player[this.layer].buyables[this.id] + "/45\n\
               Multiply the effect of Glazed Stupe by " + format(data.effect.first) + "x. "
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
           purchaseLimit:45,
        },
    },
    upgrades: {
			
        11: {
            title: "Dolphin's Wrath",
            description: "Apotheic Points multiply Sessions gain.",
            cap() { let cap = new Decimal(1e9)

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
            description: "Brings back the Absolute layer, however it is altered. Points gain is log10(Points.pow(0.05))x",
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
            description: "Apothetic Points multiply Apeoblabla Points.",
            cost: new Decimal(1e12),
            effect() {
                
              
                let eff = player.aP.points.plus(1).pow(0.004)
            
               
                return eff;
            },
            
            
            
             
            effectDisplay() { return format(tmp.aP.upgrades[21].effect)+"x" },
            
unlocked() {return hasUpgrade("aP",17)&&player.aB.unlocked},            

            
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
    requires: new Decimal(1e21), // Can be a function that takes requirement increases into account
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

       if (hasUpgrade("aD",14)) mult = mult.pow(1.2)
       if (hasUpgrade("aD",17)) mult = mult.times(upgradeEffect("aD",17))
       if (getBuyableAmount("ab",11).gte(4)) mult = mult.times(tmp.aT.effect)
       if (hasUpgrade("aD",26)) mult = mult.times(tmp.aP.buyables[11].effect.first);
       if (hasUpgrade("aD",33)) mult = mult.pow(upgradeEffect("aD",33))
       if (hasMilestone("aperdinal",0)) mult = mult.pow(3)
       if (hasUpgrade("aperdinal",14)) mult = mult.times(20)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
   
       
        let exp = new Decimal(1)
      
        if (hasUpgrade("aM",17)) exp = exp.add(0.05)
        if (hasUpgrade("aD",15)) exp = exp.add(0.5)
        return exp;
    },
    hardcapStart () {let hardcap = new Decimal(1e75)
    if (hasUpgrade("aperdinal",12)) hardcap = hardcap.times(upgradeEffect("aperdinal",12))
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
                if ((canReset(this.layer)&&player.ab.unlocked)&&!hasMilestone("aperdinal",2))
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
                
              
                let eff = player.s.points.plus(1).pow(0.001)
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
            description: "Cheapcap's effect is raised ^1.5",
            cost: new Decimal(5000),
        
            unlocked() {return hasUpgrade("aM",15)||player.aB2.points.gte(1)},
            
    
            
        },	
        17: {
            title: "Fracktail",
            description: "Apothetic Mastery exponent is added by 0.05.",
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
    }},
    color: "#7ADBBA",
    exponent: 0.04,
    baseResource: "apothetic mastery",
    resource: "aperdinalities",
    requires: new Decimal(1e18), // Can be a function that takes requirement increases into account
    baseAmount() {return player.aM.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
  
    gainMult() { // Calculate the multiplier for main currency from bonuses




       
        mult = new Decimal(1)

    if (hasMilestone("aperdinal",4)) mult = mult.times(50)
    if (hasUpgrade("aperdinal",16)) mult = mult.pow(2)
    if (hasUpgrade("aperdinal",22)) mult = mult.pow(upgradeEffect("aperdinal",22))
    if (hasUpgrade("aperdinal",24)) mult = mult.times(tmp.aperdinal.levelNerf)
    if (hasUpgrade("aperdinal",26)) mult = mult.times(upgradeEffect("aperdinal",26))
        return mult
    },
    effectNerf() {
        return Decimal.pow(this.effectNerfMult(), player.aperdinal.stabPoints.plus()).max(1).times(1);
    },
    effectNerfMult() {let nerf = new Decimal(1.05)
    if (hasUpgrade("aperdinal",23)) nerf = nerf.sub(0.025)
    if (hasUpgrade("aperdinal",25)) nerf = nerf.sub(upgradeEffect("aperdinal",25))
    return nerf;
    },
    stabGainEff() {
        if (!hasUpgrade("aperdinal",14)) return new Decimal(0);
        let eff = Decimal.pow(this.stabGainMult(), player.aperdinal.dummies.plus(1)).sub(1).div(tmp.aperdinal.effectNerf).max(0);
     
        return eff;
    },

    stabGainMult() { let mult = new Decimal(1.02) 
    if (hasUpgrade("aperdinal",15)) mult = mult.times(1.2)
    if (hasUpgrade("aperdinal",16)) mult = mult.times(1.1)
    if (hasUpgrade("aperdinal",17)) mult = mult.times(1.25)
    if (hasUpgrade("aperdinal",24)) mult = mult.times(tmp.aperdinal.levelNerf)
    if (hasUpgrade("aperdinal",33)) mult = mult.pow(upgradeEffect("aperdinal",33))
    if (hasUpgrade("aperdinal",35)) mult = mult.times(upgradeEffect("aperdinal",35))
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
   if (player.aperdinal.level.gte(40)) mult = mult.pow(0.5)
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
    },
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

            content: ["main-display",
            "prestige-button",
            "resource-display", "blank",
           
           "upgrades",
          
            "blank",
        ]},
        "Stabverse": {
           unlocked() {return hasUpgrade("aperdinal",14)},
            content: ["main-display",
            "prestige-button",
            "resource-display", "blank",
           
          ["microtabs", "stuff"],
        ]},
       

    
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
    },
    passiveGeneration() { return (hasUpgrade("aperdinal", 12)?1:0) },
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
                 Amount: " + player[this.layer].buyables[this.id] + "\n\
                Construct 1 Dummy"
             }, 
           
             canAfford() { return player.aperdinal.points.gte(this.cost()) },
             buy() {
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
               player.aperdinal.points = player.aperdinal.points.sub(this.cost())
                   player.aperdinal.dummies = player.aperdinal.dummies.add(1)
            
             },
         unlocked() {return hasUpgrade("aperdinal",14)},
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
                }
    },
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
            description: "Raise points gain by 1.05.",
          
            cost: new Decimal(1000),
         
            
        },	
        12: {
            title: "Impossible Errors",
            description: "The hardcap for Apotheic Mastery starts later based on Multi Points, Nursery Points gain is raised ^1.6. Gain 100% of Aperdinalities per second.",
          
            cost: new Decimal(1800),
            unlocked() {return hasUpgrade("aperdinal",11)},
            effect() {
                
              
                let eff = player.m.points.plus(1).pow(0.0009)
        
               
                return eff;
            },
   
        
        
            
           effectDisplay() { return format(tmp.aperdinal.upgrades[12].effect)+"x" },
            
        },	
        13: {
            title: "'BeetleDancer999'",
            description: "Apeoblabla Points is multiplied by your Aperdinalities.",
          
            cost: new Decimal(25000),
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
            description: "Gain more Points based on Stabs, and gain 100% of Nursery Points per second.",
          
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
           tooltip() {return "1.05 → 1.025"},
            
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
                let eff = player.points.add(1).log10().sqrt().div(800).times(1);
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
    },
    milestones: {
        0: {
            requirementDescription: "1 Total Aperdinalities",
            effectDescription: "Points gain is raised ^1.5, Apothetic Layers that isn't static is cubed, Sessions gain is raised ^1.4.",
            done() { return player.aperdinal.total.gte(1) },

        },
        1: {
            requirementDescription: "10 Total Aperdinalities",
            effectDescription: "Absolute Points, Apothetic Boosters and Time reset nothing.",
            done() { return player.aperdinal.total.gte(10) },

        },
        2: {
            requirementDescription: "300 Total Aperdinalities",
            effectDescription: "Sacrifice Apotheic Boosters and Time but unlock Aperdinal Upgrades.",
            done() { return player.aperdinal.total.gte(300) },
         unlocked() {return hasMilestone("aperdinal",1)}
        },
        3: {
            requirementDescription: "500 Total Aperdinalities",
            effectDescription: "Automatically gain Absolute Points.",
            done() { return player.aperdinal.total.gte(500) },
            unlocked() {return hasMilestone("aperdinal",2)}
        },
        4: {
            requirementDescription: "300,000 Total Aperdinalities",
            effectDescription: "Apeoblabla Points is raised ^5, and gain 50 times more Aperdinalities.",
            done() { return player.aperdinal.total.gte(300000) },
            unlocked() {return hasMilestone("aperdinal",3)}
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
    requires: new Decimal(1e154), // Can be a function that takes requirement increases into account
    resource: "apothetic boosters", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.1, // Prestige currency exponent
    base: 999,
    gainMult() { // Calculate the multiplier for main currency from bonuses




       
        mult = new Decimal(1)
 if (player.aB2.points.gte(6)) mult = mult.add(10).pow(3).pow(player.aB2.points.sub(5))
     
 if (player.aB2.points.gte(12)) mult = mult.add(10).pow(3).pow(player.aB2.points.sub(11))
        return mult
    },
    autoUpgrade() {return hasUpgrade("aD",14)&&!hasMilestone("aperdinal",2)},
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
                if ((canReset(this.layer)&&player.ab.unlocked)&&!hasMilestone("aperdinal",2))
                    doReset(this.layer)
            }
        },
    ],
  
    onPrestige() {return player.m.points = new Decimal(0),
        player.s.points = new Decimal(0),
    player.aP.upgrades = []},
    layerShown(){return (player.aN.tree == "apo"&&getBuyableAmount("ab",11).gte(2))&&!hasMilestone("aperdinal",2)},
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
                
              
                let eff = player.m.points.plus(1).pow(0.00075)
        
               
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
    requires: new Decimal(70000), // Can be a function that takes requirement increases into account
    baseAmount() {return player.aM.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
  
    gainMult() { // Calculate the multiplier for main currency from bonuses




       
        mult = new Decimal(1)

     if (hasUpgrade("aD",21)) mult = mult.times(upgradeEffect("aD",21))
     if (hasUpgrade("aD",23)) mult = mult.times(8)
     if (hasUpgrade("aD",24)) mult = mult.times(upgradeEffect("aD",24))
     if (getBuyableAmount("ab",11).gte(4)) mult = mult.times(tmp.aT.effect)
     if (hasMilestone("aperdinal",0)) mult = mult.pow(3)
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
            cost: new Decimal(1),
           unlocked() {return hasUpgrade("aD",12)},
           effectDisplay() { return "On Unalive: /"+format(tmp.s.clickables[11].cost)},
        },	
        14: {
            title: "Ethica Hacking",
            description: "Therapy Sessions cost is raised ^0.25, Apotheic Mastery gain is raised by another ^1.2, and automatically get Apothetic Points, Apothetic Mastery and Apotheic Boosters upgrade.",
            cost: new Decimal(1),
           unlocked() {return hasUpgrade("aD",13)},
  
        },	
        15: {
            title: "Breviceps macrops<br><small><small>Scientific name for Desert Rain Frog (one of the cutest frogs in world)</small></small>",
            description: "Apothetic Mastery exponent is added by 0.25.",
            cost: new Decimal(1),
           unlocked() {return hasUpgrade("aD",14)},
  
        },	
        16: {
            title: "Aperdinal Dominium Glaive",
            description: "Gain 15% of Apotheic Dimensions per second.",
            cost: new Decimal(5),
           unlocked() {return hasUpgrade("aD",15)},
  
        },	
        17: {
            title: "Glazed Stupe",
            description: "Apotheic Dimensions multiply the gain of Apothetic layers row above it (excluding for Boosters)",
            cost: new Decimal(100),
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
            cost: new Decimal(250),
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
            cost: new Decimal(2500),
           unlocked() {return hasUpgrade("aD",21)},

        

        },	
        23: {
            title: "Nacho F̶́̾̍̿̈́̆̽͗̒̐͘͝͝ͅa̴̻͎̰͕̣̠͖̳̯͓̙̒̉͋͂̎͒̃̋̕͘̕i̸̛̻͉̣̭̰͉̙̬̦͖͚͌̍́̿̋̇̆͂̕͝l̴̪̺̳͇̝̪͕͌̿̾̋ų̴̯̙̟͎̆ṟ̴̡͚̦̳̭̒̑̊̔̀͆̕ę̸̮̼͙͎̫͖̰͉̥͍͓̥̜́̔",
            description: "Ą̶̜͓̖̈́͊̊̌̍͗̔̊͆͆́͘p̵̢̢̤̣̺̼̟̫̈̽̋̔͊ͅo̸̝̙̘͓̳̗̪͕̙͍̪̽́͆͛̓̾̓̌̓̽̕͜͝͝͝ę̶̮͖̤͚̩̮̠̹͋̀̐̌͑̌̏̔̏̌͛͆̀̕͜b̴͈̝̲̹͔̌̈͒̾͝͝͠l̵͈͕̤͍̐͗͂̾͂̄̚͠͝ả̴̧̨̖̰̩̲̭̘̦̫̣̮̈́͌͗͐̏̋̃͝ͅb̴̨̢̭̦̟̥̘̰̅̋̊̏̾̕͠l̷̨͉̭̲͖͙̤͓̋̿͊̒͊a̸͚̗͎͇̓͛̀̍̄́̔͗̿ ̴̘̪̺̭̻̮͇̜̯̍͊P̵̣͚͍̺̼̟̣͇̪̻͆̄̋͗͆̐̓̄̌̒͐͝ǫ̶͛ī̷̩͙̻͚͔͙͙̮͍͔̣̥̣͕̔̽̓̇͐̽̈̎̀̈́͝͝ͅn̸̢̫͙͊́͋̉̊͑͠t̵͓̖̩̓̐͆̆͛̔̇̎̆͂͌̊̆̚͘s̷̛̞̔͌̃ ̷̣͔̞͕̞͔̇̌́͘͘̚ĝ̸̠̩̠̜̻͔̇̓̍̐̉a̶̡̧͔͉̭͎͎͙̼͍͈̥̻̦̯̽̄͋̈́͝i̶̢̜̺̥̎͋̌̓͜n̵̨̛̯̩̬͋̈́ ̵̡̙͕̪͙̳̼̜̲͍̈́́̍̑̊́̀͜͜ͅi̴̱̼̺̩͍̟͛̔̓͛͑̒͝ͅs̷̨̥̬̺̣̻̦̻̭̬̙̖̅́̈̈́̈́͆͌̃̕ͅ ̷̠̼͈̥̖̰͙̻͗̔̒̏̈́̚ͅm̶̗̹̩̺̪͇̝̰̅̍̃͒ứ̶̼̑͒̇̌̑̚̚͝ļ̸̢̨̫͓̘̬̙̝́̌t̶͔̺͉̭̹̍͑͛̄͆̚͠î̴͚̯̻̱͉̥̄͛͛̒̒ͅp̴̤̰͓̳͙͕͕̟̅͒̈̒͌͘͝l̶̢̞̤̲͘ḭ̴̛̝̣̤͉͙͕̞̩̽̄͂̋̒̎̇̀̓͛͛̂͝͝e̵̻̬̩̟̜͖̝̘̔̓̏͜͝͝d̷̢̳̼̯̹̥̦̟̥̦̯̰͖̯̈́̉̔̒͑͌̇̾̓͐͐͝͝ ̷̨̢̲͇̲̺̠̣̯̪̭̅̂͋͗̿͋̓̓͒̒b̶̭͍̩̐͋̈͠͝ͅý̸̨̠͖̹̗͕̰̟̭̹̫̥̾̋̈́͛̀̏̀̔̐̍ ̶̡̰̥̣͙̀̆̌͗̊̇y̷̨̛͔̝͋̊̅̃̎̔̐̚ͅö̴̻̞͙̣̬͓̩̲͛̔͑͠ừ̴̡̪̭̤̥͉̜͉̜͕̩̜̫͕̞̓̔̅̇͌̎̀̐̈́̕͝͝ṟ̵̛͕̙̜̙͎̗̍͊̈̏̌̔͑̅̍̕͝͝͠ͅ ̸̨͚̟̻̺̖̩̦̥̱̼̬̮̥͇͑̾̂A̶̞͚͈͖̾̀͐́͋͑̊̽̈́̄̅͘͝͝p̵̨̛̩̬̼̤̏̽̒̇͐͂̂͒̀̄̕ͅo̷̹̪͇͒t̸̡̠̮̩̫̰͉͈͔̣͓̲̙͍̄̅̆̂̈́̓h̶͓̻̱͕̬̤̏͊́̇̂e̶̦̠̝̪͕̳̖̩̖̓̈͜͝t̸͍͖͓̊̋̋͐̒̋͑̚͜ǐ̵̛͎̙̯͈͇̙̗̣̜̇́́͂̎͌̅̉ç̸̛̫͓͕̆̓̒̿̊̋̔̒ ̸̢̧̹͙̄B̴͍̬̱̯̤͍̱̩̦͙̺̎̿͒̑̄͂͌̄͘͝ͅͅơ̴̡̧̥̩̫̩̗̥̘̠̲̐̓̋͆́͒͋̑͑̚ó̵̪̔͒̓͌̀̏s̸̝̩̪̜͔̠̝̳͌̿̍̿̍ͅṯ̸͉̯̪̍̈́̊̆̒̌́͠é̵͎͇̠̻̺̖͊̈́̈̀̾̈̄͑̄͆̚̕r̵̡̳͙̲̲̜͈̣̔̆͐̀s̶̩͔̳͉̝̻͎̦̙̜͍̠͑̐͜͜ͅ,̷̡̨̬̖̺̖̯̻̜͌̎̋̇͛̊̑̉͘͠ ̸̛̛͍͎̺͉̩̤̬̣̰̞͔͂̑̽͌̂̓͠ą̵̞̩͖̗̻̰̟̹̬̬̪͖̜̒̈́̆̃͠ņ̴̱̥̳̤͖͉̻̲̯̘͝d̴̨̦̥̬̰́̋ ̴̡̡̰͇̯͇̤͙͇̹̰̟̗̃́͂͛̒͆́̃̈̔̾̏͗͒͝ͅḿ̵̢̧̛̛͙͕̟̘̣̰͕̫̼̙͈̠̲̄̀̿̽̈́̄̃͘̕͝ư̴̢͙̬̺̣̯̻̗̰̮͖͊͊̇͛͌͂͠ͅḽ̸̦̤̱̹͎̖̖̫̪͍͗̉t̴̡̞̥̠̣͖̟̪͙̣̱̜́̒̈́͒̓̎͜͠ͅi̶̛͈͓͚̯̹̮̱̘͓̅̆̈͑̀p̶̧̲͎͉̺̗̰̠̟̘̗̮̮͛̐̑̍̒͂͐͗̚͜͜͝͝l̵̨̧̙̗̣͉̲̜̲̞̒̐̔͜ŷ̷̢̳̣̞̪̞̼͇̜͓̠̦̜͇͎̒̅̔̋͗̏̍̓̉͝ ̷̨̛͈̼͔͎̃̽̈̐̏͂̒̄A̶̡̳̝̱̬͍̞͝p̸͔̬͍̜͉͕͇̈́ͅo̵̱̗̅̅͑ͅt̶̢̞̝̮̻̉̎͑̑̌͛̿͒͐̓̀̕̕͜h̵̡̞̠̫̭͍̯̮̱̻̜̏̈͆̾̽̅͜e̷̝̍̍̉̈́́͒̑̔̃̕͘͝ì̵̡̝̜̥̥̳̘̗͓̙̗̤̤̩c̶̡̧̡̭̠͉͉͎̙̘͈̮̜̯̈́͋̀͂̎̆̽̂̽̆͑̊͗͠͝ ̶̢̫̠̪͈̰͕̽̑Ḑ̴̨̨̧̢̛͕̭̳͔͇̜̱̙̦̀̐̃͊̃ͅỉ̶̧̩̩̊́̆͆͑͊̒͆ṃ̴̨̻̜̟͇̺̳͖̪̤̒́̏͜͠e̴͈̘̲̞̼͎̝̥̱̣̣͜͠͝n̶̥̼͉͚͈̜̗͔̣̤̦̟̂̄̒̀̎̈́͒͂̋̕͠s̶̡͔̺̦͂̊́͋̒͊͂͛ỉ̴̢̡̤̘͋̌͝ͅò̸̖̳̼̬̻̼̟̪̖̬̮̯̮͜n̷̢̗̼̰̼̭̫̤̝̙̅ ̷͙̯̹̱̦̞̬̖̜͉͎̥̤̗̗̕g̷̢̡̜͖̜̻͔̱̳͈̻̤͍͂͜ͅa̸͉͈͋̑̏͑ȋ̴̧̱̘͉͓͇̬̭̬͝n̵̢̰͉̭̫̘̝̪̪̞̭̰̈́̅͜ ̶̱̜̳̜͎͕̝͎̹̓̓̇̌̂̆̈́̋͆͐̅̇͘͜͜͝ͅb̶̛̝͎̰̌̒͐̑̓͂̐̀͂̽̃̄͒y̶̮̐ ̶̰͕̺̒́̌̈̽͌̏͋8̶̢̭̖̱̤͙̞͕̭͈̠͂.̷̛̹̤͙͔̺̳̭̼̹͐̄͊͌",
            cost: new Decimal(20000),
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
            cost: new Decimal(35000),
           unlocked() {return hasUpgrade("aD",23)},
           effect() {
                
              
            let eff = player.aD.points.plus(1).pow(0.14)
    
           
            return eff;
        },

    
        
        
       effectDisplay() { return format(tmp.aD.upgrades[24].effect)+"x" },
        

        },	
        25: {
            title: "Non-Distancing Nachos",
            description: "Apeoblabla Points exponent+0.01",
            cost: new Decimal(115000),
           unlocked() {return hasUpgrade("aD",24)},
        

        },
        26: {
            title: "Brassica oleracea botrytis",
            description: "Sede effect now affects Apotheic Mastery gain.",
            cost: new Decimal(1e7),
           unlocked() {return hasUpgrade("aD",25)},
        

        },	
        27: {
            title: "Crosslayer Points",
            description: "Unlock Hypersede.",
            cost: new Decimal(3e9),
           unlocked() {return hasUpgrade("aD",26)},
        

        },	
        31: {
            title: "Decimal Goat",
            description: "Apotheic Points gain is squared.",
            cost: new Decimal(7e9),
           unlocked() {return hasUpgrade("aD",27)},
        

        },	
        32: {
            title: "Apocap",
            description: "Softcap for Apothetic Points starts later based on Points.",
            cost: new Decimal(1.6e10),
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
            cost: new Decimal(2.2e10),
           unlocked() {return hasUpgrade("aD",32)},
           effect() {
                
              
            let eff = player.points.plus(1).pow(0.0012)
    
           
            return eff;
        },

    
        
        
       effectDisplay() { return "^"+format(tmp.aD.upgrades[33].effect) },
        

        },	
        34: {
            title: "Antibiotics",
            description: "Brings back the Nursery Layer, however a lot of features are weakened or removed.",
            cost: new Decimal(5e38),
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
    requires: new Decimal(1e19), // Can be a function that takes requirement increases into account
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
                if ((canReset(this.layer)&&player.ab.unlocked)&&!hasMilestone("aperdinal",2))
                    doReset(this.layer)
            }
        },
    ],
  
    onPrestige() {return player.m.points = new Decimal(0),
        player.s.points = new Decimal(0),
    player.aP.upgrades = [],
    player.aM.upgrades = [],

    player.aB2.upgrades = []},
    layerShown(){return (player.aN.tree == "apo"&&getBuyableAmount("ab",11).gte(4))&&!hasMilestone("aperdinal",2)},
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

