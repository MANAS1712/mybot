const { version: djsversion } = require('discord.js');

module.exports = {
	name: 'statistics',
	description: 'View some basic bot statistics',
	async execute(interaction) {
		const { client } = interaction;

		const embed = {
			fields: [
				{
					name: 'Cache',
					value:
                `**Channels**: ${client.channels.cache.size.toLocaleString()
                }\n` +
                `**Emotes**: ${client.emojis.cache.size.toLocaleString()}\n` +
                `**Guilds**: ${client.guilds.cache.size.toLocaleString()}\n` +
                `**Users**: ${client.users.cache.size.toLocaleString()}\n`,
					inline: false,
				},
				{
					name: 'Data',
					value:
                `**Uptime**: ${client.utils.parseTime(Math.round(client.uptime / 1000),
                )}\n` +
                `**Discord API Websocket Ping**: ${Math.round(client.ws.ping)}ms\n` +
				`**Message Latency**: ${Date.now() - interaction.createdTimestamp}ms\n` +
				`**RAM**: ${client.utils.formatBytes(process.memoryUsage().heapUsed)}\n`,
				},
			],
			color: 0x009874,
			title: 'Bot Statistics',
			footer: {
				text: `Bot Commands: ${client.commands.size.toLocaleString()} | Discord.js version: ${djsversion}`,
			},
			thumbnail: {
				url: client.user.displayAvatarURL({ dynamic: true, size: 1024 }),
			},
		};

		await interaction.reply({ embeds: [embed] });
	},
};