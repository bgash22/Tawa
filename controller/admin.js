var UserModel = require('../model/user');
var PlaceModel = require('../model/place');
var OrderModel = require('../model/order');
var bcrypt   = require('bcrypt-nodejs');

exports.user = function(req, res){
    UserModel.find({role:'user'}).exec(function(err, data){
        res.render('admin/user.ejs', {users: data});
    })    
}

//Update User status from admin panel/user
exports.updateStatus = function(req, res){
    var email = req.body.email;
    var status = req.body.status;    
    UserModel.findOneAndUpdate({"local.email":email}, {status: status}, {new:true, upsert:true}, function(err, data){
        if(err){
            console.log("Error in status update");
            res.json({ret:false});
        }
        else {
            res.json({ret:true});
        }
    })    
}

//Delete User from adminpanel/user
exports.deleteUser = function(req, res){
    var email = req.body.email;
    UserModel.find({"local.email":email}).remove().exec(function(err, data){
        if(err){
            res.json({ret:false});
        }
        else{
            res.json({ret:true});
        }
    });    
}

//Places response Places in the left-side bar
exports.places = function(req, res){    
    PlaceModel.find().exec(function(err, data){
        res.render('admin/place.ejs', {places: data});
    });
}

//Add Place from the adminpanel/place
exports.addPlace = function(req, res){
    var name = req.body.name;
    var latitude = req.body.latitude;
    var longitude = req.body.longitude;
    var capacity = req.body.capacity;
    var price = req.body.price;
    PlaceModel.update({name:name}, {$setOnInsert:{name:name, latitude:latitude, longitude:longitude, capacity:capacity, price:price, queue:"0"}}, {upsert:true}).exec(function(err, data){        
        if(err)
            res.json({ret:false});
        else   
            res.json({ret:true});
    })
}
//Delete Place 
exports.deletePlace = function (req, res){
    var name = req.body.name;
    PlaceModel.find({name:name}).remove().exec(function(err, data){
        if(err)
            res.json({ret:false});
        else
            res.json({ret:true});
    })
}

//Orders
exports.orders = function(req, res){
    OrderModel.find().exec(function(err, data){
        res.render('admin/order.ejs', {orders:data})
    })
}

//Delete existing order
exports.deleteOrder = function(req, res){
    var placeName = req.body.placeName;
    var userEmail = req.body.userEmail;
    OrderModel.find({placeName:placeName, userEmail:userEmail}).remove().exec(function(err, data){
        if(err)
            res.json({ret:false});
        else{
            res.json({ret:true});
        }
    })
}
//Order Status Change
exports.orderStatus = function(req, res){
    console.log("Here");
    var placeName = req.body.placeName;
    var userEmail = req.body.email;
    var status = req.body.status;
    var outTime = status == "False"?getDateTime():"";
    OrderModel.update({placeName:placeName, userEmail:userEmail}, {$set:{status:status, outTime:outTime}}, function(err, data){
        if(err)
            res.json({ret:false});
        else{
            PlaceModel.find({name:placeName}).exec(function(err, data){
                var queue;
                if(status == "True")
                    queue = parseInt(data[0].queue) +1;
                else
                    queue = parseInt(data[0].queue) -1;
                PlaceModel.update({name:placeName}, {$set:{queue:queue.toString()}}, function(err, data){
                    if(err)
                        res.json({ret:false, err:true});
                    res.json({ret:true, outTime:outTime});
                })
            })
        }
    })
}

//Change Password
exports.changePassword = function(req, res){
    var oldPassword = req.body.oldPassword;
    var newPassword = req.body.newPassword;
    var userEmail = req.user.local.email;
    UserModel.find({"local.email":userEmail, "local.password":generateHash(oldPassword)}).exec(function(err, data){
        if(err){
            console.log("Error in status update");
            res.json({ret:false});
        }
        else{
            UserModel.update({"local.email":userEmail}, {$set:{"local.password":generateHash(newPassword)}}, function(err, data){
                if(err)
                    res.json({ret:false, err:true});
                res.json({ret:true});
            })
        }
    })
}

function generateHash(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};
//Get current time.
function getDateTime(){
    var d = new Date(),
    minutes = d.getMinutes().toString().length == 1 ? '0'+d.getMinutes() : d.getMinutes(),
    hours = d.getHours().toString().length == 1 ? '0'+d.getHours() : d.getHours(),
    ampm = d.getHours() >= 12 ? 'pm' : 'am',
    months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
    days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    return days[d.getDay()]+' '+months[d.getMonth()]+' '+d.getDate()+' '+d.getFullYear()+' '+hours+':'+minutes+ampm;
}