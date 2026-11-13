import { Router } from 'express';
import mongoose from 'mongoose';
import { z } from 'zod';
import Saving from '../models/Saving.js';

const router = Router();

const savingSchema = z.object({
  saving_date: z.coerce.date({ invalid_type_error: 'Tanggal menabung tidak valid' }),
  amount: z.coerce.number().positive('Jumlah tabungan harus lebih dari 0'),
  notes: z.string().trim().max(500, 'Catatan maksimal 500 karakter').optional().default('')
});

const updateSchema = savingSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: 'Minimal satu field harus diperbarui' }
);

const allowedSortFields = ['saving_date', 'amount', 'notes', 'createdAt'];

function validateId(id) {
  return mongoose.isValidObjectId(id);
}

// POST /api/savings - tambah catatan tabungan
router.post('/', async (req, res, next) => {
  try {
    const parsed = savingSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: 'Validasi data gagal',
        errors: parsed.error.flatten().fieldErrors
      });
    }

    const saving = await Saving.create(parsed.data);
    return res.status(201).json({
      success: true,
      message: 'Catatan tabungan berhasil ditambahkan',
      data: saving
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/savings - semua data, pencarian, dan pengurutan
router.get('/', async (req, res, next) => {
  try {
    const { search, orderBy = 'saving_date', order = 'desc' } = req.query;

    if (!allowedSortFields.includes(orderBy)) {
      return res.status(400).json({
        success: false,
        message: 'Field pengurutan tidak diizinkan',
        allowedFields: allowedSortFields
      });
    }

    if (!['asc', 'desc'].includes(order)) {
      return res.status(400).json({
        success: false,
        message: 'Arah pengurutan harus asc atau desc'
      });
    }

    const filter = {};
    if (typeof search === 'string' && search.trim()) {
      const keyword = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const conditions = [{ notes: { $regex: keyword, $options: 'i' } }];

      if (!Number.isNaN(Number(search))) {
        conditions.push({ amount: Number(search) });
      }
      const parsedDate = new Date(search);
      if (!Number.isNaN(parsedDate.getTime())) {
        const start = new Date(parsedDate);
        start.setHours(0, 0, 0, 0);
        const end = new Date(parsedDate);
        end.setHours(23, 59, 59, 999);
        conditions.push({ saving_date: { $gte: start, $lte: end } });
      }
      filter.$or = conditions;
    }

    const sort = { [orderBy]: order === 'asc' ? 1 : -1 };
    const savings = await Saving.find(filter).sort(sort);

    return res.status(200).json({
      success: true,
      total: savings.length,
      data: savings
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/savings/:id - detail berdasarkan ID
router.get('/:id', async (req, res, next) => {
  try {
    if (!validateId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Format ID tidak valid' });
    }

    const saving = await Saving.findById(req.params.id);
    if (!saving) {
      return res.status(404).json({ success: false, message: 'Catatan tabungan tidak ditemukan' });
    }

    return res.status(200).json({ success: true, data: saving });
  } catch (error) {
    next(error);
  }
});

// PUT /api/savings/:id - ubah catatan berdasarkan ID
router.put('/:id', async (req, res, next) => {
  try {
    if (!validateId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Format ID tidak valid' });
    }

    const parsed = updateSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: 'Validasi data gagal',
        errors: parsed.error.flatten().fieldErrors
      });
    }

    const saving = await Saving.findByIdAndUpdate(req.params.id, parsed.data, {
      new: true,
      runValidators: true
    });

    if (!saving) {
      return res.status(404).json({ success: false, message: 'Catatan tabungan tidak ditemukan' });
    }

    return res.status(200).json({
      success: true,
      message: 'Catatan tabungan berhasil diperbarui',
      data: saving
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/savings/:id - hapus catatan berdasarkan ID
router.delete('/:id', async (req, res, next) => {
  try {
    if (!validateId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Format ID tidak valid' });
    }

    const saving = await Saving.findByIdAndDelete(req.params.id);
    if (!saving) {
      return res.status(404).json({ success: false, message: 'Catatan tabungan tidak ditemukan' });
    }

    return res.status(200).json({
      success: true,
      message: 'Catatan tabungan berhasil dihapus',
      data: saving
    });
  } catch (error) {
    next(error);
  }
});

export default router;
