addLayer("l", {
    name: "Layers", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "L", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        tree: "jacorb",
    }},
    color: "#414141",
   
    row: "side", // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    tooltip() {return "Layers"},

     tabFormat: {
        "Layers": {
         
            content: ["blank",
           
             ["display-text", function() { return "<h3>The Layers System</h3>" }],       
            "blank",
            "blank",
          ["display-text", function() { return "Each tree world has a different set of layers." }],       
          "clickables",
        ]},
       
    },
      clickables:{
        11: {
          
            display() {
                let dis = "Click to view Jacorb's layers"
            
           
                return dis
            },
            canClick() {
                return true
            },
            onClick() {
             player.l.tree = "jacorb"
                },
                style: {'height':'64px', 'width':'128px', 'font-size':'13px',
               
            
            },
            
      
        },
         12: {
          
            display() {
                let dis = "Click to view Acamaeda's layers"
            
           
                return dis
            },
            canClick() {
                return false
            },
            tooltip() {return "Coming soon!"},
            onClick() {
             player.l.tree = "jacorb"
                },
                style: {'height':'64px', 'width':'128px', 'font-size':'13px',
               
            
            },
            
      
        },
    },
})