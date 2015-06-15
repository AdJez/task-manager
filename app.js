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
    id: String,
    description:  String,
    status: String,
    isEditing: Boolean
},{ _id: false });

var domainSchema = new Schema({
    id: String,
    name: String,
    tasks : [taskSchema],
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
        res.send(data);
    });
});

router.get('*', function(req,res){
    res.render('index');
});

router.post('/addTask', function(req,res) {
    var newTaskId = mongoose.Types.ObjectId();
    var newTask = {
        id : newTaskId,
        description: req.body.taskDesc,
        status: req.body.taskStatus,
        isEditing : false
    };

    Domains.update(
        { id: req.body.domainId },
        { $push: { 'tasks': newTask}}, function(err,data) {
            if (err) { res.send("Error updating") }
            res.send(newTask);
        }
    )
});

router.post('/addDomain', function(req,res) {
    var newDomainId = mongoose.Types.ObjectId();
    var newDomain = new Domains({
        id : newDomainId,
        name: req.body.name,
        tasks: [],
        isExpand: false
    });
    newDomain.save(function(err,data) {
        if (err) res.send("Erreur:"+err);
        res.send(newDomain);
    });
});
router.post('/editTask', function(req,res) {
    var domainId = req.body.domainId,
    taskId = req.body.taskId,
    description = req.body.taskDesc,
    status = req.body.taskStatus;

    Domains.update(
        { id: domainId ,'tasks.id':taskId },
        {'$set': { 'tasks.$.description': description, 'tasks.$.status': status}}, function(err,numAffected) {
            if (err) { res.send("Error updating") }
            res.send({'description': description, 'status': status});
        }
    );
});

router.post('/deleteTask', function(req,res) {
    console.log(req.body);

    Domains.update(
        { id: req.body.todoId },
        { $pull: { 'tasks': {
            'id': req.body.taskId
        }}
        }, function(err, data) {
            if (err) {console.log(err);}
            res.send(req.body.taskId + "Removed from" + req.body.todoId);
        }
    )
});
router.post('/deleteDomain', function(req,res) {
    var todoId = req.body.todoId;

    Domains.findOne({id: todoId}).remove(function(err,data){
        if(err) {res.send('Error: '+ err); };
        res.send("domainId: "+todoId+" removed");
    })
});

app.use('/', router);

app.listen(8080, function() {
    console.log('listening');
});

