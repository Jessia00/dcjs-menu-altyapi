const { Client, Intents,Collection } = require('discord.js');
const { MessageActionRow, MessageSelectMenu } = require('discord.js');
const fs = require('fs')
const config = require("./config.js")
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_BANS, Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS, Intents.FLAGS.GUILD_INTEGRATIONS, Intents.FLAGS.GUILD_WEBHOOKS, Intents.FLAGS.GUILD_INVITES, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_MESSAGE_TYPING, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.DIRECT_MESSAGE_REACTIONS, Intents.FLAGS.DIRECT_MESSAGE_TYPING ] });// intentler detayları djs guide adresinde daha iyi bulursunuz.
client.commands = new Collection();
global.client = client;
/// Bilmiyorsanız dokunmayın (events klasörü yükleme) 
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, client));
	} else {
		client.on(event.name, (...args) => event.execute(...args, client));
	}
}

/// Sizleri ilgilendirin kısım
client.on('messageCreate', async message => {

	if (message.content === 'menü-oluştur') {
		const menu = new MessageActionRow()
			.addComponents(
				new MessageSelectMenu()
					.setCustomId('menu1')
					.setPlaceholder('Bir grup seçiniz.')
					.addOptions([
						{
							label: 'Witcher',
							description: 'Witcher grubuna katılmak için tıklayınız.',
							value: 'witcher',
						},
						{
							label: 'Lâmina',
							description: 'Lamina grubuna katılmak için tıklayınız.',
							value: 'lamina',
						},
					]),
			);

		const m = await message.channel.send({  content: 'Grup seçiniz.',components: [menu] });
					
		const collector = m.createMessageComponentCollector({ filter: w=>w.user.id===message.author.id })

		collector.on('collect', async w => {
			if(w.values[0] === 'witcher' || w.values[1] === 'witcher'){
			if(w.member.roles.cache.has(config.Roles.laminaRol)) {
				w.reply({content: `Birden fazla gruba dahil olamazsın.`, ephemeral: true})
			} else {
				if(w.member.roles.cache.has(config.Roles.witcherRol)) {
				w.member.roles.remove(config.Roles.witcherRol)
				w.reply({content: `Başarıyla \`Witcher\` grubundan ayrıldın.`, ephemeral: true})
				} else {
					w.member.roles.add(config.Roles.witcherRol)
					w.reply({content: `Başarıyla \`Witcher\` grubuna katıldın.`, ephemeral: true})
				}
			}}
			if(w.values[0] === 'lamina' || w.values[1] === 'lamina'){
			if(w.member.roles.cache.has(config.Roles.witcherRol)) {
				w.reply({content: `Birden fazla gruba dahil olamazsın.`, ephemeral: true})
			} else {
				if(w.member.roles.cache.has(config.Roles.laminaRol)) {
					w.member.roles.remove(config.Roles.laminaRol)
					w.reply({content: `Başarıyla \`Lâmina\` grubundan ayrıldın.`, ephemeral: true})
				} else {
					w.member.roles.add(config.Roles.laminaRol)
					w.reply({content: `Tebrikler! \`Lâmina\` grubuna dahil oldun.`, ephemeral: true})
				}
			}}
		})
	};
});

client.login(config.Bots.token)