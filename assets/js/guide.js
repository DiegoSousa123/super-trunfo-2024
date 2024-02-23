const guideDialog = document.getElementById("guide-dialog");
const guideVisualizer = document.getElementById("guide-visualizer");
const letsPlay = document.getElementById("letsplay");

const MARK_GUIDE = `
### Welcome to the Super Trumps Resident Evil!

1. **Getting Started:**
   - Objective: Win rounds with your best attribute.

2. **Getting Cards:**
   - Click "Shuffle" for a random card each.
   - Start with 10 cards.

3. **Playing a Round:**
   - Choose your attribute clicking on it.
   - Click "Play" to see the computer's card and check who wins the round.
   - Highest attribute wins.

4. **Winning and Losing:**
   - Losing removes a card from the defeated player.
   - Play until one has no cards left.

5. **Enjoy and Replay:**
   - Have fun with SP-RE 2024!
`;

if (!localStorage.getItem("sp-re-first-time")) {
	guideVisualizer.innerHTML = DOMPurify.sanitize(marked.parse(MARK_GUIDE));
	guideDialog.show();
}
letsPlay.addEventListener("click", () => {
	if (guideDialog instanceof HTMLDialogElement && guideDialog.open) {
		guideDialog.close();
		localStorage.setItem("sp-re-first-time", JSON.stringify(true));
	}
});
