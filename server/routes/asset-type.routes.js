import express from 'express';

import {
    getAllAssetTypes,
    getAssetTypeDetail,
    createAssetType,
    updateAssetType,
    deleteAssetType
} from '../controllers/asset-type.controller.js'

const router = express.Router();

router.route('/').get(getAllAssetTypes);
router.route('/:id').get(getAssetTypeDetail);
router.route('/').post(createAssetType);
router.route('/:id').patch(updateAssetType);
router.route('/:id').delete(deleteAssetType);

export default router;