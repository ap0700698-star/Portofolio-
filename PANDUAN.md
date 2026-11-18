# PANDUAN LENGKAP (urut dari awal sampai publik)
Situs di-hosting Cloudflare Pages (diambil dari repo GitHub), database di Cloudflare D1, penjaga pintu = Cloudflare Worker.

Nama yang dipakai (boleh diganti, catat saja):
- Database: writing-db
- Worker: writing-api
- Proyek situs: akbar-portofolio  -> alamat https://akbar-portofolio.pages.dev
- Sandi admin: akbar123 (disarankan diganti yang lebih panjang)

## Tahap 1 - Persiapan
1. Punya akun GitHub dan akun Cloudflare (dash.cloudflare.com, gratis).
2. Ekstrak zip ini di komputer. Pakai komputer / mode desktop.

## Tahap 2 - Database (D1)
1. Cloudflare -> Storage & Databases -> D1 SQL Database -> Create database.
2. Nama: writing-db -> Create. (Tabel dibuat otomatis oleh Worker.)

## Tahap 3 - Worker (penjaga pintu)
1. Workers & Pages -> Create application -> Create Worker -> nama: writing-api -> Deploy.
2. Edit code -> hapus semua isi -> tempel seluruh isi worker/index.js -> Deploy.
3. Settings -> Bindings -> Add -> D1 database -> Variable name: DB (huruf besar, persis) -> pilih writing-db -> simpan/Deploy.
4. Settings -> Variables and secrets -> Add: nama ADMIN_PASSWORD, tipe Secret, nilai = sandi admin -> Deploy.
5. Salin alamat Worker (https://writing-api.AKUN.workers.dev).
6. Tes: buka alamat itu di browser -> harus tampil []. Lalu tambahkan ?a=users -> harus {"error":"Tidak diizinkan"}.

## Tahap 4 - Isi api-config.js
Ganti isinya dengan alamat Worker dari Tahap 3 (tanpa garis miring di akhir):
window.WRITING_API = "https://writing-api.AKUN.workers.dev";

## Tahap 5 - GitHub
1. github.com -> New repository -> nama bebas (mis. akbar-portofolio) -> Public/Private -> Create.
2. Add file -> Upload files -> unggah SEMUA isi folder (index.html, writings.html, kelola-x7k2q9.html, modern.css, api-config.js; worker/ dan PANDUAN.md boleh) -> Commit changes.

## Tahap 6 - Situs di Cloudflare Pages
1. Workers & Pages -> Create application -> Pages -> Import an existing Git repository (Connect to Git).
2. Connect GitHub -> izinkan aplikasi "Cloudflare Workers and Pages" -> Only select repositories -> pilih repo Anda.
3. Begin setup. Project name: akbar-portofolio. Production branch: main. Framework preset: None. Build command: KOSONG. Build output directory: KOSONG atau /.
4. Save and Deploy. Tunggu selesai, catat alamat https://akbar-portofolio.pages.dev (bila nama sudah dipakai orang, Cloudflare menambah akhiran - pakai alamat yang tampil).

## Tahap 7 - Izinkan situs memanggil Worker (WAJIB)
Worker writing-api -> Settings -> Variables and secrets -> Add: nama ALLOWED_ORIGIN, tipe Text,
nilai = alamat situs dari Tahap 6, mis. https://akbar-portofolio.pages.dev
(tanpa garis miring di akhir, tanpa /kelola...). Lebih dari satu alamat dipisah koma. Lalu Deploy.

## Tahap 8 - Tes dan pakai
1. Admin: https://akbar-portofolio.pages.dev/kelola-x7k2q9.html -> sandi admin -> buat akun penulis (lihat bagian SISTEM PENULIS di bawah).
2. Publik: buka .../writings.html dari HP lain tanpa login -> tulisan tampil (maks ~1 menit).
3. Simpan alamat admin di bookmark; jangan dibagikan. Tidak ada link ke admin dari situs.

## Masalah umum
- Admin "Gagal terhubung": ALLOWED_ORIGIN belum sama persis dengan alamat situs, atau Worker belum di-Deploy ulang.
- "Daftar tulisan belum bisa dimuat": alamat di api-config.js salah / belum diunggah ulang ke GitHub.
- "Database D1 belum terhubung": binding bukan bernama DB.
- "ADMIN_PASSWORD belum diatur": Secret belum dibuat atau belum Deploy.
- Ubah file nanti: unggah ulang ke GitHub, Cloudflare membangun ulang otomatis.
- Ganti sandi: edit Secret ADMIN_PASSWORD di Worker, tanpa ubah kode.
- Tampilan: index.html dan writings.html memakai tema.css + tema.js (modern.css hanya dipakai halaman admin).
- Batas gratis: 100.000 request Worker/hari.

## SISTEM PENULIS (admin dan banyak penulis)
Dua halaman terpisah, dua cara login:
- Admin: /kelola-x7k2q9.html, masuk dengan sandi dari Secret ADMIN_PASSWORD. Admin tidak menulis, admin mengelola penulis.
- Penulis: /penulis.html, masuk dengan username + sandi. Tidak ada link ke dua halaman ini dari situs publik, simpan sebagai bookmark.

Alur membuat penulis:
1. Admin isi username baru -> Buat akun. Username unik (huruf kecil, angka, _ ; 3-20 karakter), tidak boleh sama dengan penulis lain.
2. Muncul SANDI KHUSUS (mis. K7QM2-9XPTA), hanya tampil sekali. Berikan ke penulis lewat jalur pribadi. Setiap penulis mendapat sandi khusus yang berbeda.
3. Penulis buka /penulis.html -> username + sandi khusus -> diminta MEMBUAT SANDI SENDIRI (min. 8 karakter) -> kembali ke halaman login -> masuk dengan sandi buatannya.
4. Sejak itu sandi khusus dari admin tidak berlaku lagi. Login selanjutnya hanya memakai sandi buatan penulis.
5. Lupa sandi / ganti orang: admin klik Reset sandi -> dapat sandi khusus baru, sandi lama langsung mati, penulis membuat sandi baru lagi.

Yang bisa dilihat admin per penulis: status (aktif / belum buat sandi), waktu sandi dibuat, login terakhir, jumlah tulisan, dan isi semua tulisannya (draf maupun terbit). Admin bisa menarik tulisan dari publik atau menghapusnya.
Sandi yang dibuat penulis TIDAK bisa dilihat siapa pun, termasuk admin, karena hanya disimpan sebagai hash (PBKDF2). Itu disengaja agar sandi penulis tidak bocor kalau database bocor. Kalau penulis lupa, pakai Reset sandi.
Keamanan tambahan: 5 kali salah login mengunci akun 10 menit; setiap penulis hanya bisa mengubah tulisannya sendiri.

## Alur GitHub dan Cloudflare
- Situs (HTML/CSS/JS): GitHub -> Cloudflare Pages otomatis (Tahap 5 dan 6). Setiap commit ke branch main membangun ulang situs.
- Worker: boleh tetap ditempel manual (Tahap 3), atau diambil juga dari GitHub: Workers & Pages -> Create -> Import a repository -> pilih repo yang sama -> Root directory: worker. Isi database_id di worker/wrangler.toml (ID database writing-db dari halaman D1) dan sesuaikan ALLOWED_ORIGIN. ADMIN_PASSWORD tetap dibuat sebagai Secret di dashboard, JANGAN ditulis di GitHub.
- Database D1 hidup di Cloudflare, bukan di GitHub: data penulis dan tulisan tidak ikut ke repo. Tabel dibuat otomatis oleh Worker (worker/schema.sql hanya cadangan).
- Update dari versi lama: tabel writings lama tetap dipakai; tulisan lama tidak punya penulis, jadi hanya terlihat di halaman publik (tanpa nama) dan tidak muncul di daftar penulis mana pun.
