const Authentication = require('./controllers/authentication');
const passportService = require('./services/passport');
const passport = require('passport');
const async = require('async');

// models
const User = require('./models/user');
const Category = require('./models/category');
const Item = require('./models/item');

// To be remove later
const faker = require('faker');


// Passport to added
const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false });

module.exports = function(app) {


  // Signin route - Good
  app.post('/api/signin', requireSignin, function(req, res, next) {
    res.json  ({ token: Authentication.tokenForUser(req.user) });
  });

  // Signup route - Good
  app.post('/api/signup', function(req, res, next) {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
      return res.status(422).send({ error: 'You must provide email and password'});
    }
    // See if a user with the given email exists
    User.findOne({ email: email }, function(err, existingUser) {
      if (err) { return next(err); }
      // If a user with email does exist, return an error
      if (existingUser) {
        return res.status(422).send({ error: 'Email is in use' });
      }
      // If a user with email does NOT exist, create and save user record
      const user = new User({
        email: email,
        password: password
      });
      user.save(function(err) {
        if (err) { return next(err); }
        // Repond to request indicating the user was created
        res.json({ token: Authentication.tokenForUser(user) });
      });
    });
  });

  // Home categories - Good
  app.get('/api/categories', function(req, res, next) {
    Category.find({}, function(err, categories) {
      if (categories) {
        res.json(categories);
      } else {
        res.send({ message: "Error looking for categories, Try again later" });
      }
    });
  });

  // Item's category in [array] - Good
  app.get('/api/items/:category', function(req, res, next) {

    async.waterfall([
      function(callback) {
        Category.findOne({ name: req.params.category })
        .lean().exec(function(err, category) {
          callback(err, category);
        });
      },

      function(category, callback) {
        Item.find({ category: category._id })
        .lean().exec(function(err, items) {
          if (items) {
            res.json(items);
          } else {
            res.send({ message: "Couldn't find items that you are looking for"});
          }
        });
      }
    ]);
  });

  // Profile - Good
  app.get('/api/profile', requireAuth, function(req, res, next) {
    User.findOne({ _id: req.user._id })
    .lean().exec(function(err, user) {
      if (user) {
        res.json(user);
      } else {
        res.json({ message: "No such User" });
      }
    });
  });

  // Search for a name - Returns an array of Objects - Need to use some other search engine
  app.post('/api/search/:name', requireAuth, function(req, res, next) {
    Item.find({ name: req.params.name }, function(err, items) {
      console.log(items.length);
      if (items.length > 0) {
        res.json(items);
      } else if (items.length === 0){
        res.json({ message: "Item that you are looking for doesn't exist"});
      }
      
    });
  });

  // Will remove soon, to store data in mongodb
  // app.get('/api/:category', function(req, res, next) {
  //
  //   for (i = 0; i < 25; i++) {
  //     var item = new Item();
  //     item.category = req.params.category;
  //     item.name = faker.commerce.productName();
  //     item.price = faker.commerce.price();
  //     item.image = faker.image.cats();
  //     item.save();
  //   }
  //
  //   res.send("Successfully save");
  // });
  //
  // app.get('/api/create-category/:name', function(req, res, next) {
  //   var category = new Category();
  //   category.name = req.params.name;
  //   category.save(function(err) {
  //     res.send("Successfully created");
  //   });
  // });

}
