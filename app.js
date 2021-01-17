const express = require("express");
const bodyParser = require("body-parser");

//Adding mongoose
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));

app.get("/",function(req,res){
	let today = new Date();
	let currentDay = today.getDay();	//actual day (0-6)
	let month = today.getMonth();     //actual month (0-11)
	let actualDate = today.getDate() //the actual date (1-31)
    
    const days = ["Lunes","Martes","Miercoles","Jueves","Viernes",
    			  "Sabado","Domingo"];
    const months = ["Enero","Febrero","Marzo","Abril",
    				"Mayo","Junio","Julio","Agosto",
    				"Septiembre","Octubre","Noviembre","Diciembre"]
    const showScreen = days[today.getDay()]+","+today.getDate()+" "+months[today.getMonth()];

    //Trying methods 
    let options = {weekday:"long", day: "numeric",month: "long"};
    let actualDay = today.toLocaleDateString("es-ES", options); 
    res.render("list",{deyo: actualDay}); //showScreen

 
});


app.post("/",function(req,res){
	let item =  req.body.newItem;
	console.log(item);
});

app.listen(3000,function(){
 console.log("The app is runnig on port 3000");
});
