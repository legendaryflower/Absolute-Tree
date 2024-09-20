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
            done() { return player.m.points.gt(0) },
            tooltip: "Obtain your first Multi Point.",
        
        },
        12: {
            name: "Slow Grind",
            done() { return player.points.gte(25) },
            tooltip: "Reach 25 points.",
        
        },
        13: {
            name: "Multipoints!",
            done() { return hasUpgrade("m",13) },
            tooltip: "Purchase the Multipoints upgrade.",
        
        },
        14: {
            name: "Creeping up",
            done() { return getBuyableAmount("m",12).gte(2)||hasUpgrade("s",111) },
            tooltip: "Purchase Multi Points buyable 2 times.",
        
        },
        15: {
            name: "Multiple Points",
            done() { return player.m.points.gte(1000) },
            tooltip: "Reach 1000 Multi Points.<br><i>Reward: Gain 20% more Multi Points.</i>",
        
        },
        16: {
            name: "Inflation",
            done() { return player.m.points.gte(1e15) },
            tooltip: "Reach 1e15 Multi Points.",
        
        },
        21: {
            name: "Beginning[COPYRIGHT CLAIMED]",
            done() { return player.a.unlocked },
            tooltip: "Unlock Absolute layer.<br><i>Reward: Unlock a new Multi Buyable and Points gain is raised ^1.2.</i>",
           unlocked() {return player.a.unlocked},
        },
        22: {
            name: "Absolute Bone",
            done() { return player.a.points.gte(8)||player.s.unlocked },
            tooltip: "Reach 8 Absolute Points.",
           unlocked() {return player.a.unlocked},
        },
        23: {
            name: "Challenging, huh",
            done() { return hasChallenge("a",11)||player.s.unlocked },
            tooltip: "Complete the first Absolute challenge.",
           unlocked() {return player.a.unlocked},
        },
        24: {
            name: "Creeping more up",
            done() { return getBuyableAmount("m",12).gte(50)||hasUpgrade("s",111) },
            tooltip: "Purchase Multi Points buyable 50 times.",
           unlocked() {return player.a.unlocked},
        },
        25: {
            name: "Cookie Clicker Garden reference",
            done() { return hasUpgrade("a",11)||player.s.unlocked },
            tooltip: "Purchase the first Absolute Upgrade.",
           unlocked() {return player.a.unlocked},
        },
        26: {
            name: "Not a sugar glider",
            done() { return hasChallenge("a",21)||player.s.unlocked},
            tooltip: "Complete Flysquirrel challenge.",
           unlocked() {return player.a.unlocked},
        },
        31: {
            name: "Whiskey isn't much.",
            done() { return hasChallenge("a",22)||player.s.unlocked},
            tooltip: "Complete Anti-Queens challenge.",
           unlocked() {return player.a.unlocked},
        },
        32: {
            name: "U17R4 14Y3R",
            done() { return player.u.unlocked},
            tooltip: "Unlock Ultra Points.",
           unlocked() {return player.u.unlocked},
        },
        33: {
            name: "Creeping even more up!",
            done() { return getBuyableAmount("m",12).gte(500)||hasUpgrade("s",111) },
            tooltip: "Purchase Multi Points buyable 500 times.",
           unlocked() {return player.u.unlocked},
        },
        34: {
            name: "SPLAT",
            done() { return hasUpgrade("a",32)||player.s.unlocked },
            tooltip: "Unlock Squid Buyables.<br><i>Reward: Lethality of Anti-Queens challenge is reduced by 50% and unlock Spectrality.</i>",
           unlocked() {return player.u.unlocked},
        },
        35: {
            name: "The Healing Tree?",
            done() { return player.n.unlocked },
            tooltip: "Unlock Nursery layer.<i>Reward: Multi Point exp+0.15, and Panda-Cola Biscuits hardcap start+0.01</i>",
           unlocked() {return player.n.unlocked},
        },
        36: {
            name: "The Not Healing Tree???",
            done() { return hasChallenge("a",32)||player.s.unlocked },
            tooltip: "Complete the Anti-Nurses challenge.",
           unlocked() {return player.n.unlocked},
        },
        41: {
            name: "Extended Nursery",
            done() { return hasUpgrade("a",35)||player.s.unlocked },
            tooltip: "Unlock Type I Nurseries.",
           unlocked() {return player.n.unlocked},
        },
        42: {
            name: "8347 7H3 QU33N",
            done() { return hasUpgrade("a",37)||player.s.unlocked },
            tooltip: "Unlock Queenbeet (buyable).",
           unlocked() {return player.n.unlocked},
        },
        43: {
            name: "'8347 7H3 QU33N'",
            done() { return hasUpgrade("a",41)||player.s.unlocked },
            tooltip: "Purchase the Juicy Queenbet Upgrade.",
           unlocked() {return player.n.unlocked},
        },
        44: {
            name: "Absol Infinity",
            done() { return hasUpgrade("a",43)||player.s.unlocked },
            tooltip: "Unlock Absol Perpetuals.",
           unlocked() {return player.n.unlocked},
        },
        45: {
            name: "Two-Type Absols",
            done() { return hasUpgrade("n",33)||player.s.unlocked },
            tooltip: "Unlock Absolities.",
           unlocked() {return player.n.unlocked},
        },
        46: {
            name: "Ten tons of iron or a fat sunbird",
            done() { return player.n.absolPer.gte(1e14)||player.s.unlocked },
            tooltip: "Unlock Umvuthi.<br><i>Reward: Gain 10% more Absol Perpetuals</i>",
           unlocked() {return player.n.unlocked},
        },
        51: {
            name: "Umvuthi doesn't eat gold. Or he does?",
            done() { return player.n.food.gte(5)||player.s.unlocked },
            tooltip: "Have 5 Food for Umvuthi.",
           unlocked() {return player.n.unlocked},
        },
        52: {
            name: "Sessioned-in-points",
            done() { return player.s.unlocked },
            tooltip: "Unlock Sessions.<br><i>Reward: You can now have 3 Nurseries at a time.</i>",
           unlocked() {return player.s.unlocked},
        },
        53: {
            name: "CapCut",
            done() { return hasUpgrade("s",12) },
            tooltip: "Purchase the Cheapcap upgrade.<br><i>Reward: Double Absol Perpetual gain.</i>",
           unlocked() {return player.s.unlocked},
        },
        54: {
            name: "Evergreen + Daisy",
            done() { return hasUpgrade("s",21) },
            tooltip: "Purchase the Everdaisy upgrade.",
           unlocked() {return player.s.unlocked},
        },
        55: {
            name: "Hospital Tree now.",
            done() { return hasUpgrade("s",23) },
            tooltip: "Unlock Therapy Sessions.<br><i>Reward: Points gain is raised 1.01.</i>",
           unlocked() {return player.s.unlocked},
        },
        56: {
            name: "0th dimension figure",
            done() { return hasUpgrade("s",27) },
            tooltip: "Unlock Axis-X.",
           unlocked() {return player.s.unlocked},
        },
        61: {
            name: "One too many.",
            done() { return hasUpgrade("s",37) },
            tooltip: "Unlock Axis-Y.",
           unlocked() {return player.s.unlocked},
        },
        62: {
            name: "Axis-Submit.",
            done() { return hasUpgrade("s",47) },
            tooltip: "Unlock Axis-Z.<br><i>Reward: Remove the Therapy Sessions effect nerfing Points gain.</i>",
           unlocked() {return player.s.unlocked},
        },
        63: {
            name: "Fox Actor",
            done() { return hasUpgrade("s",57) },
            tooltip() {return "Unlock Musics.<br><i>Reward: Maker Axis-Z raises Points gain. Currently: ^"+format(Decimal.pow(1.005, player.s.makeraxisZ))+"."+"</i>" },
           unlocked() {return player.s.unlocked},
        },
        64: {
            name: "Infinity seconds is the new forever",
            done() { return player.s.durationFox.gte(Number.MAX_VALUE) },
            tooltip: "Have your fox duration to 1.8e308 seconds (or 5.7e200 Black Hole Eras).",
           unlocked() {return player.s.unlocked},
        },
        65: {
            name: "I'm going to smack [REDACTED]",
            done() { return player.sm.points.gte(1)||player.ab.unlocked },
            tooltip: "Smack your progression.",
           unlocked() {return player.sm.points.gte(1)||player.ab.unlocked},
        },
        66: {
            name: "Smacking is bad.",
            done() { return player.sm.points.gte(2)||player.ab.unlocked },
            tooltip: "Smack your progression 2nd time.",
           unlocked() {return player.sm.points.gte(1)||player.ab.unlocked},
        },
        71: {
            name: "Scenexe.io Reference?.",
            done() { return player.s.celestial.gte(1)},
            tooltip: "Reach 1 Celestial.",
           unlocked() {return player.sm.points.gte(1)||player.ab.unlocked},
        },
        72: {
            name: "Bloons TD<sup>Infinity</sup>.",
            done() { return player.s.axisXSquared.gte(1)},
            tooltip: "Reach 1 Axis-X<sup>2</sup>.",
           unlocked() {return player.sm.points.gte(1)||player.ab.unlocked},
        },
        73: {
            name: "Axis-Why.",
            done() { return player.s.axisYSquared.gte(1)},
            tooltip: "Reach 1 Axis-Y<sup>2</sup>.",
           unlocked() {return player.sm.points.gte(1)||player.ab.unlocked},
        },
        74: {
            name: "HELLO.",
            done() { return player.s.axisZSquared.gte(1)},
            tooltip: "Reach 1 Axis-Z<sup>2</sup>.",
           unlocked() {return player.sm.points.gte(1)||player.ab.unlocked},
        },
        75: {
            name: "Parallel Universes Collide!.",
            done() { return player.s.parCel.gte(1)},
            tooltip: "Reach 1 Parallel Celestial.",
           unlocked() {return player.sm.points.gte(1)||player.ab.unlocked},
        },
        76: {
            name: "Trashing Tanks.",
            done() { return player.s.celestial.gte(100)},
            tooltip: "Reach 100 Celestials.",
           unlocked() {return player.sm.points.gte(1)||player.ab.unlocked},
        },
        81: {
            name: "Euler is going back",
            done() { return player.sm.points.gte(3)||player.ab.unlocked},
            tooltip: "Smack your progression 3rd time.",
           unlocked() {return player.sm.points.gte(1)||player.ab.unlocked},
        },
        82: {
            name: "END THE WORLD NOW.",
            done() { return player.s.points.gte(1e24)},
            tooltip: "Reach 1e24 Sessions.",
           unlocked() {return player.sm.points.gte(1)||player.ab.unlocked},
        },
        83: {
            name: "More like",
            done() { return player.ab.unlocked},
            tooltip: "Unlock Apeoblabla.",
           unlocked() {return player.ab.unlocked},
        },
        84: {
            name: "IT IS NOT APEOTHEOSIS",
            done() { return player.aB2.points.gte(1)},
            tooltip: "Reach 1 Apothetic Boosters.",
           unlocked() {return player.ab.unlocked},
        },
        85: {
            name: "Anti-Dimension",
            done() { return player.aD.points.gte(1)},
            tooltip: "Reach 1 Apothetic Dimensions.",
           unlocked() {return player.ab.unlocked},
        },
        86: {
            name: "Murray!",
            done() { return player.ab.points.gte(1e24)},
            tooltip: "Reach 1e24 Apeoblabla Points.",
           unlocked() {return player.ab.unlocked},
        },
        91: {
            name: "TIP: Do not eat Doritos daily!",
            done() { return player.aD.nachoFed.gte(1e9)},
            tooltip: "Have fed the sad tank 1e9 Nachos.",
           unlocked() {return player.ab.unlocked},
        },
        92: {
            name: "Anti-Submit",
            done() { return player.aT.points.gte(1)},
            tooltip: "Reach 1 Apothetic Time",
           unlocked() {return player.ab.unlocked},
        },
        93: {
            name: "Mastered Mastery",
            done() { return player.aM.points.gte(1e12)},
            tooltip: "Reach 1e12 Apothetic Masteries.",
           unlocked() {return player.ab.unlocked},
        },
        94: {
            name: "Absolute Aperdinal",
            done() { return player.aperdinal.points.gte(1)},
            tooltip: "Reach 1 Aperdinalities.",
           unlocked() {return player.aperdinal.total.gte(1)},
        },
        95: {
            name: "SO many Points!",
            done() { return player.points.gte("1e22000")&&player.s.unlocked},
            tooltip: "Reach 1e22,000 Points",
           unlocked() {return player.aperdinal.total.gte(1)},
        },
        96: {
            name: "Realm of the Power",
            done() { return player.aP.points.gte("1e600")},
            tooltip: "Reach 1e600 Apothetic Points.",
           unlocked() {return player.aperdinal.total.gte(1)},
        },
        101: {
            name: "Modd.io Stab.io?!",
            done() { return hasUpgrade("aperdinal",14)},
            tooltip: "Unlock Stabverse.",
           unlocked() {return player.aperdinal.total.gte(1)},
        },
        102: {
            name: "AHHHH, STABBER",
            done() { return player.aperdinal.stabs.gte(10000)},
            tooltip: "Reach 10,000 Stabs.",
           unlocked() {return player.aperdinal.total.gte(1)},
        },
        103: {
            name: "You there?",
            done() { return player.aperdinal.stabs.gte(player.aperdinal.points)&&hasUpgrade("aperdinal",14)},
            tooltip: "Have more Stabs than Aperdinal Points.",
           unlocked() {return player.aperdinal.total.gte(1)},
        },
        104: {
            name: "'searching, book'",
            done() { return player.aperdinal.tSP.gte(1)||player.aperdinal.tBP.gte(1)},
            tooltip: "Get either 1 tSP or TBP.",
           unlocked() {return hasUpgrade("aperdinal",37)},
        },
        105: {
            name: "Ultimate Levels",
            done() { return player.aperdinal.level.gte(75)},
            tooltip: "Reach 75 Levels.",
           unlocked() {return hasUpgrade("aperdinal",37)},
        },      
        106: {
            name: "Iron Chainsaw",
            done() { return player.ir.unlocked},
            tooltip: "Unlock Irons.",
           unlocked() {return player.ir.unlocked},
        },    
        111: {
            name: "Billion Celestials!",
            done() { return player.s.celestial.gte(1e11)},
            tooltip: "Reach 1e11 Celestials.<br><i>Reward: Unlock The Exponent Tree (first RTLF2024's TMT).</i>",
           unlocked() {return player.ir.unlocked},
        },    
        112: {
            name: "The Exponent Tree Reference?",
            done() { return player.aperdinal.exponentCoins.gte(1e12)},
            tooltip: "Reach 1e12 Exponent Coins.",
           unlocked() {return player.ir.unlocked},
        },   
        113: {
            name: "Bro, let me poach trees!",
            done() { return player.aperdinal.poachers.gte(1)},
            tooltip: "Get 1 Poacher.",
           unlocked() {return player.ir.unlocked},
        },     
        114: {
            name: "Prestige Stabs",
            done() { return player.aperdinal.stabs.gte(1e105)},
            tooltip: "Reach 1e105 Stabs.",
           unlocked() {return player.ir.unlocked},
        }, 
        115: {
            name: "Kossed Up",
            done() { return player.aperdinal.kos.gte(1)},
            tooltip: "Get 1 Kos.",
           unlocked() {return player.ir.unlocked},
        },    
        116: {
            name: "Even Kossed Up",
            done() { return getBuyableAmount("aperdinal",51).gte(3)},
            tooltip: "Purchase the Kos Buyable 3 times.",
           unlocked() {return player.ir.unlocked},
        },   
        121: {
            name: "Kossers",
            done() { return player.aperdinal.tossedKos.gte(1)},
            tooltip: "Toss out all of your Kos.",
           unlocked() {return player.ir.unlocked},
        }, 
        122: {
            name: "Too many points!",
            done() { return player.points.gte("1e2.6e4")},
            tooltip: "Reach 1e26,000 Points.<br><i>Points gain is hatsuned to 1.001.</i>",
           unlocked() {return player.ir.unlocked},
        },     
    },
    tabFormat: [
        "blank", 
        ["display-text", function() { return "You currently have obtained "+player.ach.achievements.length+"/"+(Object.keys(tmp.ach.achievements).length-2+" Achievements.")+"" }], 
        "blank", "blank",
        "achievements",
     
    ],
    
})

