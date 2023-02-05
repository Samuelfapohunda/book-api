const mongoose = require('mongoose');

const ChapterSchema = new mongoose.Schema({
   chapter:{
        type: Number,
        required: true,
        trim: [true, 'Please add a title']    
    },

    book:{
        type: mongoose.Schema.ObjectId,
        ref: 'Book',
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
      }
});




//Static method to get average of course tuition 
ChapterSchema.statics.getAverageCost = async  function (bookId) {



const obj = await this.aggregate([
    {
        $match: {book: bookId}
    }, 
    { 
        $group: {
            _id: '$book',
            averageCost: { $avg: '$tuition'}
        }
    }
]); 

try {
    await this.model('Book').findByIdAndUpdate(bookId, {
        averageCost: Math.ceil(obj[0].averageCost / 10) * 10
    })
} catch (err) {
    console.log(err);
}

}






// Call getAverageCost after save
ChapterSchema.post('save', function() {
    this.constructor.getAverageCost(this.book)
})


// Call getAverageCost before remove
ChapterSchema.pre('remove', function() {
    this.constructor.getAverageCost(this.book)
})

module.exports = mongoose.model('Chapter', ChapterSchema)