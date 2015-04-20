var express = require('express');
var app = express();
var flash = require('connect-flash');

//Contains key-value pairs of data submitted in the request body. 
//By default, it is undefined, and is populated when you use body-parsing 
//middleware such as body-parser and multer.
var bodyParser = require('body-parser');
var multer = require('multer');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var cookieParser = require('cookie-parser');
var session = require('express-session');
var mongoose = require('mongoose');
//CONNECTING MONGOdB REMOTELY AND LOCALLY
var connectionString = process.env.OPENSHIFT_MONGODB_DB_URL|| 'mongodb://localhost/test';
mongoose.connect(connectionString);

//Schema for creating new user
var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    firstName: String,
    lastName: String,
    email: String,
    follow: [String],
    wishing: [String], //favorite book
    reading: [String], //show the comic books that user is currently reading
    complete: [String],
    role: String,
    hidePI: Boolean,
    hideLI: Boolean
});
var UserModel = mongoose.model('UserModel', UserSchema);
var Satsuki = new UserModel({
    username: "satsuki",
    password: "satsuki",
    firstName: "Satsuki",
    lastName: "Nojima",
    email:"satsuki0803@gmail.com",
    role: "admin"
});
var ayumu = new UserModel({
    username: "ayumuoda",
    password: "moco0719",
    firstName: "Ayumu",
    lastName: "Oda",
    email: "ayumu@gmail.com",
    role: "admin"
});
var a = new UserModel({
    username: "amadou",
    password: "amadou",
    firstName: "Amadou",
    lastName: "Mybae",
    email: "amadou@gmail.com",
    role: "admin"
});
var b = new UserModel({
    username: "mina",
    password: "mina",
    firstName: "Mina",
    lastName: "Hosojima",
    email: "mina@gmail.com",
    
});
var c = new UserModel({
    username: "riki",
    password: "riki",
    firstName: "Riki",
    lastName: "Kotaka",
    email: "riki@gmail.com",

});
var d = new UserModel({
    username: "sho",
    password: "sho",
    firstName: "Sho",
    lastName: "Oda",
    email: "sho@gmail.com",

});
var e = new UserModel({
    username: "mao",
    password: "mao",
    firstName: "Mao",
    lastName: "Hosojima",
    email: "mao@gmail.com",

});
Satsuki.save();
ayumu.save();
a.save();
b.save();
c.save();
d.save();
e.save();
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(multer()); // for parsing multipart/form-data

app.use(flash());

app.use(session({ secret: 'this is the secret' }));
app.use(cookieParser());//for login
app.use(passport.initialize());//for login
app.use(passport.session());//for login
//to start static content that is insid the public folder
app.use(express.static(__dirname + '/public'));

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

//check if the user name and password are valid
passport.use(new LocalStrategy(
function (username, password, done) {

    UserModel.findOne({ username: username, password: password }, function (err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false); }
        return done(null, user);
    })
}));



//local is just username and password
app.post("/login", passport.authenticate('local'), function (req, res) {
    res.json(req.user);
});


//get logged in user infor!!
app.get("/loggedin", function (req, res) {
    res.send(req.isAuthenticated() ? req.user : '0');
});

//logout
app.post('/logout', function (req, res) {
    req.logOut();
    res.send(200);
});


//Registration
app.post("/register", function (req, res) {
    UserModel.findOne({ username: req.body.username }, function (err, user) {
        if (user)//if user already exist
        {
            res.send(500).send("User Already Exists");
        }
        else//if user does not exist
        {
            var newUser = new UserModel(req.body);
            newUser.save(function (err, user) {
                req.login(user, function (err)
                {
                    if (err) { return next(err); }
                    res.json(user);
                    return;
                });
            });
        }
    });
});

//check if usr is logged in
var auth = function (req, res, next) {
    if (!req.isAuthenticated())
        res.send(401);//if not authorized 
    else
        next();//let it through
};

//get all users
app.get("/rest/user", auth, function (req, res) {
    UserModel.find(function (err, users) {
        res.json(users);
    });
});

//deleting user
app.delete("/rest/user/:id", auth, function (req, res) {
    UserModel.findById(req.params.id, function (err, user) {
        user.remove(function (err, count) {
            UserModel.find(function (err, users) {
                res.json(users);
            });
        });
    });
});


//search and get one user
app.get("/user", function (req, res) {
    var text = req.query.text;
    UserModel.findOne({ username: text }, function (err, user) {
        res.json(user);
    });
});


//adding follower
app.get("/follow", function (req, res) {
    UserModel.findOneAndUpdate({ username: req.query.loguser }, { $push: { follow: req.query.followname } }, function (err, user) {
        res.json(user);
    });

});


//hide Personal info
app.get("/hidepi", function (req, res) {
    UserModel.findOneAndUpdate({ username: req.query.user }, { $set: { hidePI: req.query.hide, } }, function (err, manga) {
        if (err) return handleError(err);
        res.send(1);
        return;
    })
});

//hide Personal info
app.get("/hideli", function (req, res) {
    UserModel.findOneAndUpdate({ username: req.query.user }, { $set: { hideLI: req.query.hide, } }, function (err, manga) {
        if (err) return handleError(err);
        res.send(1);
        return;
    });
});

app.get("/unfollow", function (req, res) {
    UserModel.findOneAndUpdate({ username: req.query.loguser }, { $pull: { follow: req.query.followname } }, function (err, user) {
        if (err) return handleError(err);
        res.json(user);
    })
});


//checking existing follower in user
app.get("/followingcheck", function (req, res) {
    UserModel.findOne({ username: req.query.text1 }, function (err, user) {
        UserModel.findOne({ follow: req.query.foUser }, function (err, user) {
            if (!user) {
                res.send(500).send;
            }
            return;
        });
    });
});


//schema for inside of comment for comic books
var example = new mongoose.Schema({
    text: String,
    postedBy: String
});


//Schema for comic books that is on openshift mongodB server
var ComicSchema = new mongoose.Schema({
    picurl: String,
    title: String,
    author: String,
    genres: [String],
    publisher: String,
    description: String,
    ratings: Number,
    comment: [example]
}, { collection: 'mangas' });

var ComicBook = mongoose.model('ComicBook', ComicSchema);


//get details for the comic book
app.get("/detail", function (req, res) {
    ComicBook.findOne({ title: req.query.title }, function (err, manga) {
        if (err) return handleError(err);
        res.json(manga);
        return;
    })
});
//adding user's read list array
app.get("/read", function (req, res) {
    
    UserModel.findOneAndUpdate({ username: req.query.user }, { $addToSet: { reading: req.query.text } }, function (err, manga) {
        if (err) return handleError(err);
        res.send(1);
    return;
    })
});

//adding user's wish list
app.get("/wish", function (req, res) {
    
    UserModel.findOneAndUpdate({ username: req.query.user }, { $addToSet: { wishing: req.query.text } }, function (err, manga) {
        if (err) return handleError(err);
        res.send(1);
        return;
    })
});

//adding user's complete list
app.get("/compl", function (req, res) {
    
    UserModel.findOneAndUpdate({ username: req.query.user }, { $addToSet: { complete: req.query.text } }, function (err, manga) {
        if (err) return handleError(err);
        res.send(1);
        return;
    })
});

//delete read list of comic from user
app.get("/clearread", function (req, res) {
    
    UserModel.findOneAndUpdate({ username: req.query.user }, { $pull: { reading: req.query.text,} }, function (err, manga) {
        if (err) return handleError(err);
        res.send(1);
        return;
    })
});



//delete wish list of comic from user
app.get("/clearwish", function (req, res) {
    
    UserModel.findOneAndUpdate({ username: req.query.user }, { $pull: { wishing: req.query.text } }, function (err, manga) {
        if (err) return handleError(err);
        res.send(1);
    })});

//delete complete list of comic from user
app.get("/clearcompl", function (req, res) {
    
    UserModel.findOneAndUpdate({ username: req.query.user }, { $pull: { complete: req.query.text } }, function (err, manga) {
        if (err) return handleError(err);
        res.send(1);
    })
});

//search function for comic book
app.get("/search", function (req, res) {
    var text = req.query.text;
    ComicBook.find({ title: {$regex:text,$options:"$i"}}, function (err, mangas) {
        if (err) return handleError(err);
        res.json(mangas);
        return;
    })
});

app.get("/searchall", function (req, res) {
    ComicBook.find({},function (err, mangas) {
        if (err) return handleError(err);
        res.json(mangas);
        return;
    })
});

//adiing comment
app.get("/addComment", function (req, res) {
    ComicBook.findOneAndUpdate({ title: { $regex: req.query.title } }, { $push: { comment: { text: req.query.txtcomment, postedBy: req.query.usernames } } }, function (err, manga) {
        res.json(manga);
    })
});





//  Set the environment variables we need.
var ip = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var port = process.env.OPENSHIFT_NODEJS_PORT || 3000;
    
app.listen(port ,ip);