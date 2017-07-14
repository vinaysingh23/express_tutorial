var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var mongojs = require('mongojs');
var db = mongojs('customerapp', ['users']);
var expressValidator = require('express-validator');

var app = express();

//view Engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
//Body parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//set static path
app.use(express.static(path.join(__dirname, "public")));

//global vars
app.use(function(req, res, next){
	res.locals.errors = null;
	next();

});
//Expree validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

var users = [
	{
		id: 1,
		first_name: "vinay",
		last_name: "singh",
		email: "vinaysingh@gmail.com",
	},
	{
		id: 2,
		first_name: "vivek",
		last_name: "singh",
		email: "vivek123@gmail.com",
	},
	{
		id: 3,
		first_name: "rahul",
		last_name: "singh",
		email: "rahul23@gmail.com",
	}
];
	
app.get('/', function(req, res){
	//res.send("Hello World")
	//res.json(person)
	db.users.find(function (err, docs) {
	// docs is an array of all the documents in mycollection
		//console.log(docs);

		res.render('index', {
			title: "Customer",
			//users: users
			users: docs
		});

	})

	
});

app.post('/users/add', function(req, res){

	req.checkBody('first_name', 'First Name is Required').notEmpty();
	req.checkBody('last_name', 'Last Name is Required').notEmpty();
	req.checkBody('email', 'Email is Required').notEmpty();

	var errors = req.validationErrors();

	if(errors){
		res.render('index', {
			title: "Customer",
			users: users,
			errors: errors  
		});
		//console.log("ERROR");

	}else {
		var newUser = {
			first_name: req.body.first_name,
			last_name: req.body.last_name,
			email: req.body.email
		}
		console.log("SUCESS");
		db.users.insert(newUser, function(err, result){
			if(err){
				console.log(err);
			}
			res.redirect('/');
		});

	}

	//console.log(newUser);
});

app.delete('/users/delete/:id', function(req, res){
	console.log(req.params.id);
});

app.listen(3000, function () {
	console.log("server Stated on Port 3000 ...");
	// body...
})