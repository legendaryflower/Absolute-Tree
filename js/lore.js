addLayer("lore", {
    symbol: "<img src='Lore I.png' style='width:calc(109% - 2px);height:calc(109% - 2px);margin:-5%'></img>", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
	
        
    }},
    color: "darkgray",
   // Can be a function that takes requirement increases into account

    tooltip() {return "Lore I || Aperdinal Stage"},
  
   
    layerShown(){return player.aN.tree == "lore1"},

    infoboxes:{
        beginning: {
            title: "Beginning",
            titleStyle: {'color': 'cyan'},
            body: "After worthwhile of just grinding over Apotheic layers, you decided to advance to the next level of apotheic layers...<br><br>You: What did I do?!<br>???: You have sacrificed your 2 other static Apotheic layers to enhance your powers.<br>You: Wow, I'm like living in the new universe. Is that right?<br>???: I don't know if I can accept, but it's your choice.<br>You: Anyways, who are you?.<br>???: My name is Aperdinal, I am basically controlling over the Aperdinal layers and the Quantum masks part.",
            bodyStyle: {'background-color': "gray"}
        },
        upgrades: {
            title: "Upgrades",
            titleStyle: {'color': 'cyan'},
            body: "Aperdinal: What are you doing? You just unlocked UPGRADES?!.<br>You: Yes, I did.<br>Aperdinal: That's nice of you, just get many upgrades till you'll unlock something good!<br>You: Ok, and what's that something.<br>Aperdinal: I can't tell, just farm more for them!",
            bodyStyle: {'background-color': "gray"},
            unlocked() {return hasMilestone("aperdinal",2)},
                },
                stabverse: {
                    title: "Stabverse",
                    titleStyle: {'color': 'cyan'},
                    body: "You: Ohhh... What is that?<br>Aperdinal: It is a portal to the Stabverse. Come on! Let's go!<br>You: Okay!<br><br>3 minutes later..<br><br>You: Woahhhh, I've never seen this thing before!<br>Aperdinal: You're right, lets go to the stab-placed building that is just a few meters away from us.<br>Stabber #483: *having a good time to stab dummy boxes*<br>Stabber #789: What the heck just happened?<br><br>*a lot of stabbers are talking about these 2 unknown people*<br><br>Stabber Instructor: Hello, yall two, who are you?.<br>Aperdinal: I am Aperdinal, and right here, this is a player to train them as my duty.<br>Stabber Instructor: Hey, player, would you like to be trained on how to play this universe?.<br>You: Yes, I want to be trained!<br>Stabber Instructor: Alright then, let's go.<br><br>15 minutes later of training...<br><br>Stabber Instructor: Congratulations! You just have completed just a few simple trainings, now you can get back to whatever you were disturbed...",
                    bodyStyle: {'background-color': "gray"},
                    unlocked() {return hasUpgrade("aperdinal",14)},
                        },

                    tactics: {
                      title: "Tactics",
                 titleStyle: {'color': 'cyan'},
                  body: "<img src='UR BADDDD.png'><br>You: I've probably heard of tactics, but what is the best one to do?<br>Aperdinal: You just have unlocked a new mechanic. See at the another portal.<br>You: Ok.<br><br>after entering to the portal...<br><br>You: Whoaaa, there's 2 options to pick. Should I pick the searching one, or the book one?<br>Aperdinal: Searching tactic could be recommended, but books are for later on.<br><br><br>Moral of the story: Use tactics wisely to continue doing and having more stuff added. If this isn't the case, maybe you should just use your tactics wisely? Or not (we do know what tactic you use) :) <br><br><h2>Trash stuff (don't read it, why did I made this anyway? 💀)</h2><br>good_player: 580k, i am in a mission to not like stab.io 3 because random contributors<br><br>good_player: bro<br><br> good_player: i will hate it bc 1 more random contributor and i WILL BE DONE, unless if it's <br><br> good_player: good contributor<br><br>good_player: i like it <br><br>good_player: BUT, i hate random developers, unless if it's a good developer",
                      bodyStyle: {'background-color': "gray"},
                     unlocked() {return hasUpgrade("aperdinal",37)},
                 }
    },
   
 
    row: 1, // Row the layer is in on the tree (0 is the first row)
   
    tabFormat: [
    "blank",
    ["infobox", "beginning"],
        "blank",
        ["infobox", "upgrades"],
        "blank",
        ["infobox", "stabverse"],
        "blank",
        ["infobox", "stabverse2"],
        "blank",
        ["infobox", "tactics"],
        "blank",
    ],
})