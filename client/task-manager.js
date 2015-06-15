/* ANGULAR */

angular.module('MyApp',['ui.router'])
    .config(function($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise("/");

        $stateProvider
            .state('index', {
                url:"/",
                views: {
                    "header":  { templateUrl: "Views/header.tpl.html" },
                    "tasks":   { templateUrl: "Views/tasks.tpl.html" },
                    "newTask": { templateUrl: "Views/newTask.tpl.html" },
                    "toolbar": { templateUrl: "Views/toolbar.tpl.html",controller: "ToolbarCtrl"}

                },
            })
    })
    .controller('MainCtrl',function($scope,$http){

        // VARIABLES

        $scope.todos = [];
        $scope.categories = ["todo","understood","practiced","masterized"];

        // EVENTS
        $scope.$on('newDomain',function(event,args){
            $http.post('/addDomain', {name: args} )
                .then(function(response) {
                    console.log(response);
                    $scope.todos.push(response.data);
                })
        });
        //INIT
        $http.get('/tasks')
            .success(function(data) {
                $scope.todos = data;
                console.log(data);
            })
            .error(function(err) {
                console.log('Error: ' + err);
            });

        // SCOPE FUNCTIONS

        $scope.toggleExpand = function(todo) {
            todo.isExpand = !todo.isExpand;
        };
        $scope.saveTask = function(todo,task,index) {
            console.log(task.id,todo.id);
            $http.post('/editTask', {taskId: task.id, taskDesc: task.description, taskStatus: task.status, domainId: todo.id} )
                .then(function(response) {
                    todo.tasks[index].description = (response.data.description);
                    todo.tasks[index].status = (response.data.status);
                    todo.isAddEditTask = false;
                })
            todo.tasks[index].isEditing = false;
        };


        $scope.addEditTask = function (todo,task,index) {
            todo.isAddEditTask = true;
        };



        $scope.editTask = function(todo,index) {
            todo.tasks[index].isEditing = true;
        };
        // SERVER FUNCTIONS

        $scope.deleteTask = function(todo,task,index) {
            $http.post('/deleteTask', {todoId: todo.id, taskId: task.id} )
                .then(function(response) {
                    todo.tasks.splice(index,1);
                });
        };
        $scope.deleteDomain = function(todo,index) {
            $http.post('/deleteDomain', {todoId: todo.id} )
                .then(function(response) {
                    $scope.todos.splice(index,1);
                });
        }
        $scope.addTask = function(newTask,todo) {
            $http.post('/addTask', {taskDesc: newTask.description, taskStatus: newTask.status, domainId: todo.id} )
                .then(function(response) {
                    todo.tasks.push(response.data);
                    newTask.status = "";
                    newTask.description = "";
                    todo.isAddEditTask = false;
                })
        };
    })
    .controller('ToolbarCtrl', function($scope) {
        $scope.addDomainState = false;
        $scope.newDomainName = null;
        $scope.newDomain = function() {
            $scope.addDomainState = true;
        };
        $scope.addDomain = function(name) {
            console.log(name);
            $scope.$emit('newDomain', name);
            $scope.addDomainState =false;
            $scope.newDomainName = null;
        };
    });