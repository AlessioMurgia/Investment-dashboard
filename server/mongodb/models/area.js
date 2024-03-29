import mongoose from 'mongoose';

const AreaSchema = new mongoose.Schema({
    title:{type: String, required: true},
    creator: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
});

const areaModel = mongoose.model('Area', AreaSchema);

export default areaModel;