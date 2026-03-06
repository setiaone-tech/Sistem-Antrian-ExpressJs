require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const path = require('path');
const PDFDocument = require('pdfkit');
const crypto = require('crypto');

const Queue = require('./models/Queue');
const Counter = require('./models/Counter');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/queue_system')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB Error:', err));

const getTodayString = () => new Date().toISOString().split('T')[0];

app.get('/', async (req, res) => {
    const today = getTodayString();
    const lastCounter = await Counter.findOne({ date_string: today });
    const currentNumber = lastCounter ? lastCounter.last_number : 0;
    res.render('user', { currentNumber });
});

app.post('/ambil-antrian', async (req, res) => {
    try {
        const { name, phone } = req.body;
        const today = getTodayString();
        const verificationCode = crypto.randomBytes(3).toString('hex').toUpperCase();

        const counter = await Counter.findOneAndUpdate(
            { date_string: today },
            { $inc: { last_number: 1 } },
            { upsert: true, returnDocument: 'after' }
        );

        const nextNumber = counter.last_number;

        const newQueue = new Queue({
            queue_number: nextNumber,
            customer_name: name,
            customer_phone: phone,
            verification_code: verificationCode,
            date_string: today
        });
        await newQueue.save();

        io.emit('new-queue', {
            _id: newQueue._id,
            queue_number: nextNumber,
            customer_name: name,
            customer_phone: phone,
            time: newQueue.createdAt.toLocaleTimeString('id-ID')
        });

        // GENERATE PDF
        const doc = new PDFDocument({ size: [300, 450], margin: 20 });
        
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=Antrian-${nextNumber}.pdf`);

        doc.font('Helvetica-Bold').fontSize(18).text('TIKET ANTRIAN', { align: 'center' });
        doc.moveDown();
        doc.fontSize(60).text(nextNumber, { align: 'center' });
        doc.fontSize(14).text(name, { align: 'center' });
        doc.fontSize(10).text(today, { align: 'center' });
        
        doc.moveDown(2);
        doc.fontSize(12).text('KODE VERIFIKASI:', { align: 'center' });
        doc.rect(50, 240, 200, 40).stroke();
        doc.fontSize(22).text(verificationCode, 50, 250, { align: 'center' });
        
        doc.moveDown(3);
        doc.fontSize(9).fillColor('gray').text('Tunjukkan kode ini ke petugas saat dipanggil.', { align: 'center' });
        
        doc.pipe(res);
        doc.end();

    } catch (error) {
        console.error(error);
        res.status(500).send("Gagal memproses antrian.");
    }
});

app.get('/admin', async (req, res) => {
    const today = getTodayString();
    const list = await Queue.find({ date_string: today }).sort({ queue_number: 1 });
    res.render('admin', { list });
});

app.post('/admin/panggil/:id', async (req, res) => {
    try {
        const queue = await Queue.findById(req.params.id);
        if (!queue) return res.status(404).send();

        io.emit('status-updated', {
            status: 'Sedang Dipanggil',
            queue_number: queue.queue_number,
            customer_name: queue.customer_name
        });

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false });
    }
});

app.post('/admin/verify-and-process', async (req, res) => {
    try {
        const { id, code } = req.body;
        const today = getTodayString();
        const queue = await Queue.findById(id);

        if (queue && queue.verification_code === code.toUpperCase()) {
            queue.status = 'Telah Diproses';
            await queue.save();

            io.emit('status-finalized', { id: queue._id });

            const nextInLine = await Queue.findOne({ 
                date_string: today, 
                status: 'waiting' 
            }).sort({ queue_number: 1 });

            io.emit('auto-next', {
                hasData: !!nextInLine,
                queue_number: nextInLine ? nextInLine.queue_number : '---',
                customer_name: nextInLine ? nextInLine.customer_name : 'Menunggu Antrian Baru'
            });

            return res.json({ success: true });
        }
        
        res.status(400).json({ success: false, message: "Kode tidak valid" });
    } catch (error) {
        res.status(500).json({ success: false });
    }
});

app.get('/display', async (req, res) => {
    const today = getTodayString();
    
    const currentCalling = await Queue.findOne({ 
        date_string: today, 
        status: 'Telah Diproses' 
    }).sort({ updatedAt: -1 });

    const waitingList = await Queue.find({ 
        date_string: today, 
        status: 'waiting' 
    }).sort({ createdAt: -1 }).limit(5);

    res.render('display', { currentCalling, waitingList });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});