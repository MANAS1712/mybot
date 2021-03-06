const Client = require('./structures/Client');
const chalk = require('chalk');

require('./core/Extensions');
require('dotenv').config();

const client = new Client();

process.on('unhandledRejection', (err) => {
	console.error(`${chalk.red.bold('[Node Error] Unhandled Promise Rejection:')}\n${err.stack}`);
});

process.on('unhandledException', (err) => {
	console.error(`${chalk.red.bold('[Node Error] Unhandled Exception:')}\n${err.stack}`);
});

client.login(process.env.TOKEN);