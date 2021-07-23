const Client = require('./structures/Client');
const chalk = require('chalk');

require('./core/Extensions');
require('dotenv').config();

process.on('unhandledRejection', err => console.error(`${chalk.red.bold('Unhandled Promise Rejection:')}\n${err.stack}`));

const client = new Client({
	intents: 32767,
	allowedMentions: { parse: ['users', 'roles'], repliedUser: false },
	partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'GUILD_MEMBER', 'USER'],
});

client.login(process.env.TOKEN);