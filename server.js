var express = require('express'),
    employees = require('./routes/employee');
 
var app = express();
//app.use(express.bodyParser()); <----Deprecated
app.use(express.urlencoded()); 
app.use(express.json());
app.use(function(req, res, next) {
	//to allow crossdomain locally
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
 //http://stackoverflow.com/questions/7067966/how-to-allow-cors-in-express-nodejs
  next();
});

app.get('/employees/:id/reports', employees.findByManager);
app.get('/employees/:id', employees.findById);
app.get('/employees', employees.findAll);
app.post('/employees', employees.addEmployee);
app.put('/employees/:id', employees.updateEmployee);
app.delete('/employees/:id', employees.deleteEmployee);

app.listen(3000);
console.log('Listening on port 3000...');