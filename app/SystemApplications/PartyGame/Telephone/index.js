import Host from "../../../util/system/ipcModules/Host.js";
import PartyGameGame from "../PartyGameGame/index.js";
import PartyGameGameLobby from "../PartyGameGame/Lobby/index.js";

class Telephone extends PartyGameGame {
	static Icon = class Icon extends super.Icon {
		style = this.autoStyleByImport(import.meta.url);
		render() {
			const target = super.render();
			
			return target;
		}
	}
	
	style = this.autoStyleByImport(import.meta.url);
	
	async open() {
		const server = await this.createServer(this.path(import.meta.url, "client"));
		
		const lobby = new PartyGameGameLobby(server);
		lobby.open();
		
		
	}
}

export default Telephone;