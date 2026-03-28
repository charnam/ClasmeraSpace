class ConnectionHelpers {
	static async ensureAuthPermission(permission) {
		const loader = new LoadingScreen();
		loader.show();
		if((await this.invoke("checkPermission", permission))) {
			loader.remove();
			return;
		}
		
		await Dialog.ask({
			prompt: "When you're ready, click the button below, and a short code will be displayed on the other device.",
			buttons: [
				{
					text: "Show code",
					value: null
				}
			]
		})
		
		await this.invoke("requestPermission", permission);
		loader.remove();
		
	}
	
}

export default ConnectionHelpers;