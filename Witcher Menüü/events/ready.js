const config = require("../config.js")
module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		client.user.setPresence({ activities: [{ type: "WATCHING", name: `WITCHER 💖 ${config.Bots.status}`}], status: 'dnd' })
		
		console.log(`${client.user.tag} olarak giriş yapıldı.`);
	},
};