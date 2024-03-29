import AssetType from '../mongodb/models/asset-type.js';
import User from '../mongodb/models/user.js';
import mongoose from 'mongoose';
import Asset from '../mongodb/models/asset.js';

const getAllAssetTypes = async (req, res) => {
    try {
        const assetTypes = await AssetType.find({}).limit(req.query._end);
        res.status(200).json(assetTypes);
    } catch (err) {
        res.status(500).json({message:err.message});
    }
};

const getAssetTypeDetail = async (req, res) => {
    try {
        const assetType = await AssetType.findById(req.params.id);
        res.status(200).json(assetType);
    } catch (err) {
        res.status(500).json({message:err.message});
    }
};

const createAssetType = async (req, res) => {
    try {
        const {title, email} = req.body;

        const session = await mongoose.startSession();
        session.startTransaction();
    
        const user = await User.findOne({email}).session(session);
    
        if (!user) throw new Error('User not found');
    
        const newAssetType = await AssetType.create({title, creator: user._id});
    
        user.allAssetTypes.push(newAssetType._id);
        await user.save();
    
        await session.commitTransaction();
    
        res.status(200).json({message: 'Asset type created successfully'})
        
    } catch (err) {
        res.status(500).json({message:err.message});
    }
};

const updateAssetType = async (req, res) => {
    try {
        const {title, id, email} = req.body;
        
        // Find the asset type by ID and update it
        const updatedAssetType = await AssetType.findByIdAndUpdate(id, { title }, { new: true });

        if (!updatedAssetType) {
            // If the asset type with the given ID doesn't exist, return an error
            return res.status(404).json({ message: 'Asset type not found' });
        }

        res.status(200).json({ message: 'Asset type updated successfully'});
        
    } catch (err) {
        // Handle errors
        res.status(500).json({ message: err.message });
    }
};

const deleteAssetType = async (req, res) => {
    try {
        const { id } = req.params;

        const assetCount = await Asset.countDocuments({ type: id })
        if (assetCount > 0) {
            return res.status(400).json({ message: 'Cannot delete Asset type as it is used in an Asset, remove it first' });
        }

        const session = await mongoose.startSession();
        session.startTransaction();

        // Find and Remove the asset type
        const assetType = await AssetType.findByIdAndDelete(id).session(session);

        if (!assetType) {
            return res.status(404).json({ message: 'Asset type not found' });
        }

        // Update the user document to remove the reference to the deleted asset type
        await User.findByIdAndUpdate(assetType.creator, { $pull: { allAssetTypes: assetType._id } }, { session });

        await session.commitTransaction();

        // If the asset type is successfully deleted, return success message
        res.status(200).json({ message: 'Asset type deleted successfully' });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export {
    getAllAssetTypes,
    getAssetTypeDetail,
    createAssetType,
    updateAssetType,
    deleteAssetType
}