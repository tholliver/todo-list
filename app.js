const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.set('view engine', 'ejs');

app.get("/",function(req,res){
	var today = new Date();
	var currentDay = today.getDay();	//actual day (0-6)
	var month = today.getMonth();     //actual month (0-11)
	var actualDate = today.getDate() //the actual date (1-31)
    
    const days = ["Lunes","Martes","Miercoles","Jueves","Viernes",
    			  "Sabado","Domingo"];
    const months = ["Enero","Febrero","Marzo","Abril",
    				"Mayo","Junio","Julio","Agosto",
    				"Septiembre","Octubre","Noviembre","Diciembre"]
    const showScreen = days[today.getDay()]+","+today.getDate()+" "+months[today.getMonth()];
    res.render("list",{deyo: showScreen});

 
});




app.listen(3000,function(){
 console.log("The app is runnig on port 3000");
});
