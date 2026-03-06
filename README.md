# Sistem Antrian Toko Real-Time (Socket.io)

Sistem antrian berbasis web yang dirancang untuk kecepatan, keamanan, dan sinkronisasi data secara instan. Mendukung pendaftaran mandiri pelanggan, sistem verifikasi tiket PDF, dan monitor TV ruang tunggu yang otomatis.



## Fitur Utama
* **Real-time Update**: Sinkronisasi data antar perangkat (User, Admin, Display) tanpa refresh halaman menggunakan **Socket.io**.
* **Atomic Numbering**: Sistem penomoran cerdas menggunakan MongoDB `findOneAndUpdate` yang menjamin tidak ada nomor ganda meskipun banyak pelanggan mendaftar bersamaan.
* **Auto-Generate Tiket PDF**: Pelanggan mendapatkan bukti antrian berupa PDF yang diunduh otomatis berisi **Kode Verifikasi Unik**.
* **Alur 2-Tahap Admin**: Petugas dapat "Memanggil" nomor ke layar TV terlebih dahulu, lalu memverifikasi pelanggan dengan kode unik sebelum menyelesaikan sesi.
* **Monitor Display Cerdas**: Layar TV menampilkan antrian utama yang sedang diproses dan daftar 5 antrian terbaru yang masuk di sidebar.
* **Auto-Next**: Monitor TV otomatis memperbarui tampilan ke antrian berikutnya secara cerdas saat verifikasi selesai dilakukan oleh admin.

---

## Prasyarat (Prerequisites)
Pastikan perangkat Anda sudah terinstal:
* [Node.js](https://nodejs.org/) (Versi 16 atau lebih baru)
* [MongoDB](https://www.mongodb.com/try/download/community) (Lokal atau MongoDB Atlas)

---

## Cara Instalasi

1. **Clone Project**
   ```bash
   git clone [https://github.com/setiaone-tech/Sistem-Antrian-ExpressJs.git](https://github.com/setiaone-tech/Sistem-Antrian-ExpressJs.git)
   cd Sistem-Antrian-ExpressJs```

2. **Install Library**
   ```bash
   npm install express mongoose socket.io pdfkit dotenv```

3. **Konfigurasi Environment**
   Buat file .env di folder root dan sesuaikan
   ```code snippet
   PORT=3000
   MONGO_URI='mongodb://127.0.0.1:27017/queue_system'```

4. **Jalankan Aplikasi**
   ```bash
   node server.js```

---

## Panduan Akses
Sistem ini memiliki 3 antarmuka utama yang bisa saling terhubung:

1. **Pendaftaran**
   Pelanggan yang ingin mengambil antrian dapat mengakses ke halaman ini.
   ```URL
   http://localhost:3000/
   ```

2. **Panel Admin**
   Admin/Customer Service dapat melakukan panggilan nomer antrian dengan mengakses halaman ini.
   ```URL
   http://localhost:3000/admin
   ```

3. **Display Monitor**
   Monitor yang menampilkan nomer antrian seperti di ruang tunggu/lobby dapat mengakses halaman ini.
   ```URL
   http://localhost:3000/display
   ```

---

## Cara Kerja Sistem
1. **Pelanggan**: Mengisi nama dan No HP di halaman utama. Setelah klik "Masuk Antrian", sistem akan mendaftarkan pelanggan, memberikan nomer antrian, dan kode unik pelanggan yang disimpan pada PDF.

2. **Admin**: Pada panel admin, petugas melihat pendaftar baru secara real-time. Klik "Panggil" untuk memunculkan nomor tersebut di layar display.

3. **Display**: Menampilkan Nama dan Nomor yang dipanggil di monitor/display utama.

4. **Verifikasi**: Pelanggan yang dipanggil akan menunjukkan kode di PDF kepada petugas. Petugas memasukan kode tersebut guna verifikasi kecocokan dari data yang dipanggil dengan data pelanggan.

5. **Finalisasi**: Jika kode cocok, antrian selesai, dan akan menampilkan nomer antrian yang selanjutnya (jika ada) ataupun Admin dapat memilih antrian yang lain.

---

## Tech Stack
1. **Backend**: Node.js dan Express
2. **Database**: MonogDB dan Mongoose
3. **Real-time**: Socket.io
4. **Document**: PDFKit
5. **Frontend**: EJS Templating dan CSS3

---

## Saran Pengembang
1. Buat sistem login antara admin maupun pelanggan agar halaman tidak bisa diakses secara bebas.
2. Sistem ini bekerja dengan 1 server dan beberapa display sekaligus dalam satu area bisa, tapi jika nomer antrian ingin ditampilkan berdasarkan area display misal ada mesin display di Area A lalu mesin display tersebut hanya ingin menampilkan nomer antrian yang ada di Area A saja, nah bagian itu belum bisa.