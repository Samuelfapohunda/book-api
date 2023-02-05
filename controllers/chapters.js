const Chapter = require('../models/Chapter');
const ErrorResponse = require ('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Book = require('../models/Book');


// @desc       Get chapters
// @route      GET /api/v1/chapters
// @route      GET /api/v1/books/:bookId/chapters
//@access       Public
exports.getChapters = asyncHandler(async(req, res, next) => {
    if(req.params.bookId) {
    const chapters = Chapter.find({book: req.params.bookId })

    return res.status(200).json({
      success: true,
      count: chapters.length,
      data: chapters
    }) 
    }else { 
        res.status(200).json(res.advancedResults)
        }
})




// @desc       Get a single chapter
// @route      GET /api/v1/chapters/:id 
//@access       Public
exports.getSingleChapter = asyncHandler(async(req, res, next) => {
   const chapter = await Chapter.findById(req.params.id).populate({
    path: 'book', 
    select: 'name description'
   })

  if(!chapter) {
    return next(new ErrorResponse(`No chapter with the id of ${req.params.id}`, 404))
  }

    res.status(200).json({ 
        success: true,
      data: chapter})
})


// @desc      Create a new chapter 
// @route      POST /api/v1/books/:bookId/chapters
//@access       Public
exports.createChapter = asyncHandler(async(req, res, next) => { 
   req.body.book = req.params.bookId
   req.body.user = req.user.id
   
    const book = await Book.findById(req.params.bookId)
 
   if(!book) {
     return next(new ErrorResponse(`No book with the id of ${req.params.bookId}`, 401))
   }
   

   //Make sure user is book owner 
   if(book.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to add a chapter to ${book_id}`, 401))
   }

const chapter = await Chapter.create(req.body) 

res.status(200).json({
         success: true,
        data: chapter})  
      
 })
 
 //63c8eea4ce2c09098acf276b


 // @desc      Update chapter 
// @route      PUT /api/v1/chapters/:id
//@access       Private
exports.updateChapter = asyncHandler(async(req, res, next) => {
  

  let chapter = await Chapter.findById(req.params.id);
  
    if(!chapter) {
      return next(new ErrorResponse(`No chapter with the id of ${req.params.id}`, 401))
    }

    //Make sure user is chapter owner 
   if(chapter.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to update ${chapter._id}`, 401))
   }



   chapter = await Chapter.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

      res.status(200).json({
          success: true,
         data: chapter})
         console.log(chapter);
  })




   // @desc      Delete chapter 
// @route      DELETE /api/v1/chapters/:id
//@access       Private
exports.deleteChapter = asyncHandler(async(req, res, next) => {
    const chapter = await Chapter.findById(req.params.id)
 
   if(!chapter) {
     return next(new ErrorResponse(`No chapter with the id of ${req.params.id}`, 404))
   }



   //Make sure user is book owner
if(chapter.user.toString() !== req.user.id && req.user.role !== 'admin') {
  return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete chapter ${chapter._id}`, 404));
}
   await chapter.remove()

   res.status(200).json({
         success: true,
        data: {}})    
 })