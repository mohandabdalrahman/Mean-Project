const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// Connect MongoDB at default port 27017.
mongoose.connect('mongodb+srv://mohand:Honda1994@cluster0.hq6ys.mongodb.net/node-angular?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
}, (err) => {
  if (!err) {
    console.log('MongoDB Connection Succeeded.👍')
  } else {
    console.log(`Error in DB connection: ${err} 👎`)
  }
});
