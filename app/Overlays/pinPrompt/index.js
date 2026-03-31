import Web from "../../util/system/ipcModules/Web.js";
import Dialog from "../../renderable/Dialog/index.js";

let shouldHideUntil = 0;
Web.handle("pinDisplay", async (pin) => {
	if(Date.now() < shouldHideUntil) return;
	
	while(true) {
		if(await Dialog.ask({
			prompt: "Another device is attempting to connect to the\nOnline Settings page, but needs a PIN.\n\n"
				+ "Would you like to see the PIN now?",
			buttons: [
				{
					text: "Yes, show PIN",
					value: true
				},
				{
					text: "Hide for 1 hour",
					value: false
				}
			]
		})) {
			await Dialog.ask({
				prompt: "Your one-time PIN is:\n\n"+pin,
				buttons: [
					{
						text: "Okay"
					}
				]
			});
		} else {
			shouldHideUntil = Date.now() + 60 * 60 * 1000;
			await Dialog.ask({
				prompt: "Pop-ups have been disabled for 1 hour.\nRestart this device to show them again.",
				buttons: [
					{
						text: "Okay"
					}
				]
			});
		}
		return;
	}
})

export default {};
