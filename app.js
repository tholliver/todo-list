const { MongoClient } = require('mongodb');
const express = require("express");
const bodyParser = require("body-parser");

const path = require('path');

require('dotenv').config();


const url_server = process.env.URI_MONGO;

//Adding mongoose

const mongoose = require("mongoose");
//Starting
/*
const uri = "mongodb+srv://"+USERNAME+":"+PASSWORD+"@cluster0.ollqx.mongodb.net/Cluster0?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const db = client.db("sample_airbnb");
  const collection = client.db('sample_airbnb').collection('listingsAndReviews').find({});
  //console.log(collection);
  client.close();
});
//

*/

const app = express();

//app.use("/public", express.static("public"));

app.set('views', path.join(__dirname, 'views'));

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));



//app.use(express.static("public"));
app.use(express.static(path.join(__dirname, 'public')))

//old URL 
// "mongodb://localhost:27017/todoListDB"
mongoose.connect(url_server, {
	useUnifiedTopology: true,
	useNewUrlParser: true,
	useFindAndModify: false,
});

const itemsSchema = {
	name: String,
};

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
	name: "Aqui se apilaran las notas",
});
const item2 = new Item({
	name: "Actualizar CI",
});

const lesNews = [item1, item2];

const listSchema = {
	name: String,
	items: [itemsSchema],
};

const List = mongoose.model("List", listSchema);

app.get('/', function (req, res, next) {
    res.render('index', {});
});

app.get("/tasklist", function (req, res) {
	console.log("Password mass");
	let today = new Date();
	var todoLits=[];
	// The new one 


	// The old one 
	List.find({}, function (err, foundItems) {
		//console.log("Massa tips",foundItems);
		if (foundItems) {
			todoLits = foundItems;
		} else {
			console.log("Someting went wrong, reciving data", err);
		}
	});
	/*	let currentDay = today.getDay();	//actual day (0-6)
	let month = today.getMonth();     //actual month (0-11)
	let actualDate = today.getDate() //the actual date (1-31)
    
    const days = ["Lunes","Martes","Miercoles","Jueves","Viernes",
    			  "Sabado","Domingo"];
    const months = ["Enero","Febrero","Marzo","Abril",
    				"Mayo","Junio","Julio","Agosto",
    				"Septiembre","Octubre","Noviembre","Diciembre"]
    const showScreen = days[today.getDay()]+","+today.getDate()+" "+months[today.getMonth()];
    */
	//Trying methods
	let options = { weekday: "long", day: "numeric", month: "long" };
	let actualDay = today.toLocaleDateString("es-ES", options);

	//Rendering new the items from database

	Item.find({}, function (err, foundItems) {
		if (err) {
			/*Item.insertMany(lesNews, function (err) {
				if (err) {
					console.log(err);
				} else {
					console.log("Successfuly inserted");
				}
			});*/
			console.log(err);
			//res.redirect("/");
		} else {
			res.render("list", {
				alltodos: todoLits,
				listTitle: "Today",
				newListItems: foundItems,
			});
		}
	});

	//showScreen
});

//The custon post for add new items into lists in the db
app.post("/", function (req, res) {
	console.log("Massa BRO given params: ");
	const itemName = req.body.newItem;
	const listName = req.body.list;
	console.log('Placing the name list',listName);
	console.log('itemName', listName);
	const item = new Item({ name: itemName });
	if (listName === "Today") {
		item.save();
		res.redirect("/tasklist");
	} else {
		List.findOne({ name: listName }, (errs, listres) => {
			if (errs) {

				console.error(errs);
			} else {
		 		console.log("Found the lists: ",listres);
				if (listres) {
					listres.items.push(item);
					listres.save();
					res.redirect("/" + listName);
				} else {
					res.status(400).send("Errores message");
				}
			}
		});
	}
});

app.post("/delete", function (req, res) {
	const itemID = req.body.checkbox;
	const listName = req.body.listNames; //if We Need to delete a todo-list
	//console.log("Deleting....: ", listName);
	if (listName === "Today") {
		Item.findByIdAndRemove(itemID, function (err) {
			if (err) {
				console.log(err);
			} else {
				res.redirect("/tasklist");
			}
		});
	} else {
		List.findOneAndUpdate(
			{ name: listName },
			{ $pull: { items: { _id: itemID } } },
			function (err, foundList) {
				if (!err) {
					res.redirect("/" + listName);
				}
			}
		);
	}
});


app.post("/deletelist", function (req, res) {
	const itemID = req.body.removebox;
	let listName = req.body.listass; //if We Need to delete a todo-list
	//console.log("We selected...: ", req.body.listass);
	if (listName) {
		List.deleteOne({ name: listName }, function (err) {
			if (err) {
				console.log(err);
			} else {
				res.redirect("/tasklist");
			}
		});
	} else {
		res.redirect("/tasklist");
	}
});

app.get("/:customListName", function (req, res) {
	console.log("Entering new list.....", req.params.customListName);
	var todoLits = [];
	//Maybe not the practical second query | Is getting the TODO-Lists
	List.find({}, function (err, foundItems) {
		if (foundItems) {
			todoLits = foundItems;
		} else {
			console.log("Someting went wrong, retrieving lists data", err);
		}
	});

	//const customListNameRecived = req.params.customListName.toLowerCase();
	const customListNameRecived = req.params.customListName;
	//let upperName = customListNameRecived.charAt(0).toUpperCase() + customListNameRecived.slice(1);
	List.findOne({ name: customListNameRecived }, function (err, results) {
		if (!err) {
			if (!results) {
				const list = new List({
					//lesNews
					name: customListNameRecived,
					items: [],
				});

				list.save();

				res.redirect("/" + customListNameRecived);
			} else {
				res.render("list", {
					alltodos: todoLits,
					listTitle: customListNameRecived,
					newListItems: results.items,
				});
			}
		} else {
			console.log(err);
			//console.log(res);
		}
	});
});

app.listen(process.env.PORT || 5000, function () {
	console.log("The app is runnig on port 5000");
});
