const guideDialog = document.getElementById("guide-dialog");
const guideVisualizer = document.getElementById("guide-visualizer");
const letsPlay = document.getElementById("letsplay");

const MARK_GUIDE = `
### Welcome to the Super Trumps Resident Evil web game! Here's a concise guide:

1. **Getting Started:**
   - Familiarize with the interface and buttons.
   - Objective: Win rounds with your best attribute.

2. **Getting Cards:**
   - Click "Shuffle" for a random card each.
   - Start with 10 cards.

3. **Playing a Round:**
   - Choose your attribute and click.

4. **Revealing Cards:**
   - Click "Play" to see the computer's card.
   - Highest attribute wins; ties are draws.

5. **Winning and Losing:**
   - Losing removes a card from your deck.
   - Play until one has no cards left.

6. **Enjoy and Replay:**
   - Have fun with SP-RE 2024!
   - Replay to improve and beat the computer.
`;


if(!localStorage.getItem("sp-re-first-time")){
	guideVisualizer.innerHTML = DOMPurify.sanitize(marked.parse(MARK_GUIDE));
	guideDialog.show();
}
letsPlay.addEventListener("click", () =>{
	if(guideDialog instanceof HTMLDialogElement && guideDialog.open){
		guideDialog.close();
		localStorage.setItem("sp-re-first-time", JSON.stringify(true));
	}
});