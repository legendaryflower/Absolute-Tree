let modInfo = {
	name: "Absolute Tree",
	id: "AbsoluteTree",
	author: "RTLF2024",
	pointsName: "points",
	modFiles: ["layers.js", "tree.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (10), // Used for hard resets and new players
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.2.4",
	name: "Alpha",
}

let changelog = `<h1>Changelog:</h1><br>
<br>
<font color="red"><i><h3>SPOILERS WARNING!</h3></i></font><br><br>
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

let winText = `Congratulations! You have reached the end and beaten this game, but for now...`

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
	if (hasUpgrade("m",11)) gain = gain.times(2)
	if (hasUpgrade("m",12)) gain = gain.times(upgradeEffect("m",12))
	if (hasUpgrade("m",13)) gain = gain.times(upgradeEffect("m",13))
	if (hasUpgrade("m",15)) gain = gain.times(upgradeEffect("m",15))
	if (hasUpgrade("a",12)) gain = gain.times(upgradeEffect("a",12))
	if (hasUpgrade("m",33)) gain = gain.pow(1.2)
	if (inChallenge("a",21)) gain = gain.root(1e27)
	if (player.a.unlocked) gain = gain.times(tmp.a.effect)
	if (player.m.unlocked) gain = gain.times(tmp.m.buyables[11].effect.first);
	if (hasUpgrade("a",21)) gain = gain.times(tmp.a.buyables[12].effect.first);
	if (hasUpgrade("a",31)) gain = gain.pow(upgradeEffect("a",31))

	if (player.n.unlocked) gain = gain.times(tmp.n.buyables[11].effect.first);
	if (hasUpgrade("n",11)) gain = gain.times(upgradeEffect("n",11));
    if (getClickableState('n', 12)) gain = gain.pow(1.2)
	if (inChallenge("a",32)) gain = gain.pow(0.08)
	if (hasUpgrade("a",36)) gain = gain.pow(tmp.n.buyables[12].effect.first);
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [`<span>Current Endgame: 1 Absol Perpetual`,
]

// Determines when the game "ends"
function isEndgame() {
	return player.n.absolPer.gte(1)
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