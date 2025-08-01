// Flood Web Ring and Flood Toy!

// Super Object!
let flood = {};

// Settings
//flood.serverURL = "http://localhost:3000"; // For testing - Please ignore!
flood.ringPage = "https://melonking.net/free/software/flood.html"; // Do not edit!
flood.ringTarget = "_blank";
flood.texture = "https://melonking.net/images/flood-water.png";
flood.textureWidth = 314;
flood.textureHeight = 98;
flood.drainSound = "https://melonking.net/audio/ui/flush.mp3";
flood.drainTooSoonSound = "https://melonking.net/audio/ui/clunk.mp3";
flood.updateSpeed = 5000; // Please do not lower!
flood.changeStep = 0.1;
flood.includeInfo = false; // Returns a list of all sites who are flooded.
flood.disableInFrames = false; // Stop the script running in frames
flood.disableMessages = false; // Hides the info message.

flood.msg = {};
flood.msg.info = "&#x1FAA3;";
flood.msg.rising = "The water level is rising...";
flood.msg.falling = "The water level is falling...";
flood.msg.toosoon = "Its too soon to bilge again!";
flood.msg.one = "This page has a harmless leak.";
flood.msg.two = "It looks like the page has a bad leak!";
flood.msg.three = "Goodness, this page has a major leak!";
flood.msg.four = "Oh my, there's flood on this page!";
flood.msg.five = "The page is deep under water!";
flood.msg.six = "This page is totaly submerged!";

// Active vars, do not edit!
flood.updateLoop = undefined;
flood.renderLoop = undefined;
flood.lastBilge = 0;
flood.logicLevel = 100;
flood.level = 100;
flood.info = undefined;

// HTML references!
flood.html = {};
flood.html.flood = undefined;
flood.html.menu = undefined;
flood.html.message = undefined;

flood.audio = {};
flood.audio.flush = undefined;
flood.audio.clunk = undefined;

// Setup event!
window.addEventListener("DOMContentLoaded", async () => {
    if (flood.disableInFrames && window !== window.parent) {
        flood.updateLoop = setInterval(flood.updateSpeed);
        console.log("Flood render disabled becouse of the frame!");
        return;
    }

    document.body.insertAdjacentHTML(
        "beforeend",
        `
	<svg id="flood" viewBox="0 24 150 450" preserveAspectRatio="none" shape-rendering="auto">
		<defs>
			<path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v450h-352z" />
			<pattern id="water" patternUnits="userSpaceOnUse" width="${flood.textureWidth}" height="${flood.textureHeight}">
				<image xlink:href="${flood.texture}" x="0" y="0" width="${flood.textureWidth}" height="${flood.textureHeight}"></image>
			</pattern>
		</defs>
		<g class="wave">
			<use xlink:href="#gentle-wave" x="48" y="0" />
			<use xlink:href="#gentle-wave" x="48" y="3" />
			<use xlink:href="#gentle-wave" x="48" y="5" />
		</g>
	</svg>

	<div id="flood-menu">
		<span id="flood-message"></span>
		<a href="${flood.ringPage}" target="${flood.ringTarget}"><button>${flood.msg.info}</button></a>
	</div>`
    );

    flood.html.flood = document.getElementById("flood");
    flood.html.menu = document.getElementById("flood-menu");
    flood.html.message = document.getElementById("flood-message");

    flood.audio.flush = new Audio(flood.drainSound);
    flood.audio.clunk = new Audio(flood.drainTooSoonSound);

    if (flood.disableMessages) {
        flood.html.message.style.display = "none";
    }


// Issue a bilge request!
function doBilge() {
    if (Date.now() - flood.lastBilge < flood.bilgeDelay) {
        // Its too soon to bilge again!
        flood.audio.clunk.currentTime = 0;
        flood.audio.clunk.play();
        flood.html.message.innerHTML = flood.msg.toosoon;
        return;
    }
    flood.lastBilge = Date.now();
    flood.audio.flush.currentTime = 0;
    flood.audio.flush.play();
}

// Communicate with the flood server!
// PATCHED BY MATVEYMAYNER!

// Update the visuals
function renderWater() {
    if (flood.logicLevel == flood.level) {
        return; // Save the processing time, nothing to do!
    }
    let renderLevel = Number(flood.html.flood.style.top.replace("%", "")); // 0 is top
    flood.logicLevel = flood.maxLevel - renderLevel; // 100 is top e.g. equal to servers 100% full
    if (flood.level > flood.logicLevel) {
        flood.html.flood.style.top = renderLevel - flood.changeStep + "%";
        flood.html.message.innerHTML = flood.msg.rising;
    } else if (flood.level < flood.logicLevel) {
        flood.html.flood.style.top = renderLevel + flood.changeStep + "%";
        flood.html.message.innerHTML = flood.msg.falling;
    } else {
        if (flood.level > 90) {
            flood.html.message.innerHTML = flood.msg.six;
        } else if (flood.level > 70) {
            flood.html.message.innerHTML = flood.msg.five;
        } else if (flood.level > 50) {
            flood.html.message.innerHTML = flood.msg.four;
        } else if (flood.level > 30) {
            flood.html.message.innerHTML = flood.msg.three;
        } else if (flood.level > 10) {
            flood.html.message.innerHTML = flood.msg.two;
        } else {
            flood.html.message.innerHTML = flood.msg.one;
        }
    }
}})