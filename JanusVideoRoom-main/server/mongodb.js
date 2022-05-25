var MongoClient = require("mongodb").MongoClient;
var bcrypt = require("./bcrypt");
var ObjectId = require("mongodb").ObjectID;
const jwt = require('jsonwebtoken');
const nodemailer = require('./config/nodemailer.config');
const Agenda = require('agenda');
require("../index");

//const connectionString =
  //unlo"mongodb+srv://m63Admin:middiff2020@cluster0.rugp4.mongodb.net/mydb?retryWrites=true&w=majority";

const connectionString = process.env.MONGO;
var db;
var clientMongo;
var usersCollection;

MongoClient.connect(connectionString, { useUnifiedTopology: true }).then(
  (client) => {
    console.log("[MONGODB] Connected to Database");

    db = client.db("WebRTC");
    usersCollection = db.collection("WebRTC");
    // scheduleCollection = db.collection("schedule");
 

    clientMongo = client;
  });

// LOGIN AND REGISTRATION

function isEmailUnique(email, callback) {
  var query = { email: email };
  usersCollection.find(query).toArray(function (err, res) {
    if (err) throw err;
    callback(res);
  });
}


module.exports = { 

  // LOGIN AND REGISTRATION

  insertUser: function (user, callback) {

    isEmailUnique(user.email, function (res) {
      if (res.length == 0) {
        bcrypt.cryptPassword(user.password, function (err, hash) {
          if (err) throw err;
       
          var myobj = {
            name: user.name,
            surname: user.surname,
            email: user.email,
            password: hash,
            confirmed: false
          };

          usersCollection.insertOne(myobj, function (err) {
            if (err) throw err;
            nodemailer.sendConfirmationEmail(
              user.name,
              user.email
            );
            callback(true);
          });
        });
      } else {
        //Email already exists
        callback(false);
      }
    });
  },
  login : function(user, callback){

    var query = {email: user.email};

    usersCollection.find(query).toArray(function (err, res) {

      if (err) throw err; //TODO

      if(res.length == 0) callback(null, null, 404);
      else{
        if(res[0].confirmed == true){
          bcrypt.comparePassword(user.password, res[0].password, function(err, isPasswordMatch){
            if(err) throw err; //TODO
            if(isPasswordMatch){
              const token = jwt.sign({_id: res[0]._id, name: res[0].name}, process.env.JWT, {expiresIn: "30m"});

              callback(token, res[0], 200);

            } else callback(null, null, 401);
          })
        } else {
          //Email not confirmed
          callback(null, null, 401);
        }
      }
    });
  },
  confirmEmail : function(email, callback){
    var update_string = { "$set": {} };
    update_string.$set["confirmed"] = true;
    

    usersCollection.findOneAndUpdate({email: email}, update_string, (err, res) => {
      if (err) throw err; //TODO
      //Email confirmed
      callback();
    });
  }
  


  /*
  addSeats : function(){
    
    var status_5 = [];
    var status_8 = [];
    var status_10 = [];

    for(var i=0; i<5; i++) {
      status_5[i] = [];
      for(var j=0; j<15; j++) {
        status_5[i][j] = "free";
      }
    }

    for(var i=0; i<8; i++) {
      status_8[i] = [];
      for(var j=0; j<15; j++) {
        status_8[i][j] = "free";
      }
    }

    for(var i=0; i<10; i++) {
      status_10[i] = [];
      for(var j=0; j<15; j++) {
        status_10[i][j] = "free";
      }
    }

    var item = [{
      schedule : ObjectId("601e6a7dc2f6037b405b9fdf"),
      price : 6.5,
      status : status_10
      },{

      schedule : ObjectId("601e6af10a686423e781a240"),
      price : 5.5,
      status : status_10
    }];


    seatsCollection.insert(item);
      
  }*/
};



