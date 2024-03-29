import mongoose from 'mongoose';

const AssetTypeSchema = new mongoose.Schema({
    title:{type: String, required: true},
    creator: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
});

const assetTypeModel = mongoose.model('AssetType', AssetTypeSchema);

export default assetTypeModel;