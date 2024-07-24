import mongoose from 'mongoose';

const qrSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

const QR = mongoose.models.QR || mongoose.model('QR', qrSchema);

export default QR;
