# 🏢 Building Evacuation Safe Path Search

![Project Status](https://img.shields.io/badge/Status-Completed-success)
![Language](https://img.shields.io/badge/Language-JavaScript-yellow)
![License](https://img.shields.io/badge/License-MIT-blue)

**Aplikasi simulasi pencarian jalur evakuasi aman dalam gedung menggunakan algoritma Backtracking.**

Project ini mendemonstrasikan bagaimana algoritma rekursif (Backtracking) dapat diterapkan untuk memecahkan masalah navigasi di dunia nyata, khususnya dalam skenario darurat seperti kebakaran atau bencana alam di dalam gedung.

## 🌟 Fitur Utama

* **Algoritma Backtracking:** Mencari jalur solusi dengan mencoba berbagai kemungkinan rute dan "mundur" (backtrack) jika menemui jalan buntu atau bahaya.
* **Visualisasi Grid/Denah:** Representasi visual denah gedung dalam bentuk grid interaktif.
* **Penetapan Titik:** User dapat menentukan titik awal (posisi korban) dan titik akhir (pintu keluar).
* **Simulasi Rintangan:** Kemampuan untuk menempatkan "bahaya" atau "tembok" yang tidak bisa dilewati jalur evakuasi.
* **Path Highlighting:** Menampilkan rute teraman secara visual dari titik A ke titik B.
* **Responsive Design:** Tampilan antarmuka yang bersih dan mudah digunakan.

---

## 🛠️ Teknologi yang Digunakan

Project ini dibangun sepenuhnya menggunakan teknologi web standar tanpa framework berat (Vanilla Web Stack), sehingga ringan dan cepat.

* **HTML5:** Struktur semantik aplikasi.
* **CSS3:** Styling antarmuka (Flexbox/Grid) dan animasi visualisasi jalur.
* **JavaScript (ES6+):** Logika utama algoritma Backtracking dan manipulasi DOM interaktif.

---

## 🧠 Cara Kerja Algoritma

Aplikasi ini menggunakan pendekatan **Backtracking** (sejenis Depth-First Search) untuk menemukan jalur:

1.  Algoritma memulai pencarian dari titik *Start*.
2.  Mengecek empat arah pergerakan (Atas, Bawah, Kiri, Kanan).
3.  Jika langkah valid (aman dan belum dikunjungi), algoritma maju ke langkah tersebut.
4.  Jika algoritma menemui jalan buntu atau rintangan, ia akan **mundur (backtrack)** ke posisi sebelumnya dan mencoba arah lain.
5.  Proses berulang hingga mencapai titik *Exit* atau seluruh kemungkinan habis.

---

## 📂 Struktur Folder

```text
/
├── index.html      # File utama aplikasi
├── style.css       # File styling tampilan
├── script.js       # Logika algoritma Backtracking
└── assets/         # Folder untuk gambar/icon (jika ada)
