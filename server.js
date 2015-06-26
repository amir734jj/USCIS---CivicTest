var express = require("express");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var sqlite3 = require('sqlite3').verbose();
var app = express();
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set("view engine", "jade");
app.locals.pretty = true;
app.use(express.static(process.argv[2] || __dirname + "/views"));
var _dbURL_ = "./database/db.sqlite";
var _SCORES_ = [];

app.get("/", function(req, res, next) {
	var db = new sqlite3.Database(_dbURL_);
	db.serialize(function() {
		db.all("SELECT Name AS Name, Score FROM 'Users' ORDER BY Score DESC", function(err, row) {
			_SCORES_ = [];
			for (var index = 0; index < row.length; index++) {
					_SCORES_.push({
						name: row[index].Name,
						score: row[index].Score
					});
			}
			next();
		});	
	});
	db.close();
});


app.get("/", function(req, res) {
	var db = new sqlite3.Database(_dbURL_);
	if(req.cookies.sessionid === ""){
		res.redirect("/login");
	} else {
		db.serialize(function() {
			db.all("SELECT * FROM 'Users' WHERE Hashcode = $sessionid", {
				$sessionid: req.cookies.sessionid
			}, function(err, row) {
				if(err){
					res.render("error.jade", { 
						message: "Unexpected Server Error"
					});
				}
				if(row.length === 0){
					res.render("login.jade", {
						unauthorized: false
					});
				} else {
					res.render("main.jade", {
						name: row[0].Name,
						score: row[0].Score,
						db: _SCORES_
					});
				}
			});
		});
	}
	db.close();
});

app.get("/login", function(req, res) {
	res.render("login.jade");
});

app.get("/register", function(req, res) {
	res.render("register.jade");
});

app.get("/logOut", function (req, res) {
	res.clearCookie("sessionid");
	res.redirect("/");
});

app.get("/testing", function (req, res) {
	res.render("testing.jade");
});

app.get("/learning", function (req, res) {
	res.render("learning.jade");
});

app.post("/setResult", function (req, res) {
	var db = new sqlite3.Database(_dbURL_);
	db.serialize(function() {
		db.run("UPDATE 'Users' SET Score = Score + $Increment WHERE Hashcode = $Sessionid", {
			$Increment: parseFloat(req.body.value),
			$Sessionid: req.cookies.sessionid
		}, function() {
			res.end("Score Updated Successfully!");
		});
	});
	db.close();
});

app.post("/login", function(req, res) {
	var db = new sqlite3.Database(_dbURL_);
	db.serialize(function() {
		db.all("SELECT * FROM 'Users' WHERE Username = $Username AND Password=$Password", {
			$Username: req.body.username,
			$Password: hashCode(req.body.password)
		}, function(err, row) {
			if(err){
				res.render("error.jade", { 
					message: "Unexpected Server Error"
				});
			}
			else if(row.length === 0) {
				res.render("login.jade", {
					unauthorized: true,
					message: "Wrong Username / Password"
				});
			} else {
				res.cookie("sessionid", row[0].Hashcode, {
					httpOnly: true
				});
				res.redirect("/");
			}
		});
	});
	db.close();
});

app.post("/register", function(req, res) {
	var db = new sqlite3.Database(_dbURL_);
	db.serialize(function() {
		db.run("INSERT INTO 'Users' ('Name', 'Email', 'Username', 'Password', 'Hashcode', 'Score') VALUES ($Name, $Email, $Username, $Password, $Hashcode, $Score)", {
			$Name: req.body.name,
			$Email: req.body.email,
			$Username: req.body.username,
			$Password: hashCode(req.body.password),
			$Hashcode: hashCode(req.body.name + req.body.email + req.body.username + req.body.password),
			$Score: 0
		}, function(err, row) {
			if(err){
				res.render("error.jade", {
					message: "Unexpected Server Error"
				});
			} else {
				res.redirect("/login");
			}
		});
	});
	db.close();
});

function hashCode(str) {
	var hash = 0;
	if (str.length == 0) return hash;
	for (i = 0; i < str.length; i++) {
		char = str.charCodeAt(i);
		hash = ((hash << 5) - hash) + char;
		hash = hash & hash;
	}
	return hash >= 0 ? hash : -1 * hash;
}

app.listen(80);