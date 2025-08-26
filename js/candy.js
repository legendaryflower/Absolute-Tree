addLayer("c", {
    startData() { return {
        points: new Decimal(0),
        unlocked: true,
        eaten: new Decimal(0),
        thrown: false,
        Candypoints: new Decimal(0),
    }},
    color: "#00bfbf",
    requires() {return new Decimal(10)}, // Can be a function that takes requirement increases into account
    resource: "lollipops", // Name of prestige currency
    baseResource: "candies", // Name of resource prestige is based on
    baseAmount() {return player.c.Candypoints}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() {
        mult = new Decimal(1)
        if (hasUpgrade("c",22))  mult = mult.times(2)
        if (hasUpgrade("c",14)) mult = mult.times(upgradeEffect("c",14))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    layerShown() {return player.t.unlocked&&player.l.tree == "acamaeda"},
    row: 0,
    upgrades: {
        11: {
            title: "Candy Boost",
            description: "Gain twice as many candies.",
            currencyDisplayName: "candies",
            currencyInternalName: "Candypoints",
                    currencyLayer: "c",
            cost: new Decimal(10),
            unlocked() { return true},
        },
        12: {
                        title: "Potential Extreme",
            description: "Discover the power of Lollipops.",
            currencyDisplayName: "candies",
        currencyInternalName: "Candypoints",
        currencyLayer: "c",
            cost: new Decimal(5),
            unlocked() { return hasUpgrade("c",11) },
        },
        13: {
             title: "Candy Obsession",
            description: "Candy generation is faster based on your unspent lollipops.",
            cost: new Decimal(1),
            unlocked() { return hasUpgrade("c",12)  },
            effect() {
                let ret = player.c.points.add(2).pow(0.5)
                if (ret.gte("1e20000000")) ret = ret.sqrt().times("1e10000000")
                return ret;
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        /*
        14: {
            description: "Unspent lollipops boost lollipop gain.",
            cost: new Decimal(5),
            unlocked() { return player.c.upgrades.includes(13) },
            effect() {
                let ret = player.c.points.add(2).pow(0.25) 
                if (ret.gte("1e20000000")) ret = ret.sqrt().times("1e10000000")
                return ret;
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },

        21: {
            description: "Candies boost candy production.",
            cost: new Decimal(100),
            currencyDisplayName: "candies", // Use if using a nonstandard currency
            currencyInternalName: "points", // Use if using a nonstandard currency
            unlocked() { return player.c.upgrades.includes(13) },
            effect() {
                let ret = player.points.add(1).log10().add(1).pow(1.5)
                return ret;
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        22: {
            description: "Double both lollipop and candy gain.",
            cost: new Decimal(25),
            unlocked() { return player.c.upgrades.includes(21) },
        },
        23: {
            description: "Unlock the World Tree.",
            cost: new Decimal(100),
            unlocked() { return player.c.upgrades.includes(21) },
            onPurchase() {player.navTab = "tree-tab"}
        },
        24: {
            description: "Wooden Sword: does 1 damage per second.",
            currencyDisplayName: "candies", // Use if using a nonstandard currency
            currencyInternalName: "points", // Use if using a nonstandard currency
            cost() {return new Decimal(5000)},
            unlocked() { return player.c.upgrades.includes(23)},
        },
        */
    },
doReset() {
         
       player.c.Candypoints = new Decimal(0)
},

    clickables: {
       11: {
          
            display() {
                let dis = "Eat all the candies!"
            
           
                return dis
            },
            canClick() {
                return true
            },
            onClick() {
           player.c.eaten = player.c.eaten.add(player.c.Candypoints).floor()
        player.c.Candypoints = new Decimal(0)
                },
                style: {'height':'32px', 'width':'256px', 'font-size':'13px',
               
            
            },
            
      
        },
           12: {
          
            display() {
                let dis = "Throw 10 candies on the floor"
            
           
                return dis
            },
            canClick() {
                return !player.c.thrown
            },
            onClick() {
          player.c.thrown = true
                },
                style: {'height':'32px', 'width':'256px', 'font-size':'13px',
               
            
            },
            
      
        },
    },

    tabFormat: [
                ["row", 
                    [["column", [["display-text", function() {return 'You have ' + formatWhole(player.c.Candypoints) + ' candies'}],
                        "blank", "blank",
                        ["clickable",11],
                        "blank",
                        ["display-text", function(){return (player.c.eaten.equals(0) ? "\xa0" : ("You have eaten " + formatWhole(player.c.eaten) + " candies!"))}],
                        "blank", "blank",
             ["clickable",12],
                        "blank",
                        ["display-text", function(){return (player.c.thrown ? "No. \\O_O/" : "\xa0")}],
                        "blank", "blank",]],
                    function() {return hasUpgrade("c", 12) ? ["v-line", "250px", {'margin-left': "15px", 'margin-right': "15px"}] : "blank"
                    },

                    function() {return hasUpgrade("c", 12) ? ["column",
                        ["main-display",
                         ["prestige-button",  "Trade all of your candies for "],
                        "blank",]
                    ] : "blank"}]
                ],
                "blank", "blank", "upgrades", "blank",
                ["display-text", function(){return (player.c.Candypoints.gte(10) ? candyMerchant : "\xa0")}, {"font-family": "monospace", "white-space": "pre"}],
                ],
                update(diff) {
			if (player.t.unlocked) player.c.Candypoints = player.c.Candypoints.plus(this.effect().times(diff)).max(0);
			
		},

        effect() {let eff = new Decimal(1)
 if (hasUpgrade("c",11)) eff = eff.times(2)
    if (hasUpgrade("c",13)) eff = eff.times(upgradeEffect("c",13))
            return eff;
        },
})



var candyMerchant = "  \
.---.\xa0\xa0\xa0\xa0\xa0\xa0\n\
|   '.|  __\n\
\xa0| ___.--'  )\n\
_.-'_` _%%%_/\xa0\xa0\n\
\xa0\xa0.-'%%% a: a %%%\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\n\
\xa0\xa0\xa0\xa0\xa0\xa0%%  L   %%_\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\n\
\xa0\xa0\xa0\xa0\xa0\xa0_%\\'-' |  /-.__\xa0\xa0\xa0\xa0\n\
\xa0\xa0\xa0.-' / )--' #/     '\\\xa0\xa0\n\
\xa0\xa0/'  /  /---'(    :   \\\xa0\n\
\xa0/   |  /( /|##|  \\     |\n\
/   ||# | / | /|   \\    \\\n\
|   ||##| I \\/ |   |   _|\n\
|   ||: | o  |#|   |  / |\n\
|   ||  / I  |:/  /   |/\xa0\n\
|   ||  | o   /  /    /\xa0\xa0\n\
|   \\|  | I  |. /    /\xa0\xa0\xa0\n\
\xa0\\  /|##| o  |.|    /\xa0\xa0\xa0\xa0\n\
\xa0\xa0\\/ \::|/\\_ /  ---'|\xa0\xa0\xa0\xa0\xa0\n\
\n\
The candy merchant\n\n\n"
