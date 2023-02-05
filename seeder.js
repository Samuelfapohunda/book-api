const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');


//Load env vars
dotenv.config({ path: './config/config.env'})

//Load models
const Book = require('./models/Book');
const Chapter = require('./models/Chapter');
const User = require('./models/User');




//Connect to DB
mongoose.connect(process.env.MONGO_URI, { 
    useNewUrlParser: true,
    useUnifiedTopology: true,
 });

 // read JSON files
 
 const bookFile = fs.readFileSync('./_data/books.json', 'utf-8')
 const books = JSON.parse(bookFile);

 const chapterFile = fs.readFileSync('./_data/chapters.json', 'utf-8')
 const chapters = JSON.parse(chapterFile);

 const userFile = fs.readFileSync('./_data/users.json', 'utf-8')
 const users = JSON.parse(userFile);
 



 //Import into DB
 const importData = async () => {
       try {
        await Book.create(books);
        await Chapter.create(chapters);
        await User.create(users);
      
        console.log('Data Imported...'.green.inverse);
        process.exit();
       } catch (err) {
        console.error(err);
       }
 }


 //Delete data
 const deleteData = async () => {
    try {
     await Book.deleteMany();
     await Chapter.deleteMany();
     await User.deleteMany();

     console.log('Data destroyed...'.red.inverse);
     process.exit();
    } catch (err) {
     console.error(err);
    }
}


if(process.argv[2] === '-i') {
   importData();
} else if (process.argv[2] === '-d') {
    deleteData()
}