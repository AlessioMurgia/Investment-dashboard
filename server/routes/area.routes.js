import express from 'express';

import {
    getAreas,
    getAreaDetail,
    createArea,
    updateArea,
    deleteArea
} from '../controllers/area.controller.js'

const router = express.Router();

router.route('/').get(getAreas);
router.route('/:id').get(getAreaDetail);
router.route('/').post(createArea);
router.route('/:id').patch(updateArea);
router.route('/:id').delete(deleteArea);

export default router;