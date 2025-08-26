addLayer("ach", {
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
        total: new Decimal(0),
        best: new Decimal(0),
        fps: 0,
    }},
    color: "gold",
    row: "side",
    layerShown() {return true}, 
    tooltip() { // Optional, tooltip displays when the layer is locked
        return ("Achievements")
    },
    update(diff) {
  
        player.ach.fps = ((1/(diff+0.001))+player.ach.fps*4)/5
    },
    achievements: {
       
        11: {
            name: "Beginning",
            done() { return player.p.unlocked},
            tooltip: "Start the game.",
        
        },
         12: {
            name: "Accelerating up",
            done() { return player.points.gte(50)},
            tooltip: "Reach 50 points.",
        
        },
           13: {
            name: "Boosted",
            done() { return player.p.points.gte(200)},
            tooltip: "Reach 200 Prestige points.",
        
        },
         14: {
            name: "Prestige-it",
            done() { return hasUpgrade("p",15)},
            tooltip: "Purchase Prestige upgrade 15.",
        
        },
          15: {
            name: "Generateoh",
            done() { return player.g.unlocked},
            tooltip: "Unlock Generators.",
        
        },
         21: {
            name: "True Boost",
           done() { return player.b.unlocked},
         
            tooltip: "Unlock Boosters.",
        
        },
          22: {
            name: "Boosterers",
           done() { return player.b.points.gte(5)},
         
            tooltip: "Reach 5 boosters.",
        
        },
          23: {
            name: "Millionaire",
           done() { return player.points.gte(1e6)},
         
            tooltip: "Reach 1 million Points.<br><small>Reward: Boost booster effect by 20%</small>",
        
        },
         31: {
            name: "Where's Gen Z^1?",
           done() { return hasUpgrade("b",21)},
         
            tooltip: "Buy the Booster Upgrade 21.",
        
        },
          32: {
            name: "The Odyssey of Layers",
           done() { return player.t.unlocked},
         
            tooltip: "Unlock Time Capsules.<br><small>Unlocking this unlocks a new tree layer. Check Layers tree for more info.</small>",
        
        },
    },
    tabFormat: [
        "blank", 
        ["display-text", function() { return "You currently have obtained "+player.ach.achievements.length+"/"+(Object.keys(tmp.ach.achievements).length-2+" Achievements.")+"" }], 
        "blank", "blank",
        "achievements",
     
    ],
    
})

