const express = require('express');
const { 
    getBooks,
    getSingleBook, 
    createBook,
    updateBook,
    deleteBook,
    bookPhotoUpload,
 } = require('../controllers/books')


const Book= require('../models/Book');
const advancedResults = require('../middleware/advancedResults')


//Include other resource routers
const chapterRouter = require('./chapters')


 const router = express.Router();
 
const { protect, authorize } = require('../middleware/auth');

 //Reroute into other resource routers 
 router.use('/:bookId/chapters', chapterRouter)




 router
 .route('/')
 .get(advancedResults(Book, 'chapters'), getBooks)
 .post(protect, authorize('author', 'admin'), createBook)


 router.route('/:id/photo').put(protect, authorize('author', 'admin'), bookPhotoUpload)
 router
 .route('/:id')
 .get(getSingleBook)
 .put(protect, authorize('author', 'admin'), updateBook)
 .delete(protect, authorize('author', 'admin'), deleteBook)



  module.exports = router;
  