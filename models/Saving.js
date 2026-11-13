import mongoose from 'mongoose';

const savingSchema = new mongoose.Schema(
  {
    saving_date: {
      type: Date,
      required: [true, 'Tanggal menabung wajib diisi']
    },
    amount: {
      type: Number,
      required: [true, 'Jumlah tabungan wajib diisi'],
      min: [0.01, 'Jumlah tabungan harus lebih dari 0']
    },
    notes: {
      type: String,
      trim: true,
      default: '',
      maxlength: [500, 'Catatan maksimal 500 karakter']
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

const Saving = mongoose.model('Saving', savingSchema);
export default Saving;
