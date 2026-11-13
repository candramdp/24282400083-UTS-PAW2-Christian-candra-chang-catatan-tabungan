import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import savingRoutes from './routes/savingRoutes.js';
import requestLogger from './middleware/requestLogger.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(requestLogger);

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API Catatan Tabungan aktif',
    endpoints: {
      list: 'GET /api/savings',
      detail: 'GET /api/savings/:id',
      create: 'POST /api/savings',
      update: 'PUT /api/savings/:id',
      delete: 'DELETE /api/savings/:id'
    }
  });
});

app.use('/api/savings', savingRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.originalUrl} tidak ditemukan`
  });
});

app.use(errorHandler);

async function startServer() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI belum diatur. Silakan isi file .env.');
    }

    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'catatan_tabungan'
    });

    console.log('Berhasil terhubung ke MongoDB Atlas');
    app.listen(PORT, () => {
      console.log(`Server berjalan di http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Gagal menjalankan aplikasi:', error.message);
    process.exit(1);
  }
}

startServer();
