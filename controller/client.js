var config = require('../config/config');
var placeModel = require('../model/place');
var orderModel = require('../model/order');

exports.index = function(req, res){
    placeModel.find().exec(function(err, data){
        var placeData = "[";
        for(var i = 0; i < data.length; i++){
            if(i != 0) placeData += ',';
            placeData += '{"name":"'+data[i].name+'", "latitude":"'+data[i].latitude+'", "longitude":"' +data[i].longitude+'", "capacity":"'+data[i].capacity+'", "queue":"'+data[i].queue+'", "price":"'+data[i].price+'"}';
        }
        placeData += "]";
        res.render('index', {mapkey:config.mapKey, geoKey:config.geoKey, placeData:placeData});
    })
}

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


//Find order is already made.
exports.book = function(req, res){
    var placeName = req.body.placeName;
    orderModel.find({placeName:placeName, userEmail:req.user.local.email}).exec(function(err, data){
        if(data.length != 0){
            res.json({ret:false, number:data[0].number});
        }
        else {
            res.json({ret:true});
        }
    })
}
//Make order
exports.qbook = function(req, res){
    var placeName = req.body.placeName;
    var gender = req.body.gender;
    var dress = req.body.dress;
    var color = req.body.color;
    var number = req.body.bookNum;
    console.log(number);

    orderModel.find({placeName:placeName, userEmail:req.user.local.email}).exec(function(err, data){
        if(data.length != 0){
            res.json({ret:false});
        }
        else {            
            var newOrder = new orderModel();
            newOrder.placeName = placeName;
            newOrder.userEmail = req.user.local.email;
            newOrder.gender = gender;
            newOrder.dress = dress;
            newOrder.color = color;
            newOrder.number = number;
            newOrder.orderTime = getDateTime();
            newOrder.status = "True";
            newOrder.save(function(err){
                if(err)
                    res.json({ret:false, err:true});
                else{
                    placeModel.find({name:placeName}).exec(function(err, data){
                        var queue = parseInt(data[0].queue) + 1;
                        placeModel.update({name:placeName}, {$set:{queue:queue.toString()}}, function(err, data){
                            if(err)
                                res.json({ret:false, err:true});
                            res.json({ret:true});
                        })
                    })
                }                    
            });
        }
    })    
}