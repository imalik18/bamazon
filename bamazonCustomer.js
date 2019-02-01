var mysql = require('mysql')
var cTable = require('console.table');
var inquire = require('inquirer');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database : 'bamazon',
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  start();
});

function start() {
    con.query('SELECT * FROM products', function(err, results){
        console.table(results);
        orderRequest()
    })
}

function orderRequest() {
    inquire.prompt([
        {
            type: 'input',
            name: 'productId',
            message: "What product id would you like to order?"
        },
        {
            type: 'input',
            name: 'quantity',
            message: "How many would you like to order?"
        }
    ]).then(answers => {
        console.log(answers)
        con.query("SELECT * FROM products WHERE id = " + answers.productId, function (err, results) {
        console.log(results[0]);
            if(results[0].stock_quantity >= answers.quantity){
                console.log("enough.. place order")
                var newQuantity = parseInt(results[0].stock_quantity) - parseInt(answers.quantity)
                console.log("new quantity", newQuantity)
                con.query("UPDATE products SET stock_quantity =" + newQuantity + " WHERE id ="  + answers.productId, function(err, results){
                   if(results){
                       console.log("order successful")
                   }
                })
            }else {
                console.log("Sorry... out of stock");
            }
        })
        
    }) 
}