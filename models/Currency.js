const mongoose = require('mongoose');

const CurrencySchema = new mongoose.Schema({
	id: String,
	wallet: { type: Number, default: 500 },
	bank: { type: Number, default: 1000 },
});

module.exports = mongoose.model('currencies', CurrencySchema);