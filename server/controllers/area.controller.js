import Area from '../mongodb/models/area.js';
import User from '../mongodb/models/user.js';
import mongoose from 'mongoose';
import Asset from '../mongodb/models/asset.js';

const getAreas = async (req, res) => {
    try {
        const areas = await Area.find({}).limit(req.query._end);
        res.status(200).json(areas);
    } catch (err) {
        res.status(500).json({message:err.message});
    }
};

const getAreaDetail = async (req, res) => {
    try {
        const area = await Area.findById(req.params.id);
        res.status(200).json(area);
    } catch (err) {
        res.status(500).json({message:err.message});
    }
};

const createArea = async (req, res) => {
    try {
        const {title, email} = req.body;

        const session = await mongoose.startSession();
        session.startTransaction();
    
        const user = await User.findOne({email}).session(session);
    
        if (!user) throw new Error('User not found');
    
        const newArea = await Area.create({title, creator: user._id});
    
        user.allAreas.push(newArea._id);
        await user.save();
    
        await session.commitTransaction();
    
        res.status(200).json({message: 'Asset type created successfully'})
        
    } catch (err) {
        res.status(500).json({message:err.message});
    }
};
const updateArea = async (req, res) => {
    try {
        const {title, id, email} = req.body;
        
        // Find the asset type by ID and update it
        const updatedArea = await Area.findByIdAndUpdate(id, { title }, { new: true });

        if (!updatedArea) {
            // If the asset type with the given ID doesn't exist, return an error
            return res.status(404).json({ message: 'Area not found' });
        }

        res.status(200).json({ message: 'Area updated successfully'});
        
    } catch (err) {
        // Handle errors
        res.status(500).json({ message: err.message });
    }
};
const deleteArea = async (req, res) => {
    try {
        const { id } = req.params;

        const assetCount = await Asset.countDocuments({ area: id })
        if (assetCount > 0) {
            return res.status(400).json({ message: 'Cannot delete Area as it is used in an Asset, remove it first' });
        }

        const session = await mongoose.startSession();
        session.startTransaction();

        // Find and Remove the area
        const area = await Area.findByIdAndDelete(id).session(session);

        if (!area) {
            return res.status(404).json({ message: 'Area not found' });
        }

        // Update the user document to remove the reference to the deleted asset type
        await User.findByIdAndUpdate(area.creator, { $pull: { allAreas: area._id } }, { session });

        await session.commitTransaction();

        // If the asset type is successfully deleted, return success message
        res.status(200).json({ message: 'Area deleted successfully' });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export{
    getAreas,
    getAreaDetail,
    createArea,
    updateArea,
    deleteArea
}