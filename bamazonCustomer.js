var mysql = require('mysqyl');
var inquirer = require('inquirer');
var table = require('cli-table2');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon"
});

