const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.MONGODB_URI;

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB', err));

  const userSchema = new mongoose.Schema({
    name: { type: String, required: true },

  });
  
  const User = mongoose.model('users', userSchema);

async function get(){
    let res = await User.find()
    console.log(res)

}

get()


// const newUser = new User({ name: 'John Doe' });
// newUser.save()
//   .then(user => console.log('New user created:', user))
//   .catch(err => console.error('Failed to create user:', err));


