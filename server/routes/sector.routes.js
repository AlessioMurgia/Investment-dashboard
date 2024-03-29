import express from 'express';

import {
    getSectors,
    getSectorDetail,
    createSector,
    updateSector,
    deleteSector
} from '../controllers/sector.controller.js'

const router = express.Router();

router.route('/').get(getSectors);
router.route('/:id').get(getSectorDetail);
router.route('/').post(createSector);
router.route('/:id').patch(updateSector);
router.route('/:id').delete(deleteSector);

export default router;