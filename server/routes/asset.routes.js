import express from 'express';

import {
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
} from '../controllers/asset.controller.js'

const router = express.Router();


router.route('/').get(getAllAsset);
router.route('/total').get(getAssetTotal);
router.route('/total-by-sector').get(getAssetTotalBySector);
router.route('/total-by-type').get(getAssetTotalByType);
router.route('/total-by-title').get(getAssetTotalByTitle);
router.route('/month-of-current-year').get(getAssetByMonthOfCurrentYear);

router.route('/:id').get(getAssetDetail);
router.route('/').post(createAsset);
router.route('/:id').patch(updateAsset);
router.route('/:id').delete(deleteAsset);


export default router;