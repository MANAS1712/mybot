const Guild = require('../models/Guild');
const User = require('../models/User');
const Ticket = require('../models/Ticket');
const Tag = require('../models/Tags');
const Currency = require('../models/Currency');
const Trigger = require('../models/Autoresponse');
const mongoose = require('mongoose');

class DBFunctions {
	constructor() {
		throw new TypeError('DBFunctions is a static class and cannot be instantiated.');
	}

	// Create a connection with the database.
	static async connect(connectionURL) {
		if (!connectionURL) throw new TypeError('A MongoDB connection string was not given.');
		return await mongoose.connect(connectionURL, {
			keepAlive: true,
			useCreateIndex: true,
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useFindAndModify: false,
		});
	}

	// Currency database functions.

	static async getBalance(userID) {
		if (!userID) throw new TypeError('A user ID was not specified');

		const currency = await Currency.findOne({ id: userID });

		if (!currency) {
			const newCurrency = await new Currency({ id: userID });

			const wallet = newCurrency.wallet;
			const bank = newCurrency.bank;
			const bankSpace = newCurrency.bankSpace;

			await newCurrency.save().catch(err => console.log(err));
			return { wallet, bank, bankSpace };
		} else {
			const wallet = currency.wallet;
			const bank = currency.bank;
			const bankSpace = currency.bankSpace;

			return { wallet, bank, bankSpace };
		}
	}

	static async addWallet(userID, amount) {
		if (!userID) throw new TypeError('A user ID was not specified');
		if (!amount) throw new TypeError('An amount was not specified');

		const currency = await Currency.findOne({ id: userID });

		if (!currency) {
			const newCurrency = await new Currency({ id: userID });

			newCurrency.wallet += amount;

			await newCurrency.save().catch(err => console.log(err));
			return { amount };
		} else {
			currency.wallet += amount;

			await currency.save().catch(err => console.log(err));
			return { amount };
		}
	}

	static async removeWallet(userID, amount) {
		if (!userID) throw new TypeError('A user ID was not specified');
		if (!amount) throw new TypeError('An amount was not specified');

		const currency = await Currency.findOne({ id: userID });

		if (!currency) {
			const newCurrency = await new Currency({ id: userID });

			newCurrency.wallet -= amount;

			await newCurrency.save().catch(err => console.log(err));
			return { amount };
		} else {
			currency.wallet -= amount;

			await currency.save().catch(err => console.log(err));
			return { amount };
		}
	}

	static async addBank(userID, amount) {
		if (!userID) throw new TypeError('A user ID was not specified');
		if (!amount) throw new TypeError('An amount was not specified');

		const currency = await Currency.findOne({ id: userID });

		if (!currency) {
			const newCurrency = await new Currency({ id: userID });

			newCurrency.bank += amount;

			await newCurrency.save().catch(err => console.log(err));
			return { amount };
		} else {
			currency.bank += amount;

			await currency.save().catch(err => console.log(err));
			return { amount };
		}
	}

	static async removeBank(userID, amount) {
		if (!userID) throw new TypeError('A user ID was not specified');
		if (!amount) throw new TypeError('An amount was not specified');

		const currency = await Currency.findOne({ id: userID });

		if (!currency) {
			const newCurrency = await new Currency({ id: userID });

			newCurrency.bank -= amount;

			await newCurrency.save().catch(err => console.log(err));
			return { amount };
		} else {
			currency.bank -= amount;

			await currency.save().catch(err => console.log(err));
			return { amount };
		}
	}

	// Guild database functions.

	static async guildDB(guildID) {
		if (!guildID) throw new TypeError('A guild ID was not specified.');

		const guild = await Guild.findOne({ id: guildID });

		if (!guild) {
			const newGuild = await new Guild({ id: guildID });

			const prefixes = newGuild.prefixes;
			const autoResponse = newGuild.autoResponse;
			const premium = newGuild.premium;
			const messageLogsChannel = newGuild.messageLogsChannel;
			const joinLogsChannel = newGuild.joinLogsChannel;
			const joinLogsMessage = newGuild.joinLogsMessage;

			await newGuild.save().catch(err => console.log(err));
			return { prefixes, autoResponse, premium, messageLogsChannel, joinLogsChannel, joinLogsMessage };
		} else {
			const prefixes = guild.prefixes;
			const autoResponse = guild.autoResponse;
			const premium = guild.premium;
			const messageLogsChannel = guild.messageLogsChannel;
			const joinLogsChannel = guild.joinLogsChannel;
			const joinLogsMessage = guild.joinLogsMessage;

			return { prefixes, autoResponse, premium, messageLogsChannel, joinLogsChannel, joinLogsMessage };
		}
	}

	static async guildWelcomeChannel(guildID, channel) {
		if (!guildID) throw new TypeError('A guild ID was not specified.');
		if (!channel) throw new TypeError('A channel was not specified.');

		const guild = await Guild.findOne({ id: guildID });

		if (!guild) {
			const newGuild = new Guild({ id: guildID });

			newGuild.joinLogsChannel = channel;

			await newGuild.save().catch(err => console.log(err));
			return { channel };
		} else {
			guild.joinLogsChannel = channel;

			await guild.save().catch(err => console.log(err));
			return { channel };
		}
	}

	static async guildWelcomeMessage(guildID, content) {
		if (!guildID) throw new TypeError('A guild ID was not specified.');
		if (!content) throw new TypeError('A user entry message was not specified.');

		const guild = await Guild.findOne({ id: guildID });

		if (!guild) {
			const newGuild = new Guild({ id: guildID });

			newGuild.joinLogsMessage = content;

			await newGuild.save().catch(err => console.log(err));
			return { content };
		} else {
			guild.joinLogsMessage = content;

			await guild.save().catch(err => console.log(err));
			return { content };
		}
	}

	static async guildMessagelogsChannel(guildID, channel) {
		if (!guildID) throw new TypeError('A guild ID was not specified.');
		if (!channel) throw new TypeError('A channel was not specified.');

		const guild = await Guild.findOne({ id: guildID });

		if (!guild) {
			const newGuild = new Guild({ id: guildID });

			newGuild.messageLogsChannel = channel;

			await newGuild.save().catch(err => console.log(err));
			return { channel };
		} else {
			guild.messageLogsChannel = channel;

			await guild.save().catch(err => console.log(err));
			return { channel };
		}
	}

	static async guildAutoresponse(guildID, toggle) {
		if (!guildID) throw new TypeError('A guild ID was not specified.');
		if (!toggle) throw new TypeError('A toggle was not specified.');

		const guild = await Guild.findOne({ id: guildID });

		if (!guild) {
			const newGuild = new Guild({ id: guildID });

			if (toggle == 'true') {
				newGuild.autoResponse = true;
			} else {
				newGuild.autoResponse = false;
			}

			await newGuild.save().catch(err => console.log(err));
			return { toggle };
		} else {
			if (toggle == 'true') {
				guild.autoResponse = true;
			} else {
				guild.autoResponse = false;
			}

			await guild.save().catch(err => console.log(err));
			return { toggle };
		}
	}

	static async guildDelete(guildID) {
		if (!guildID) throw new TypeError('A guild ID was not specified.');

		const guild = await Guild.findOne({ id: guildID });
		if (!guild) {
			return;
		} else {
			return await guild.deleteOne({ id: guildID }).catch(err => console.log(err));
		}
	}

	static async guildPremium(guildID, toggle) {
		if (!guildID) throw new TypeError('A guild ID was not specified.');
		if (!toggle) throw new TypeError('A toggle was not specified.');

		const guild = await Guild.findOne({ id: guildID });

		if (!guild) {
			const newGuild = new Guild({ id: guildID });
			if (toggle == 'true') {
				newGuild.premium = true;
			} else {
				newGuild.premium = false;
			}

			await newGuild.save().catch(error => console.log(error));
			return { toggle };
		} else {
			if (toggle == 'true') {
				guild.premium = true;
			} else {
				guild.premium = false;
			}

			await guild.save().catch(error => console.log(error));
			return { toggle };
		}
	}

	// User database functions.

	static async userDB(userID) {
		if (!userID) throw new TypeError('A user ID was not specified.');

		const user = await User.findOne({ id: userID });

		if (!user) {
			const newUser = await new User({ id: userID });

			const ticketsCreated = newUser.ticketsCreated;
			const premium = newUser.premium;

			await newUser.save().catch(err => console.log(err));
			return { ticketsCreated, premium };
		} else {
			const ticketsCreated = user.ticketsCreated;
			const premium = user.premium;

			return { ticketsCreated, premium };
		}
	}

	static async userPremium(userID, toggle) {
		if (!userID) throw new TypeError('A user ID was not specified.');
		if (!toggle) throw new TypeError('A toggle was not specified.');

		const user = await User.findOne({ id: userID });

		if (!user) {
			const newUser = new User({ id: userID });
			if (toggle == 'true') {
				newUser.premium = true;
			} else {
				newUser.premium = false;
			}

			await newUser.save().catch(error => console.log(error));
			return { toggle };
		} else {
			if (toggle == 'true') {
				user.premium = true;
			} else {
				user.premium = false;
			}

			await user.save().catch(error => console.log(error));
			return { toggle };
		}
	}

	// Ticket database functions.

	static async addUserTicketsCreated(userID, ticketId) {
		if (!userID) throw new TypeError('A user ID was not specified.');
		if (!ticketId) throw new TypeError('A ticket ID was not specified.');

		const user = await User.findOne({ id: userID });

		if (!user) {
			const newUser = new User({ id: userID });

			newUser.ticketsCreated.push(ticketId);

			await newUser.save().catch(err => console.log(err));
			return { ticketId };
		} else {
			user.ticketsCreated.push(ticketId);

			await user.save().catch(err => console.log(err));
			return { ticketId };
		}
	}

	static async createUserTicket(userID, ticketContent, ticketID) {
		if (!userID) throw new TypeError('A user ID was not specified.');
		if (!ticketContent) throw new TypeError('The ticket was not specified.');
		if (!ticketID) throw new TypeError('A ticket ID was not specified.');

		const ticket = await new Ticket({
			id: userID,
			ticketContent: ticketContent,
			ticketID: ticketID,
		});

		await ticket.save().catch(err => console.log(err));
		return { ticketContent, ticketID };
	}

	// Tag database functions.

	static async createGuildTag(guildID, cmd, response) {
		if (!guildID) throw new TypeError('A guild ID was not specified.');
		if (!cmd) throw new TypeError('A tag name was not specified.');
		if (!response) throw new TypeError('The tag response was not specified.');

		const tag = await new Tag({
			id: guildID,
			cmd: cmd,
			response: response,
		});

		await tag.save().catch(err => console.log(err));
		return { cmd, response };
	}

	static async deleteGuildTag(guildID, cmd) {
		if (!guildID) throw new TypeError('A guild ID was not specified.');
		if (!cmd) throw new TypeError('A tag name was not specified.');

		const tag = await Tag.findOne({ id: guildID, cmd: cmd });
		if (!tag) {
			return;
		} else {
			await tag.deleteOne();
		}

		return { cmd };
	}

	// Trigger database functions.

	static async createGuildTrigger(guildID, trigger, content) {
		if (!guildID) throw new TypeError('A guild ID was not specified.');
		if (!trigger) throw new TypeError('A trigger name was not specified.');
		if (!content) throw new TypeError('The trigger content was not specified.');

		const autoresponse = await new Trigger({
			id: guildID,
			trigger: trigger,
			content: content,
		});

		await autoresponse.save().catch(err => console.log(err));
		return { trigger, content };
	}

	static async deleteGuildTrigger(guildID, trigger) {
		if (!guildID) throw new TypeError('A guild ID was not specified.');
		if (!trigger) throw new TypeError('A trigger name was not specified.');

		const autoresponse = await Trigger.findOne({ id: guildID, trigger: trigger });
		if (!autoresponse) {
			return;
		} else {
			await autoresponse.deleteOne();
		}

		return { trigger };
	}
}

module.exports = DBFunctions;