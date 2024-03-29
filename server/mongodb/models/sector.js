import mongoose from 'mongoose';

const SectorSchema = new mongoose.Schema({
    title:{type: String, required: true},
    creator: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
});

const sectorModel = mongoose.model('Sector', SectorSchema);

export default sectorModel;