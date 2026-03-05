# 📑 Sistem Antrian Toko Real-Time (Socket.io)

Sistem antrian berbasis web yang dirancang untuk kecepatan, keamanan, dan sinkronisasi data secara instan. Mendukung pendaftaran mandiri pelanggan, sistem verifikasi tiket PDF, dan monitor TV ruang tunggu yang otomatis.



## ✨ Fitur Utama
* **Real-time Update**: Sinkronisasi data antar perangkat (User, Admin, Display) tanpa refresh halaman menggunakan **Socket.io**.
* **Atomic Numbering**: Sistem penomoran cerdas menggunakan MongoDB `findOneAndUpdate` yang menjamin tidak ada nomor ganda meskipun banyak pelanggan mendaftar bersamaan.
* **Auto-Generate Tiket PDF**: Pelanggan mendapatkan bukti antrian berupa PDF yang diunduh otomatis berisi **Kode Verifikasi Unik**.
* **Alur 2-Tahap Admin**: Petugas dapat "Memanggil" nomor ke layar TV terlebih dahulu, lalu memverifikasi pelanggan dengan kode unik sebelum menyelesaikan sesi.
* **Monitor Display Cerdas**: Layar TV menampilkan antrian utama yang sedang diproses dan daftar 5 antrian terbaru yang masuk di sidebar.
* **Auto-Next**: Monitor TV otomatis memperbarui tampilan ke antrian berikutnya secara cerdas saat verifikasi selesai dilakukan oleh admin.

---

## 🛠️ Prasyarat (Prerequisites)
Pastikan perangkat Anda sudah terinstal:
* [Node.js](https://nodejs.org/) (Versi 16 atau lebih baru)
* [MongoDB](https://www.mongodb.com/try/download/community) (Lokal atau MongoDB Atlas)

---

## 🚀 Cara Instalasi

1. **Clone Project**
   ```bash
   git clone [https://github.com/username/antrian-toko.git](https://github.com/username/antrian-toko.git)
   cd antrian-toko