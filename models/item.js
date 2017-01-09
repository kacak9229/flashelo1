const mongoose = require('mongoose');
const momentTimezone = require('moment-timezone');
const moment = require('moment');
const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: 'User'},
  category: { type: Schema.Types.ObjectId, ref: 'Category'},

  name: { type: String },
  price: { type: Number },
  image: { type: String},
  description: { type: String },
  timeleft: { type: Number, default: 24 },

  time : { type : Date },
  anotherTime: { type: Date, default: Date.now }
});

ItemSchema.pre('save', function(next) {
  console.log(moment());
  var dateMoment = moment();
  console.log(typeof dateMoment);
  var date = new Date();
  console.log(this.anotherTime);

  console.log("Date " + Date.now() );
  this.time = moment();
  next();
});

ItemSchema.methods.calculateTime = function() {

  var currentTime = moment()
  console.log(currentTime);
  var timeStored = this.time;
  console.log("RealTime " + timeStored);
  // var timeDiff = currentTime.diff(timeStored, 'h');
  // console.log(this.timeleft - timeDiff);

}


module.exports = mongoose.model('Item', ItemSchema);
