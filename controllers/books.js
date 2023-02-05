const path = require('path')
const Book = require('../models/Book');
const ErrorResponse = require ('../utils/errorResponse');
const asyncHandler = require('../middleware/async');



// @desc       Get all books
// @route      GET /api/v1/books
//@access       Public
exports.getBooks = asyncHandler(async(req, res ,next) => {

       res.status(200).json(res.advancedResults)
});





// @desc       Get single books
// @route      GET /api/v1/books/:id
//@access       Public
exports.getSingleBook = asyncHandler(async (req, res ,next) => {
           const book = await Book.findById(req.params.id)

if(!book) {
   return next(new ErrorResponse(`Book not found with id of ${req.params.id}`, 404));
}

    res.status(200).json({success: true, data: book})

})





// @desc       Create new book
// @route      POST /api/v1/books/
//@access       Private
exports.createBook =  asyncHandler(async (req, res ,next) => {
  //Add user to req.body
  req.body.user = req.user.id   
  
  //Check for published Book
  const publishedBook = await Book.findOne({user: req.user.id});

  //If the user is not an admin they can only add one book
  if(publishedBook && req.user.role !== 'admin') {
    return next(new ErrorResponse(`The User with id ${req.user.id} has already published a book`, 400))
  } 


  const book = await Book.create(req.body);
    res.status(201).json({
        success: true,
        data: book
    })
})


// @desc       Update book
// @route      PUT /api/v1/books/:id
//@access       Private
exports.updateBook = asyncHandler(async (req, res ,next) => {
  
  let book = await Book.findById(req.params.id)

if(!book) {
    return next(new ErrorResponse(`Book not found with id of ${req.params.id}`, 401));
};


//Make sure user is book author
if(book.user.toString() !== req.user.id && req.user.role !== 'admin') {
  return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this book`, 401));
}

   book = await Book.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
   })
  
res.status(200).json({
    success: true,
    data: book
})
})

   





// @desc       Delete book
// @route      DELETE /api/v1/books/:id
//@access       Private
exports.deleteBook = asyncHandler(async (req, res ,next) => {
     const book = await Book.findById(req.params.id)
  
  if(!book) {
    return next(new ErrorResponse(`Book not found with id of ${req.params.id}`, 404));
};


//Make sure user is book author
if(book.user.toString() !== req.user.id && req.user.role !== 'admin') {
  return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete this book`, 404));
}

book.remove()

res.status(200).json({success: true, data: 'Deleted'}) 
})



// @desc       Upload photo for  book
// @route      PUT /api/v1/books/:id/photo
//@access       Private
exports.bookPhotoUpload = asyncHandler(async (req, res ,next) => {
  const book = await Book.findById(req.params.id)

if(!book) {
return next(new ErrorResponse(`Book not found with id of ${req.params.id}`, 404));
};

if(!req.files) {
  return next(new ErrorResponse(`Please upload a file`, 404));
}

const file = req.files.file;

//Make sure that the image is a photo
if(!file.mimetype.startsWith('image')) {
  return next(new ErrorResponse(`Please upload an image file`, 404));
}

//Check file size
if(file.size > process.env.MAX_FILE_UPLOAD) {
  return next(new ErrorResponse(`Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`, 404));
}

//Create custom file name 
file.name = `photo_${book._id}${path.parse(file.name).ext}`


file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
  if(err) {
    console.error(err);
    return next(new ErrorResponse(`Problem with file upload`, 500));
  }

  await Book.findByIdAndUpdate(req.params.id, {photo: file.name});

  res.status(200).json({
    success: true,
    data: file.name
  })
})
})

