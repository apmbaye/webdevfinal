In order to use mongoimport, 
make sure you are using the database.json file and that you specify -- jsonArray
This should give you a collection of 100 mangas in case you want to create a local database.
Also make sure that your local database will be called 'mangas'

Pre existing users :


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