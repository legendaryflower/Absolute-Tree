let modInfo = {
	name: "Project: Everything Tree",
	id: "ProjectEverythingTree",
	author: "RTLF2025",
	pointsName: "points",
	modFiles: ["layers.js", "candy.js", "layerLayers.js", "tree.js", "achievements.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (10), // Used for hard resets and new players
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "1.0.5",
	name: "",
}

let changelog = `<h1>Changelog:</h1><br>
<br>
<font color="red"><i><h3>SPOILERS WARNING!</h3></i></font><br><br>
<h3>v1.0.5 - Candy Update</h3><br>
- Added Booster upgrades.<br>
- Added generators.<br>
- Added a new tree layer.<br>
- Balanced up to 100 lollipops.<br>
<br><br>
<h3>v1.0 - Rebrand</h3><br>
- Game has been rebranded to Projecet: Everything Tree, because I don't want to go to my past where I spammed a bunch of random images.<br>
- This game is inspired of The Multitree and Communitree<br>
<br><br>
<h3>v0.3.41 (Balancing Changes)</h3><br>
- Progression during the 11-12 Absolute Points is now a little bit easier.<br><br>
<h3>v0.3.4 (Lani-Loli)</h3><br>
- Added "Iron" layer.<br>
- Added Quantum Masks.<br>
- Reworked a lot of content.<br>
- Added Tactics.<br>
- Fixed Nacho Intubatiers tab that aren't supposed to appear when Apotheic Dimensions 22 isn't purchased.<br>
- Added Exponent Tree.<br>
- Added Lani-Loli (Kos currently).<br>
- Added Quantum Upgrades.<br>
- Balanced up to having 'g' purchased.<br>
<br>
<h3>v0.3.3 Beta</h3><br>


<b>Hotfixes:</b><br>
- Fixed a bug with Absolute Milestones obtaining.<br>
- Made the free levels amount of Points and Multi Points buyables less chunky. (too much zeros).<br>
- Fixed a bug where you can get the You there? achievement anytime without actually unlocking Stabverse.<br><br>
<b>Major changes:</b><br>
- Fixed a bug within purchasing any Axis Squared buyables.<br>
- Added 1 new Normal Tree Layer.<br>
- Added Apotheic Tree Layers.<br>
- After resetting for Session layer for first time, Free Multi Points now gives free levels to Multi Points (buyable).<br>
- Added TPS (Ticks per second) counter below endgame reach text.<br>
- Added QoL tooltips to some upgrades.<br>
- Added 1 more Absolute Buyable.<br>
- Added 2 more Absolute Upgrades.<br>
- Added 3 new Session Upgrades.<br>
- Changed the NaN message to display what caused the NaN bug (Bugged at moment!).<br>
- Added a message after reaching the endgame. The message is below the TPS counter.<br>
- Added Achievements. Right now they are cosmetic and do nothing.<br>
- Balanced up to 1e31 Stabs.<br>
- Changed the win message.<br>
<br>
<h3>v0.3.2 Beta</h3><br>
- Added 1 new Multi Buyable.<br>
- Added 2 more Smackery Alterations.<br>
- Added Sanctuaries and Awakening Forms.<br>
- Added squared forms of Axis.<br>
- Added Celestial Upgrades.<br>
- Added 7 new Session Buyables.<br>
- Balanced up to 1,000 Celestials.<br>
<br>
<h3>v0.3.1 Beta</h3><br>
- Added Smackeries.<br>
- Added Therapy Sessions.<br>
- Added Axis.<br>
- Added Musics. (no, im not copying camellia tree)<br>
- Made the Ichorpuff weaken the softcap.<br>
- Added 40 new Session Upgrades.<br>
- Balanced up to a day duration Fox Music with Smackery Level I.<br>
<br>
<h3>v0.3 Beta</h3><br>
- Font changed into Nova Mono.<br>
- Added a hotkey to reset for Ultra Points.<br>
- Balanced up to Ichorpuff upgrade purchased.<br>
- Added 2 more Absolute Upgrades.<br>
- Completed the Absol Perpetuals mechanic.<br>
- Added Umvuthi, the Sunbird (Mowzie Mob's reference).<br>
- Added 10 new Nursery Upgrades.<br>
- Added 5 new Nursery Buyables.<br>
- Added a joke tree. Try to figure out where it is.<br>
- Added a new layer.<br>
<br>
<h3>v0.2.4 Alpha</h3><br>
- Added Nurses.<br>
- Added 1 new Multi Upgrade.<br>
- Added 7 new Absolute Upgrades.<br>
- Added 1 new Absolute Buyables.<br>
- Added 1 more Absolute Challenge.<br>
- Balanced early game mechanics.<br>
- Balanced up to 1 Absol Perpetual.<br>
<br>
<h3>v0.2.3 Alpha</h3><br>
- Added 3 more Absolute Buyables.<br>
- Added 3 more Absolute Upgrades.<br>
- Balanced up to 1e1,429 Multi Points.<br>
<br>
<h3>v0.2.2 Alpha</h3><br>
- Fixed a typo in upgrade name "Multipotenint".<br>
- Added Absolute Buyables.<br>
- Added Absolute Upgrades.<br>
- Added 3 more Absolute Challenges.<br>
- Added Ultra Points.<br>
- Balanced up to 1e1,045 Multi Points.<br>
<br>
<h3>v0.2.1 Alpha</h3><br>
- Added more upgrades<br>
- Changed the Lucky Chancemakers reward. <br>
- Added a repeatable Absolute Challenge. <br>
- Added 2 more Absolute Milestones. <br>
- Balanced up to 1e285 Multi Points. <br>
<br>
<h3>v0.2 Alpha</h3><br>
- Added a new layer.<br>
- Added 4 new Multi Upgrades.<br>
- Added 2 new Multi Buyables.<br>
- Balanced up to a Lucky Chancemakers completion.<br>
<br>
<h3>v0.1.1 Alpha</h3><br>
- Game is renamed into Absolute Tree to prevent confusion. 
<br><br>
	<h3>v0.1 Alpha</h3><br>
		- Release of the game.`

let winText = `You have beaten the game... After the endgame, the game may not be balanced.`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(1)
 if (hasUpgrade("p",11)) gain = gain.times(upgradeEffect("p",11))
	if (hasUpgrade("p",12)) gain = gain.times(upgradeEffect("p",12))
		if (player.b.unlocked) gain = gain.times(tmp.b.effect)

	if (hasUpgrade("p",16)) gain = gain.times(upgradeEffect("p",16))

	if (player.g.unlocked) gain = gain.times(tmp.g.powerEff)
		if (hasUpgrade("g",15)) gain = gain.pow(1.5)
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [`<span>Current Endgame: Reach 100 Lollipops.`,
function() {return "TPS: "+formatWhole(player.ach.fps)},
]

// Determines when the game "ends"
function isEndgame() {
	return player.c.points.gte(100)
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
	
}
