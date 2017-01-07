const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: 'User'},
  category: { type: Schema.Types.ObjectId, ref: 'Category'},

  name: { type: String, unique: true },
  price: { type: Number },
  image: { type: String},
  description: { type: String },
  
  time : { type : Date, default: Date.now }
});

module.exports = mongoose.model('Item', ItemSchema);
