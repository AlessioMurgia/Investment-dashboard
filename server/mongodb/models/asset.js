import mongoose from 'mongoose';

const AssetSchema = new mongoose.Schema({
    title:{type: String, required: true},
    value:{type: Number, required: true},
    amount:{type: Number, required: false},
    ticker:{type: String, required: false},

    type:{type: mongoose.Schema.Types.ObjectId, ref:'AssetType'},
    sector:{type: mongoose.Schema.Types.ObjectId, ref: 'Sector'},
    area:{type: mongoose.Schema.Types.ObjectId, ref: 'Area'},

    creator: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
},{
    timestamps: true
  });

const assetModel = mongoose.model('Asset', AssetSchema);

export default assetModel;