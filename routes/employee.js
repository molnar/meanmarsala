var mongo = require('mongodb');
var MongoClient = require('mongodb').MongoClient,
    BSON = mongo.BSONPure,
    Server = require('mongodb').Server,
    db;

var mongoClient = new MongoClient(new Server('localhost', 27017));
mongoClient.open(function(err, mongoClient) {
    db = mongoClient.db("staffdb09");
    db.collection('staff', {strict:true}, function(err, collection) {
        if (err) {
            console.log("The 'staff' collection doesn't exist. Creating it with sample data...");
            populateDB();
        }
    });
});

 
exports.findById = function(req, res) {
    console.log(req.params);
    var id = parseInt(req.params.id);
    console.log('findById: ' + id);
    db.collection('staff', function(err, collection) {
        collection.findOne({'id': id}, function(err, item) {
            console.log(item);
            res.jsonp(item);
        });
    });
};

exports.findByManager = function(req, res) {
    var id = parseInt(req.params.id);
    console.log('findByManager: ' + id);
    db.collection('staff', function(err, collection) {
        collection.find({'managerId': id}).toArray(function(err, items) {
            console.log(items);
            res.jsonp(items);
        });
    });
};

exports.findAll = function(req, res) {
    var name = req.query["name"];
    db.collection('staff', function(err, collection) {
        if (name) {
            collection.find({"fullName": new RegExp(name, "i")}).toArray(function(err, items) {
                res.jsonp(items);
            });
        } else {
            collection.find().toArray(function(err, items) {
                //console.log(items)
                res.jsonp(items);
            });
        }
    });
};

exports.addEmployee = function(req, res) {
    var newEmployee = req.body; 
      
    console.log('Adding staff: ' + JSON.stringify(newEmployee));
    db.collection('staff', function(err, collection) {
        collection.insert(newEmployee, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
                res.end();
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
                res.end();
            }
        });

        //res.end();
    });
}

exports.updateEmployee = function(req, res) {
    var id = req.params.id;
    var editEmployee = req.body;
    delete editEmployee._id;
    console.log('Updating editEmployee: ' + id);
    console.log(JSON.stringify(editEmployee));
    db.collection('staff', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, editEmployee, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating editEmployee: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(editEmployee);
            }
        });
    });
}

exports.deleteEmployee = function(req, res) {
    
    var id = req.params.id;
    console.log(id)
    console.log('Deleting object: ' + id);
    db.collection('staff', function(err, collection) {
        collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
}
 
/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.
var populateDB = function() {
 
    console.log("Populating staff database...");
    var staff = [
        {"id":1,"firstName":"James","lastName":"King","fullName":"James King","managerId":0,"managerName":"","title":"President and CEO","department":"Corporate","cellPhone":"617-000-0001","officePhone":"781-000-0001","email":"jking@fakemail.com","city":"Boston, MA"},
        {"id":2,"firstName":"Julie","lastName":"Taylor","fullName":"Julie Taylor","managerId":1,"managerName":"James King","title":"VP of Marketing","department":"Marketing","cellPhone":"617-000-0002","officePhone":"781-000-0002","email":"jtaylor@fakemail.com","city":"Boston, MA"},
        {"id":3,"firstName":"Eugene","lastName":"Lee","fullName":"Eugene Lee","managerId":1,"managerName":"James King","title":"CFO","department":"Accounting","cellPhone":"617-000-0003","officePhone":"781-000-0003","email":"elee@fakemail.com","city":"Boston, MA"},
        {"id":4,"firstName":"John","lastName":"Williams","fullName":"John Williams","managerId":1,"managerName":"James King","title":"VP of Engineering","department":"Engineering","cellPhone":"617-000-0004","officePhone":"781-000-0004","email":"jwilliams@fakemail.com","city":"Boston, MA"},
        {"id":5,"firstName":"Ray","lastName":"Moore","fullName":"Ray Moore","managerId":1,"managerName":"James King","title":"VP of Sales","department":"Sales","cellPhone":"617-000-0005","officePhone":"781-000-0005","email":"rmoore@fakemail.com","city":"Boston, MA"},
        {"id":6,"firstName":"Paul","lastName":"Jones","fullName":"Paul Jones","managerId":4,"managerName":"John Williams","title":"QA Manager","department":"Engineering","cellPhone":"617-000-0006","officePhone":"781-000-0006","email":"pjones@fakemail.com","city":"Boston, MA"},
        {"id":7,"firstName":"Paula","lastName":"Gates","fullName":"Paula Gates","managerId":4,"managerName":"John Williams","title":"Software Architect","department":"Engineering","cellPhone":"617-000-0007","officePhone":"781-000-0007","email":"pgates@fakemail.com","city":"Boston, MA"},
        {"id":8,"firstName":"Lisa","lastName":"Wong","fullName":"Lisa Wong","managerId":2,"managerName":"Julie Taylor","title":"Marketing Manager","department":"Marketing","cellPhone":"617-000-0008","officePhone":"781-000-0008","email":"lwong@fakemail.com","city":"Boston, MA"},
        {"id":9,"firstName":"Gary","lastName":"Donovan","fullName":"Gary Donovan","managerId":2,"managerName":"Julie Taylor","title":"Marketing Manager","department":"Marketing","cellPhone":"617-000-0009","officePhone":"781-000-0009","email":"gdonovan@fakemail.com","city":"Boston, MA"},
        {"id":10,"firstName":"Kathleen","lastName":"Byrne","fullName":"Kathleen Byrne","managerId":5,"managerName":"Ray Moore","title":"Sales Representative","department":"Sales","cellPhone":"617-000-0010","officePhone":"781-000-0010","email":"kbyrne@fakemail.com","city":"Boston, MA"},
        {"id":11,"firstName":"Amy","lastName":"Jones","fullName":"Amy Jones","managerId":5,"managerName":"Ray Moore","title":"Sales Representative","department":"Sales","cellPhone":"617-000-0011","officePhone":"781-000-0011","email":"ajones@fakemail.com","city":"Boston, MA"},
        {"id":12,"firstName":"Steven","lastName":"Wells","fullName":"Steven Wells","managerId":4,"managerName":"John Williams","title":"Software Architect","department":"Engineering","cellPhone":"617-000-0012","officePhone":"781-000-0012","email":"swells@fakemail.com","city":"Boston, MA"}
    ];
 
    db.collection('staff', function(err, collection) {
        collection.insert(staff, {safe:true}, function(err, result) {});
    });
 
};