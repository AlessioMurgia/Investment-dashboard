import AssetType from '../mongodb/models/asset-type.js';
import Sector from '../mongodb/models/sector.js';
import Area from '../mongodb/models/area.js';
import Asset from '../mongodb/models/asset.js';
import User from '../mongodb/models/user.js';
import mongoose from 'mongoose';

const getAllAsset = async (req, res) => {
    try {
        const assets = await Asset.find({}).limit(req.query._end);
        res.status(200).json(assets);
    } catch (err) {
        res.status(500).json({message:err.message});
    }
};

const getAssetDetail = async (req, res) => {
    try {
        const asset = await Asset.findById(req.params.id);
        res.status(200).json(asset);
    } catch (err) {
        res.status(500).json({message:err.message});
    }
};

const createAsset = async (req, res) => {
    try {
        const {title, value, amount, ticker, type, sector, area, email} = req.body;
        const session = await mongoose.startSession();
        session.startTransaction();
    
        const user = await User.findOne({email}).session(session);
        const assettypeFind = await AssetType.findById(type._id).session(session);
        const sectorFind = await Sector.findById(sector._id).session(session);
        const areaFind = await Area.findById(area._id).session(session);

        if (!user) throw new Error('User not found');
    
        const newAsset = await Asset.create({title, value, amount, ticker, type: assettypeFind._id, sector: sectorFind._id, area: areaFind._id, creator: user._id});
    
        user.allAssets.push(newAsset._id);
        await user.save();
    
        await session.commitTransaction();
    
        res.status(200).json({message: 'Asset type created successfully'})
        
    } catch (err) {
        res.status(500).json({message:err.message});
    }
};

const updateAsset = async (req, res) => {
    try {
        const {id, title, value, amount, ticker, type, sector, area, email} = req.body;

        const session = await mongoose.startSession();
        session.startTransaction();

        const user = await User.findOne({email}).session(session);
        const assettypeFind = await AssetType.findById(type._id).session(session);
        const sectorFind = await Sector.findById(sector._id).session(session);
        const areaFind = await Area.findById(area._id).session(session);

        // Find the asset type by ID and update it
        const updatedAsset = await Asset.findByIdAndUpdate(id, {
             title, value, amount, ticker, type: assettypeFind._id, sector: sectorFind._id, area: areaFind._id }, {
                 new: true }).session(session);

        if (!updatedAsset) {
            // If the asset type with the given ID doesn't exist, return an error
            return res.status(404).json({ message: 'Asset not found' });
        }

        await session.commitTransaction();

        res.status(200).json({ message: 'Asset updated successfully'});
        
    } catch (err) {
        // Handle errors
        res.status(500).json({ message: err.message });
    }
};

const deleteAsset = async (req, res) => {
    try {
        const { id } = req.params;

        const session = await mongoose.startSession();
        session.startTransaction();

        // Find and Remove the area
        const asset = await Asset.findByIdAndDelete(id).session(session);

        if (!asset) {
            return res.status(404).json({ message: 'Asset not found' });
        }

        // Update the user document to remove the reference to the deleted asset type
        await User.findByIdAndUpdate(asset.creator, { $pull: { allAssets: asset._id } }, { session });

        await session.commitTransaction();

        // If the asset type is successfully deleted, return success message
        res.status(200).json({ message: 'Asset deleted successfully' });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getAssetTotalBySector = async (req, res) => {
    try {
        const email = req.query.email
        const user = await User.findOne({email});

        if (!user) throw new Error('User not found');

        const aggregateResult = await Asset.aggregate([
            {
                $match:{
                    creator: user._id
                }
            },
            {
                $group: {
                    _id: "$sector",
                    totalValue: { $sum: "$value" }
                }
            },
            {
                $lookup: {
                    from: "sectors",
                    localField: "_id",
                    foreignField: "_id",
                    as: "sectorInfo"
                }
            },
            {
                $project: {
                    _id: 0,
                    totalValue: 1,
                    sector: {
                        _id: { $arrayElemAt: ["$sectorInfo._id", 0] },
                        title: { $arrayElemAt: ["$sectorInfo.title", 0] }
                    }
                }
            },
            {
                $sort: { totalValue: -1 } // Sort sectors by totalValue in descending order
            },
            {
                $facet: {
                    topSectors: [ // Keep top 5 sectors
                        { $limit: 5 }
                    ],
                    otherSector: [ // Group the rest into an 'Other' category
                        { $skip: 5 }, // Skip top 5 sectors
                        {
                            $group: {
                                _id: 0o000000000000,
                                totalValue: { $sum: "$totalValue" }
                            }
                        },
                        {
                            $project: {
                                totalValue: 1,
                                sector: {
                                    _id: "other",
                                    title: "Other",
                                }
                            }
                        }
                    ]
                }
            }
        ]);

        let sectorTotals = [];

        if (aggregateResult.length > 0) {
            sectorTotals = aggregateResult[0].topSectors;
            const otherSector = aggregateResult[0].otherSector[0];
            if (otherSector) {
                sectorTotals.push(otherSector);
            }
        }

        res.status(200).json(sectorTotals);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getAssetTotalByType = async (req, res) => {
    try{
        const email = req.query.email
        const user = await User.findOne({email});

        if (!user) throw new Error('User not found');

        const aggregateResult = await Asset.aggregate([
            {
                $match: {
                    creator: user._id
                }
            },
            {
                $group: {
                    _id: "$type",
                    totalValue: { $sum: "$value" }
                }
            },
            {
                $lookup: {
                    from: "assettypes",
                    localField: "_id",
                    foreignField: "_id",
                    as: "typeInfo"
                }
            },
            {
                $project: {
                    _id: 0,
                    totalValue: 1,
                    type: {
                        _id: { $arrayElemAt: ["$typeInfo._id", 0] },
                        title: { $arrayElemAt: ["$typeInfo.title", 0] }
                    }
                }
            },
            {
                $sort: { totalValue: -1 } // Sort types by totalValue in descending order
            },
            {
                $facet: {
                    topTypes: [ // Keep top 3 types
                        { $limit: 3 }
                    ],
                    otherType: [ // Group the rest into an 'Other' category
                        { $skip: 3 }, // Skip top 5 sectors
                        {
                            $group: {
                                _id: 0o000000000000,
                                totalValue: { $sum: "$totalValue" }
                            }
                        },
                        {
                            $project: {
                                totalValue: 1,
                                type: {
                                    _id: "other",
                                    title: "Other",
                                }
                            }
                        }
                    ]
                }
            }
        ]);

        let typeTotals = [];

        if (aggregateResult.length > 0) {
            typeTotals = aggregateResult[0].topTypes;
            const otherType = aggregateResult[0].otherType[0];
            if (otherType) {
                typeTotals.push(otherType);
            }
        }

        res.status(200).json(typeTotals);
    }
    catch(err){
        res.status(500).json({ message: err.message });
    }
 
};

const getAssetTotalByTitle = async (req, res) => {
    try {
        const email = req.query.email
        const user = await User.findOne({email});

        if (!user) throw new Error('User not found');

        const aggregateResult = await Asset.aggregate([
            {
                $match: {
                    creator: user._id
                }
            },
            {
              $group: {
                _id: '$title',
                TotalValue: { $sum: '$value' }
              }
            },
            {
              $project: {
                _id: 0,
                Title: '$_id',
                TotalValue: 1
              }
            }
          ]);

        res.status(200).json(aggregateResult);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getAssetByMonthOfCurrentYear = async (req, res) => {
    try {
        const email = req.query.email
        const user = await User.findOne({email});

        if (!user) throw new Error('User not found');

        const currentYear = new Date().getFullYear();
        const startOfYear = new Date(currentYear, 0, 1); // January 1st of current year
        const endOfYear = new Date(currentYear + 1, 0, 1); // January 1st of next year

        const result = await Asset.aggregate([
            {
                $match: {
                    createdAt: { $gte: startOfYear, $lt: endOfYear },
                    creator: user._id
                }
            },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    totalValue: { $sum: "$value" }
                }
            },
            {
                $sort: {
                    "_id": 1
                }
            },
            {
                $project: {
                    _id: 0,
                    month: "$_id",
                    totalValue: 1
                }
            }
        ]);

        // Calculate cumulative total
        let cumulativeTotal = 0;
        const cumulativeResult = result.map(item => {
            cumulativeTotal += item.totalValue;
            return { month: item.month, totalValue: cumulativeTotal };
        });

        // Fill missing months with totalValue: 0
        for (let i = 1; i <= 12; i++) {
            const foundMonth = cumulativeResult.find(item => item.month === i);
            if (!foundMonth) {
                cumulativeResult.push({ month: i, totalValue: 0 });
            }
        }

        // Sort the cumulative result by month
        cumulativeResult.sort((a, b) => a.month - b.month);

        res.status(200).json(cumulativeResult);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const getAssetTotal = async (req, res) => {
    try {
        const email = req.query.email

        const user = await User.findOne({email});

        if (!user) throw new Error('User not found');

        const result = await Asset.aggregate([
            {
                $match: {
                  creator: user._id
                }
            },
            {
                $group: {
                    _id: 0,
                    totalValue: { $sum: "$value" }
                }
            }
        ]);

        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export {
    getAllAsset,
    getAssetDetail,
    createAsset,
    updateAsset,
    deleteAsset,
    getAssetTotalBySector,
    getAssetTotalByType,
    getAssetTotalByTitle,
    getAssetByMonthOfCurrentYear,
    getAssetTotal
}