var mysql = require('mysql');
var inquirer = require('inquirer');
var table = require('console.table');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) {
        console.error("error connecting: " + err.stack);
    }
    loadProducts();
});

function loadProducts() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;

        console.table(res);

        promptCustomer();
    });
}

function promptCustomer(stock) {
    inquirer.prompt([{
        name: "ID",
        type:"input",
        message: "What is the ID of the item you would you like to purchase?"
    }
]).then(function (answer) {
        var choiceId = answer.ID;
        var product = checkStock(choiceId, stock);

        if (product) {
            promptForQuantity(product);
        } else {
            console.log("\nThat item is not in the inventory.");
            loadProducts();
        }
    });
}

function promptForQuantity(product) {
    inquirer.prompt([
            {
                type: "input",
                name: "quantity",
                message: "How many would you like? [Type Q to quit]",
                validate: function (input) {
                    return input > 0 || input.toLowerCase() === "q";
                }
            }
        ])
        .then(function(val) {
            
            var quantity = parseInt(val.quantity);

            if (quantity > product.stock_quantity) {
                console.log("\nInsufficient quantity!");
                loadProducts();
            }
            else {

                makePurchase(product, quantity);
            }
        });
}

function makePurchase(product, quantity) {
    connection.query(
        "UPDATE products SET stock_quantity = stock_quantity - ? WHERE item_id = ?",
        [quantity, product.item_id],
        function (err, res) {
   
            console.log("\nThank you for purchasing " + quantity + " " + product.product_name + "'s!");
            loadProducts();
        }
    );
}

function checkStock(choiceId, stock) {
    for (var i = 0; i < stock.length; i++) {
        if (stock[i].item_id === choiceId) {
            return stock[i];
        }
    }
    return null;
}

// function checkExit(choice) {
//     if (choice.toLowerCase() === "q") {
//         console.log("See ya");
//         process.exit(0);
//     }
// }
