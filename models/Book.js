const mongoose = require('mongoose');
const slugify = require('slugify');



const BookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a name'],
        unique: true,
        trim: true,
        maxlength:[50, 'Name can not be more than 50 characters']
    }, 
    slug: String,
    description: {
        type: String,
        required: [true, 'Please add a description'],
        maxlength:[500, 'Description can not be more than 500 characters']
    },
    averageCost: Number,
    photo: {
      type: String,
      default: 'no-photo.jpg'
    },
     author: {
        type: String,
        required: [true, 'Please add an author'],
        trim: true,
        unique: true
      },

      user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
      },
    },
    {
      toJSON: { virtuals: true }, 
      toObject: { virtuals: true }
    })
     
       
     
  
 //Create book slug from the name
 BookSchema.pre('save', function(next) { 
  this.slug = slugify(this.title, {lower: true})
  next();
 })
  


 //Cascade delete chapters when a book is deleted
 BookSchema.pre('remove', async function(next) {
  console.log(`Chapters being removed from book ${this._id}`);
  await this.model('Chapter').deleteMany({ book: this._id});
  next();
 })


 //Reverse populate with virtuals
 BookSchema.virtual('chapters', {
  ref: 'Chapter',
  localField: '_id',
  foreignField: 'book',
  justOne: false
 })



module.exports = mongoose.model('Book', BookSchema);