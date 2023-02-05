const express = require('express');
const { 
    getChapters,
    getSingleChapter,
    createChapter,
    updateChapter,
    deleteChapter

 } = require('../controllers/chapters')

 const Chapter = require('../models/Chapter')
 const advancedResults = require('../middleware/advancedResults')

 const router = express.Router({mergeParams: true});
 const { protect, authorize } = require('../middleware/auth');

 router.route('/').get(advancedResults(Chapter,{
    path: 'book',
    select: 'name description'
}), getChapters).post(protect, authorize('author', 'admin'), createChapter)


 router 
 .route('/:id')
 .get(getSingleChapter)
 .put(protect, authorize('author', 'admin'), updateChapter)
 .delete(protect, authorize('author', 'admin'), deleteChapter)

 module.exports = router
