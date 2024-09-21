let modInfo = {
	name: "Absolute Tree",
	id: "AbsoluteTree",
	author: "RTLF2024",
	pointsName: "points",
	modFiles: ["layers.js", "tree.js", "achievements.js", "apotheicLayers.js", "lore.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (10), // Used for hard resets and new players
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.3.41",
	name: "",
}

let changelog = `<h1>Changelog:</h1><br>
<br>
<font color="red"><i><h3>SPOILERS WARNING!</h3></i></font><br><br>
<h3>v0.3.41</h3><br>
- Progression during the 11-12 Absolute Points is now a little bit easier.
<br>
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

	if (hasUpgrade("m",11)) gain = gain.times(2)
	if (hasUpgrade("m",12)) gain = gain.times(upgradeEffect("m",12))
	if (hasUpgrade("m",13)) gain = gain.times(upgradeEffect("m",13))
	if (hasUpgrade("m",15)) gain = gain.times(upgradeEffect("m",15))
	if (hasUpgrade("a",12)) gain = gain.pow(upgradeEffect("a",12))
	if (hasUpgrade("m",33)) gain = gain.pow(1.2)
	if (hasUpgrade("m",57)) gain = gain.pow(1.05)
	if (inChallenge("a",21)) gain = gain.root(1e27)
	if (hasAchievement("ach",21)) gain = gain.pow(1.2)
	if (player.a.unlocked) gain = gain.times(tmp.a.effect)
	if (player.m.unlocked) gain = gain.times(tmp.m.buyables[11].effect.first);
	if (hasUpgrade("a",21)) gain = gain.times(tmp.a.buyables[12].effect.first);
	if (hasUpgrade("a",31)) gain = gain.pow(upgradeEffect("a",31))

	if (player.n.unlocked) gain = gain.times(tmp.n.buyables[11].effect.first);
	if (hasUpgrade("n",11)) gain = gain.times(upgradeEffect("n",11));
 
	if (inChallenge("a",32)) gain = gain.pow(0.08)
	if (hasUpgrade("a",35)) gain = gain.pow(tmp.n.buyables[12].effect.first);
	if (hasUpgrade("n",16)) gain = gain.times(upgradeEffect("n",16));
	if (hasUpgrade("n",23)) gain = gain.times(upgradeEffect("n",23));
	

	if (hasAchievement("ach",34)) gain = gain.times(tmp.m.buyables[23].effect.first)
	if (hasAchievement("ach",55)) gain = gain.pow(1.01)
	if (hasUpgrade("m",55)) gain = gain.pow(1.11)
	if (hasUpgrade("s",15)) gain = gain.times(upgradeEffect("s",15))
	if (hasUpgrade("m",31)) gain = gain.pow(upgradeEffect("m",31))
	if (hasUpgrade("s",23)&&!hasAchievement("ach",62)) gain = gain.div(tmp.s.theraEffect)
	if (hasAchievement("ach",63)) gain = gain.pow(Decimal.pow(1.005, player.s.makeraxisZ))
	if (hasUpgrade("s",36)) gain = gain.times(upgradeEffect("s",36))
	if (hasUpgrade("s",56)) gain = gain.pow(1.3)
	if (hasMilestone("sm",0)) gain = gain.pow(1.05)
	if (hasUpgrade("s",103)) gain = gain.times(upgradeEffect("s",103))
	if (hasUpgrade("s",104)) gain = gain.times(upgradeEffect("s",104))
	if (hasUpgrade("s",105)) gain = gain.times(upgradeEffect("s",105))
	if (hasUpgrade("s",107)) gain = gain.times(upgradeEffect("s",107))
	if (hasMilestone("sm",2)) gain = gain.times(tmp.s.Buyable41Eff)

	if (player.ab.unlocked) gain = gain.times(tmp.ab.effect)
	if (hasUpgrade("aP",13)) gain = gain.times(upgradeEffect("aP",13))
	if (hasUpgrade("aP",21)) gain = powExp(gain,1.01)
	if (hasUpgrade("a",47)) gain = powExp(gain,1.001)
	if (hasUpgrade("aP",25)) gain = gain.pow(1.05)
	if (hasUpgrade("m",44)) gain = gain.times(tmp.m.buyables[22].effect.first);
	if (hasUpgrade("aM",12)) gain = gain.pow(upgradeEffect("aM",12))
	if (hasUpgrade("aD",25)) gain = gain.times(upgradeEffect("aD",25))
	if (hasUpgrade("aD",34)) gain = gain.pow(1.01)
	if (hasUpgrade("aM",13)) gain = gain.times(tmp.aP.buyables[11].effect.first);
	if (getBuyableAmount("ab",11).gte(4)) gain = gain.times(tmp.aT.effect)

	
	if (hasMilestone("aperdinal",0)) gain = gain.pow(1.1)
	if (hasUpgrade("aperdinal",11)) gain = gain.pow(1.005)
	if (hasMilestone("aperdinal",10)) gain = powExp(gain,1.001)
	if (hasUpgrade("aperdinal",21)) gain = gain.times(upgradeEffect("aperdinal",21))
	if (hasUpgrade("aperdinal",85)) gain = gain.pow(1.01)
	if (hasUpgrade("aN",11)) gain = gain.pow(tmp.aperdinal.tosKosEff)
	if (hasUpgrade("aN",11)) gain = gain.times(upgradeEffect("aN",11))
	if (hasAchievement("ach",122)) gain = powExp(gain,1.001)
	if (gain.gte("1e30000")) return new Decimal("1e30000")
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [`<span>Current Endgame: 'g' Purchased.`,
function() {return "TPS: "+formatWhole(player.ach.fps)},
() => player.ab.unlocked&&!getBuyableAmount("ab",11).gte(4) ? '<small><font color="gray">To continue progressing, click/tap on the yellow side layer<br>and click on "Click here to switch to Apotheic Tree"</font></small>.' : '',
() => hasMilestone("aperdinal",0)&&!hasUpgrade("aN",13) ? '<small><font color="gray">There is lore about Aperdinal layer, to view click/tap on the yellow side layer<br>and click on "Aperdinality Lore"</font></small>.' : '',
() => hasUpgrade("aN",13) ? '<small><font color="purple">After endgame, the game may not be balanced.' : '',
]

// Determines when the game "ends"
function isEndgame() {
	return hasUpgrade("aN",13)
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
