import express from 'express'
import { getSimilarTvs,getTrendingTv,getTvDetails,getTvTrailers,getTvByCategory } from '../controllers/tv.controller.js';
const router = express.Router();

router.get("/trending",getTrendingTv)
router.get("/:id/trailers",getTvTrailers)
router.get("/:id/details",getTvDetails)
router.get("/:id/similar",getSimilarTvs)
router.get("/:category/category",getTvByCategory)

export default router