import Sector from '../mongodb/models/sector.js';
import User from '../mongodb/models/user.js';
import mongoose from 'mongoose';
import Asset from '../mongodb/models/asset.js';

const getSectors = async (req, res) => {
    try {
        const sectors = await Sector.find({}).limit(req.query._end);
        res.status(200).json(sectors);
    } catch (err) {
        res.status(500).json({message:err.message});
    }
};

const getSectorDetail = async (req, res) => {
    try {
        const sector = await Sector.findById(req.params.id);
        res.status(200).json(sector);
    } catch (err) {
        res.status(500).json({message:err.message});
    }
};

const createSector = async (req, res) => {
    try {
        const {title, email} = req.body;

        const session = await mongoose.startSession();
        session.startTransaction();
    
        const user = await User.findOne({email}).session(session);
    
        if (!user) throw new Error('User not found');
    
        const newSector = await Sector.create({title, creator: user._id});
    
        user.allSectors.push(newSector._id);
        await user.save();
    
        await session.commitTransaction();
    
        res.status(200).json({message: 'Asset type created successfully'})
        
    } catch (err) {
        res.status(500).json({message:err.message});
    }
};

const updateSector = async (req, res) => {
    try {
        const {title, id, email} = req.body;
        
        const session = await mongoose.startSession();
        session.startTransaction();

        // Find the asset type by ID and update it
        const updatedSector = await Sector.findByIdAndUpdate(id, { title }, { new: true }).session(session);;

        if (!updatedSector) {
            // If the asset type with the given ID doesn't exist, return an error
            return res.status(404).json({ message: 'Sector not found' });
        }

        await session.commitTransaction();
        
        res.status(200).json({ message: 'Sector updated successfully'});
        
    } catch (err) {
        // Handle errors
        res.status(500).json({ message: err.message });
    }
};

const deleteSector = async (req, res) => {
    try {
        const { id } = req.params;

        const assetCount = await Asset.countDocuments({ sector: id })
        if (assetCount > 0) {
            return res.status(400).json({ message: 'Cannot delete sector as it is used in an Asset, remove it first' });
        }

        const session = await mongoose.startSession();
        session.startTransaction();

        // Find and Remove the area
        const sector = await Sector.findByIdAndDelete(id).session(session);

        if (!sector) {
            return res.status(404).json({ message: 'Sector not found' });
        }

        // Update the user document to remove the reference to the deleted asset type
        await User.findByIdAndUpdate(sector.creator, { $pull: { allSectors: sector._id } }, { session });

        await session.commitTransaction();

        // If the asset type is successfully deleted, return success message
        res.status(200).json({ message: 'Sector deleted successfully' });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export {
    getSectors,
    getSectorDetail,
    createSector,
    updateSector,
    deleteSector
}