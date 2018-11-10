// Framework
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var method_override = require('method-override')

// Globales
var admin_password = "qwerty";

// Ejecutamos express
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(method_override("_method"));

mongoose.connect("mongodb://localhost/Curso_NodeJS", { useNewUrlParser: true });

// Definir el esquema
var esquema = {
	title: String,
	description: String,
	url: String,
	price: Number
}

var Producto = mongoose.model("Producto", esquema);

// Engine view
app.set("view engine","jade");

app.use(express.static("public"));

// Get "Hola mundo"
app.get("/", function(solicitud,respuesta){

	/*
	var data = {
		title: "Primer producto",
		description: "Es el mejor",
		url: "data.png",
		price: 10
	}

	var producto = new Producto(data);

	producto.save(function(err){
		console.log(producto);
	});
	*/

	//respuesta.send("Hola Mundo");
	respuesta.render("index");
});

// Admin

app.get("/admin", function(solicitud,respuesta){
	respuesta.render("admin/form");
});

app.post("/admin", function(solicitud,respuesta){

	if(solicitud.body.password == admin_password){

		Producto.find(function(error,documento){

			if(error) { console.log(error); }
			respuesta.render("admin/index",{ products: documento });
		});

	}
	else{
		respuesta.redirect("/");
	}
});

// Menu - GET

app.get("/menu", function(solicitud,respuesta){

	Producto.find(function(error,documento){

		if(error){ console.log(error); }
		respuesta.render("menu/index",{ products: documento });
	});
});

// Menu - POST

app.get("/menu/new", function(solicitud,respuesta){
	respuesta.render("menu/new");
});

app.post("/menu", function(solicitud,respuesta){

	if(solicitud.body.password == admin_password){

		//console.log(solicitud.body);

		var data = {
			title: solicitud.body.title,
			description: solicitud.body.description,
			url: "data.png",
			price: solicitud.body.price
		}

		var producto = new Producto(data);

		producto.save(function(error){
			if(error){ console.log(error); }
			console.log(producto);
			respuesta.render("index");
		});
	}
	else{
		respuesta.render("menu/new");
	}

	
});

// Menu - PUT

app.get("/menu/edit/:id",function(solicitud,respuesta){

	var id_producto = solicitud.params.id;

	Producto.findOne({"_id": id_producto}, function(error,producto){

		if(error){ console.log(error); }
		console.log(producto);
		respuesta.render("menu/edit", {product: producto});
			
	});

});

app.put("/menu/:id",function(solicitud,respuesta){

	if(solicitud.body.password == admin_password){

		//console.log(solicitud.body);

		var data = {
			title: solicitud.body.title,
			description: solicitud.body.description,
			price: solicitud.body.price
		};

		Producto.update({"_id": solicitud.params.id}, data, function(product){
			respuesta.redirect("/menu");
		});
	}
	else {
		respuesta.redirect("/");
	}
});

// Menu - DELETE

app.get("/menu/delete/:id", function(solicitud,respuesta){

	var id_producto = solicitud.params.id;

	Producto.findOne({"_id": id_producto}, function(error,producto){
		if(error){ console.log(error); }
		console.log(producto);
		respuesta.render("menu/delete", {product: producto});
			
	});

});

app.delete("/menu/:id", function(solicitud,respuesta){

	if(solicitud.body.password == admin_password){

		var id_producto = solicitud.params.id;

		Producto.remove({"_id": id_producto}, function(error){
			if(error){ console.log(error); }
			respuesta.redirect("/menu");
		});
	}
	else {
		respuesta.redirect("/menu");
	}	
});

// Puerto de escucha
app.listen(8080, function(){
	//console.log('\nYour server is running at 127.0.0.1:8080\n');
});



