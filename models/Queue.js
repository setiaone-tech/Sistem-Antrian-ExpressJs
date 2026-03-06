const mongoose = require('mongoose');

const QueueSchema = new mongoose.Schema({
    queue_number: { type: Number, required: true },
    customer_name: { type: String, required: true },
    customer_phone: { type: String, required: true },
    verification_code: { type: String, required: true },
    status: { type: String, enum: ['waiting', 'Telah Diproses'], default: 'waiting' },
    date_string: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

QueueSchema.index({ queue_number: 1, date_string: 1 }, { unique: true });
QueueSchema.index({ customer_name: 'text', customer_phone: 1 });

module.exports = mongoose.model('Queue', QueueSchema);