const express = require("express");
const bodyParser = require("body-parser");

//Adding mongoose
const mongoose = require("mongoose");

const app = express();


app.use('/public', express.static('public'));

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/todoListDB", {
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

app.get("/", function (req, res) {
	let today = new Date();
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
		if (foundItems.length === 0) {
			Item.insertMany(lesNews, function (err) {
				if (err) {
					console.log(err);
				} else {
					console.log("Successfuly inserted");
				}
			});
			res.redirect("/");
		} else {
			res.render("list", {
				listTitle: "Today",
				newListItems: foundItems,
			});
		}
	});
	//showScreen
});

app.post("/", function (req, res) {
	const itemName = req.body.newItem;
	const listName = req.body.list;
	//console.log('Placing the name list',listName);
	//console.log(itemName, listName);
	const item = new Item({ name: itemName });
	if (listName === "Today") {
		item.save();
		res.redirect("/");
	} else {
		List.findOne({ name: listName }, (errs, listres) => {
			if (errs) {
				console.error(errs);
			} else {
				//console.log(listres);
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
	console.log(listName);
	if (listName === "Today") {
		Item.findByIdAndRemove(itemID, function (err) {
			if (err) {
				console.log(err);
			} else {
				res.redirect("/");
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

app.get("/:customListName", function (req, res) {
	console.log(req.params.customListName);

	let customListNameRecived = req.params.customListName.toLowerCase();

	List.findOne({ name: customListNameRecived }, function (err, results) {
		if (!err) {
			if (!results) {
				const list = new List({
					name: customListNameRecived,
					items: lesNews,
				});

				list.save();
				res.redirect("/" + customListNameRecived);
			} else {
				res.render("list", {
					listTitle: results.name,
					newListItems: results.items,
				});
			}
		} else {
			console.log(err);
			//console.log(res);
		}
	});
});

app.listen(3000, function () {
	console.log("The app is runnig on port 3000");
});
