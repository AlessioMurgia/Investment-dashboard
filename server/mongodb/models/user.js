import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true},
    email: {type: String, required: true},
    allAssetTypes: [{type: mongoose.Schema.Types.ObjectId, ref: 'AssetType'}],
    allSectors: [{type: mongoose.Schema.Types.ObjectId, ref: 'Sector'}],
    allAreas: [{type: mongoose.Schema.Types.ObjectId, ref: 'Area'}],
    allAssets: [{type:mongoose.Schema.Types.ObjectId, ref:'Asset'}]
})

const userModel = mongoose.model('User', UserSchema);

export default userModel;