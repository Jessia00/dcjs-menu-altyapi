const { Client, Intents,Collection, interaction, MessageActionRow, MessageSelectMenu } = require('discord.js');
const { on } = require('events');
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
	};
});

client.on("interactionCreate", async(interaction) => {
	if(interaction.values[0] === 'witcher' || interaction.values[1] === 'witcher'){
		if(!interaction.member.roles.cache.has(config.Roles.laminaRol)){
			if(!interaction.member.roles.cache.has(config.Roles.witcherRol)) {
				await interaction.member.roles.add(config.Roles.witcherRol).catch(err => {})
				await interaction.reply({content: 'Başarıyla \`witcher\` grubuna katıldın.', ephemeral: true})
			} else {
				await interaction.member.roles.remove(config.Roles.witcherRol).catch(err => {})
			    await interaction.reply({content: 'Başarıyla \`witcher\` grubundan ayrıldın.', ephemeral: true})
			}
		} else {
			await interaction.reply({content: 'Birden fazla gruba dahil olamazsın.', ephemeral: true})
		}
	} else {
		if(!interaction.member.roles.cache.has(config.Roles.witcherRol)){
			if(!interaction.member.roles.cache.has(config.Roles.laminaRol)){
				await interaction.member.roles.add(config.Roles.laminaRol).catch(err => {})
				await interaction.reply({content: 'Başarıyla \`lâmina\` grubuna katıldın.', ephemeral: true})
			} else {
				await interaction.member.roles.remove(config.Roles.laminaRol).catch(err => {})
				await interaction.reply({content: 'Başarıyla \`lâmina\` grubundan ayrıldın.', ephemeral: true})
			}
		} else {
			await interaction.reply({content: 'Birden fazla gruba dahil olamazsın.', ephemeral: true})
		}
	}

}) 

client.login(config.Bots.token)