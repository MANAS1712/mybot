const Ticket = require('../../models/Ticket');
const User = require('../../models/User');
const { WebhookClient, MessageEmbed } = require('discord.js');
const ticketWebhook = new WebhookClient(process.env.TICKETWEBHOOKID, process.env.TICKETWEBHOOKTOKEN);

module.exports = {
	name: 'ticket',
	description: 'Do ticket stuff.',
	usage: '<view=ticketID|create=content>',
	example: ['ticket create bad user scammed 10mil', 'ticket uNjjd'],
	botPermissions: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'EMBED_LINKS', 'READ_MESSAGE_HISTORY'],
	args: true,
	cooldown: 10,
	async execute(message, { args }) {
		const { client } = message;
		const errorEmbed = (msg) => client.makeEmbed({ description: msg, timestamp: message.createdAt });
		if (!['create', 'view', 'list'].includes(args[0].toLowerCase())) return message.reply({ embeds: [errorEmbed('The inputed parameter is invalid, please try again.')] });

		if (args[0].toLowerCase() === 'create') {
			const ticketId = client.utils.generateString(5);
			const content = args.slice(1).join(' ');
			if (!content) return message.reply({ embeds: [errorEmbed('You need to add a ticket query, or else opening a ticket is useless.')] });
			const ticket = await new Ticket({
				id: message.author.id,
				ticketContent: content,
				ticketID: ticketId,
			});

			await User.findOne({ id: message.author.id }, async (err, data) => {
				if (err) throw err;
				if (data) {
					data.ticketsCreated.push(ticketId);
					await data.save();
				} else if (!data) {
					const newUser = new User({
						id: message.author.id,
						ticketsCreated: data?.ticketsCreated.push(ticketId),
					});
					await newUser.save();
				}
			});

			await ticket.save().catch(err => console.log(err));
			message.channel.send({ content: `You have successfully opened a query ticket. Your ticket ID is \`${ticketId}\`.` });
			ticketWebhook.send({ embeds: [new MessageEmbed().setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true })).setDescription(`${message.author.tag} (${message.author.id}) has created a ticket with ${client.user}.`).addField('Created at', `${new Date()}`, true).addField('Ticket Query', `${content}`, true).addField('Ticket ID', `\`${ticketId}\``, true).setTimestamp().setColor('RANDOM')] });

		} else if (args[0].toLowerCase() === 'view' && client.botmoderators.includes(message.author.id)) {
			const ticketID = args[1];
			const ticket = await Ticket.findOne({
				ticketID: ticketID,
			});

			if (!ticket) {
				message.reply({ embeds: [errorEmbed(`No ticket was found with the ID: \`${ticketID}\`. What are you even doing man?`)] });
			} else {
				const user = await client.users.fetch(ticket.id).catch(() => null);
				if (!user) return message.reply({ embeds: [errorEmbed('I could not fetch that user.')] });

				const embed = client.makeEmbed()
					.setAuthor(`${user.tag}'s Ticket`, user.displayAvatarURL({ dymanic: true }))
					.addField('Ticket Content', `${ticket.ticketContent}`, true)
					.addField('Ticket ID', `${ticket.ticketID}`, true)
					.addField('Created at', `${ticket.createdAt}`, true)
					.setFooter(`User ID: ${user.id}`)
					.setTimestamp();
				message.channel.send({ embeds: [embed] });
			}
		} else if (args[0].toLowerCase() === 'list' && client.botmoderators.includes(message.author.id)) {
			const user = await client.users.fetch(args[0]).catch(() => null);
			const ticket = await User.findOne({ id: user?.id });

			if (!ticket || !ticket.length) return message.reply({ embeds: [errorEmbed('This user does not have any pending tickets.')] });

			const embed = client.makeEmbed()
				.setAuthor(`${user.tag}'s Created Ticket IDs`, user.displayAvatarURL({ dymanic: true }))
				.setDescription(`\`${ticket?.ticketsCreated.join('\n')}\``)
				.setFooter(`User ID: ${user.id}`)
				.setTimestamp();
			message.channel.send({ embeds: [embed] });
		}
	},
};