var express = require('express');
var util = require('util');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var path = require('path');

var app = express();
app.use(express.static(path.join(__dirname, 'client')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('views', './server/views');
app.set('view engine', 'ejs');

// ----- DATABASE -----

var db = mongoose.connect('mongodb://localhost/task-manager');
Schema = mongoose.Schema;

var taskSchema = new Schema ({
    description:  String,
    status: String,
    isEditing: Boolean
});

var domainSchema = new Schema({
    domain: String,
    tasks : Array,
    isExpand: Boolean
});

var Domains = mongoose.model('tasks', domainSchema);

// ----- ROUTING -----
var router = express.Router()

router.get('/', function(req,res) {
    res.render('index');
});

router.get('/tasks', function(req,res) {
    Domains.find(function(err, data) {
        if (err){ res.send(err) }
        console.log(data);
        res.send(data);
    });
});

router.get('*', function(req,res){
    res.render('index');
});

router.post('/newtask', function(req,res) {
    console.log(req.body);

    Domains.update(
        { domain: req.body.domain },
        { $push: { 'tasks': {
            'description': req.body.description,
            'status': req.body.status,
            'isEditing': false
        }}
        }, function(err, data) {
            if (err) {console.log(err);}
            res.send("YO");
        }
    )
});

app.use('/', router);

app.listen(8080, function() {
    console.log('listening');
});

