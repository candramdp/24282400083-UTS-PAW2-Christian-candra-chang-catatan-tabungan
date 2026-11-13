# REST API Catatan Tabungan

Project Express.js menggunakan ES Modules, MongoDB Atlas, Mongoose, dan Zod untuk mengelola catatan tabungan.

## Field studi kasus

| Field | Tipe | Keterangan |
|---|---|---|
| saving_date | Date | Tanggal menabung, wajib diisi |
| amount | Number | Jumlah tabungan, wajib dan harus lebih dari 0 |
| notes | String | Catatan/keterangan, opsional |

MongoDB akan menambahkan `_id` dan `__v` secara otomatis.

## Persiapan

1. Install Node.js.
2. Buat cluster dan database `catatan_tabungan` di MongoDB Atlas.
3. Salin file `.env.example` menjadi `.env`.
4. Isi `MONGODB_URI` pada `.env` dengan connection string Atlas milik sendiri. Ganti username, password, dan alamat cluster. Jangan unggah file `.env` ke GitHub.
5. Jalankan `npm install`.
6. Jalankan `npm run dev` atau `npm start`.
7. Buka `http://localhost:3000`.

## Endpoint REST API

| Method | Endpoint | Fungsi |
|---|---|---|
| POST | /api/savings | Menambah catatan tabungan |
| GET | /api/savings | Menampilkan semua catatan |
| GET | /api/savings/:id | Menampilkan detail berdasarkan ID |
| PUT | /api/savings/:id | Memperbarui catatan berdasarkan ID |
| DELETE | /api/savings/:id | Menghapus catatan berdasarkan ID |

### Contoh body POST

```json
{
  "saving_date": "2026-11-13",
  "amount": 50000,
  "notes": "Menabung harian"
}
```

### Pencarian dan pengurutan

- Cari catatan: `GET /api/savings?search=harian`
- Urutkan tanggal terbaru: `GET /api/savings?orderBy=saving_date&order=desc`
- Urutkan jumlah terkecil: `GET /api/savings?orderBy=amount&order=asc`
- Field pengurutan yang diizinkan: `saving_date`, `amount`, `notes`, dan `createdAt`.
- Arah pengurutan: `asc` atau `desc`.

Semua request POST dan PUT menggunakan header `Content-Type: application/json`.

## Struktur project

- `server.js`: konfigurasi Express dan koneksi MongoDB.
- `models/Saving.js`: schema dan model Mongoose.
- `routes/savingRoutes.js`: endpoint CRUD, pencarian, pengurutan, dan validasi Zod.
- `middleware/requestLogger.js`: pencatatan waktu pemrosesan request.
- `middleware/errorHandler.js`: format respons error JSON.

## Catatan keamanan

File `.env` berisi kredensial database dan tidak boleh di-commit. Gunakan `.env.example` sebagai template tanpa password asli.
