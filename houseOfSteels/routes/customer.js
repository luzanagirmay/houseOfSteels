var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');

// ==================================================
// Route Provide Login Window
// ==================================================
router.get('/login', function(req, res, next) {
	res.render('customer/login', {message: "Please Login"});
});


// =============================
// Route to add a new customer
// =============================

router.get('/addcustomer', function(req, res, next) {
	res.render('customer/addcustomer');
});


// ==================================================
// Route to edit one specific customer. Notice the view is editcustomer
// ==================================================
router.get('/:customerid/edit', function(req, res, next) {
  let query = "SELECT customer_id, firstname, lastname, email, phone, address1, city, state, zip from customer WHERE customer_id = " + req.params.customerid ; 

  // execute query
  db.query(query, (err, result) => {
		if (err) {
			console.log(err);
			res.render('error');
		} else {
			res.render('customer/editcustomer', {customer: result[0] });
		} 
 	});
});

// ==================================================
// Route Enable Registration
// ==================================================
router.get('/register', function(req, res, next) {
	res.render('customer/register');
});



// ============================================================
// Route to list all Customers. Notice the view is allcustomers
// ============================================================

router.get('/', function(req, res, next) {
  let query = "SELECT customer_id, firstname, lastname, email, phone from customer"; 
    
  // execute query
  db.query(query, (err, result) => {
		if (err) {
			console.log(err);
			res.render('error');
		}
	res.render('customer/allcustomers', {customers: result });
 	});
});

// ==================================================
// Route to delete one specific customer. 
// ==================================================
router.get('/:customerid/delete', function(req, res, next) {
  let query = "DELETE from customer WHERE customer_id = " + req.params.customerid ; 

  // execute query
  db.query(query, (err, result) => {
		if (err) {
			console.log(err);
			res.render('error');
		} else {
			res.redirect('/customer');
		} 
 	});
});


// ====================================================================
// Route to view one specific customer. Notice the view is onecustomer
// ====================================================================

router.get('/:customerid', function(req, res, next) {
  let query = "SELECT customer_id, firstname, lastname, email, phone, address1, city, state, zip from customer WHERE customer_id = " + req.params.customerid ; 

  // execute query
  db.query(query, (err, result) => {
		if (err) {
			console.log(err);
			res.render('error');
		} else {
			res.render('customer/onecustomer', {customer: result[0] });
		} 
 	});
});

// ==================================================
// Route Save Customer Registration
// ==================================================
router.post('/', function(req, res, next) {
  let insertquery = "INSERT INTO customer(firstname, lastname, email, phone, address1, city, state, zip, username, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"; 
    
	bcrypt.genSalt(10, (err, salt) => {
		bcrypt.hash(req.body.password, salt, (err, hash) => {
			if(err) { res.render('error');}

			db.query(insertquery,[req.body.firstname, req.body.lastname, req.body.email,req.body.phone,req.body.address1, req.body.city, req.body.state, req.body.zip, req.body.username, hash],(err, result) => {
				if (err) {res.render('error');
                         } else {
                             res.redirect('/');}
			});
		});
	});
});



//================================================================
// Route to recieve the added customer and save to database and
//================================================================ 

router.post('/', function(req, res, next) {

let insertquery = "INSERT INTO customer (firstname, lastname, email, phone, address1, city, state, zip) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"; 

	db.query(insertquery,[req.body.firstname,req.body.lastname,req.body.email,req.body.phone,req.body.address1, req.body.city, req.body.state, req.body.zip],(err, result) => {
	if (err) {
			console.log(err);
			res.render('error');
			} else {
                res.redirect('/customer');
			}
		
		});
});


// ==================================================
// Route to save edited customer. 
// ==================================================

router.post('/save', function(req, res, next) {

let updatequery = "UPDATE customer set firstname = ?,lastname = ?, email = ?, phone = ?, address1 = ?, city = ?, state = ?, zip = ? WHERE customer_id = " + req.body.customer_id; 

db.query(updatequery,[req.body.firstname,req.body.lastname,req.body.email,req.body.phone,req.body.address1, req.body.city, req.body.state, req.body.zip],(err, result) => {
	if (err) {
			console.log(err);
			res.render('error');
			} else {
res.redirect('/customer');
			}
		});
});

// ==================================================
// Route Check Login Credentials
// ==================================================
router.post('/login', function(req, res, next) {
  let query = "select customer_id, firstname, lastname, password from customer WHERE username = '" + req.body.username + "'"; 

  // execute query
  db.query(query, (err, result) => {
		if (err) {res.render('error');} 
		else {
			if(result[0])
				{
				// Username was correct
				// Check if password is correct
				bcrypt.compare(req.body.password, result[0].password, function(err, result1) {
					if(result1) {
						var custid = result[0].customer_id;
						req.session.customer_id = custid;

						var custname = result[0].firstname + " "+ result[0].firstname;
						req.session.custname = custname;
						
						// passwords match
						res.redirect('/');
					} else {
						// password do not match
						res.render('login', {message: "Wrong Password"});
					}
					});
				}
			else {res.render('login', {message: "Wrong Username"});}
		} 
 	});
});



module.exports = router;