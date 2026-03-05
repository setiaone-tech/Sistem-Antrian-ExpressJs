const mongoose = require('mongoose');

const CounterSchema = new mongoose.Schema({
    date_string: { type: String, required: true, unique: true },
    last_number: { type: Number, default: 0 }
});

module.exports = mongoose.model('Counter', CounterSchema);