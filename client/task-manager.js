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
    .controller('MainCtrl',function($scope,$http,dbManager){

        // VARIABLES

        $scope.categories = ["todo","understood","practiced","masterized"];

        // EVENTS
        $scope.$on('newDomain',function(event,args){
            $http.post('/addDomain', {name: args} )
                .then(function(response) {
                    $scope.todos.push(response.data);
                })
        });
        //INIT
        dbManager.getData(function(response){
            $scope.todos = response.data;
        })
        // SCOPE FUNCTIONS

        $scope.toggleExpand = function(todo) {
            todo.isExpand = !todo.isExpand;
        };

        $scope.saveTask = function(todo,task,index) {
            dbManager.saveTask(todo,task,index,function(response) {
                todo.tasks[index].description = (response.data.description);
                todo.tasks[index].status = (response.data.status);
                todo.isAddEditTask = false;
                todo.tasks[index].isEditing = false;
            })
        };

        $scope.addEditTask = function (todo) {
            todo.isAddEditTask = true;
        };

        $scope.editTask = function(todo,todoIndex) {
            todo.tasks[todoIndex].isEditing = true;
        };
        // SERVER FUNCTIONS

        $scope.deleteTask = function(todo,task,taskIndex) {
            dbManager.deleteTask(todo, task, function (response) {
                todo.tasks.splice(taskIndex, 1);
            })
        };

        $scope.deleteDomain = function(todo,todoIndex) {
            dbManager.deleteDomain(todo,function(response) {
                $scope.todos.splice(todoIndex,1);
            });
        }
        $scope.addTask = function(newTask,todo) {
            dbManager.addTask(todo,newTask,function(response) {
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
            $scope.$emit('newDomain', name);
            $scope.addDomainState =false;
            $scope.newDomainName = null;
        };
    })

    .factory('dbManager',['$http',function($http) {
        return {
            getData: function(callback) {
                                $http.get('/tasks')
                                    .then(callback);
            },
            saveTask: function(todo,task,index,callback) {
                                $http.post('/editTask', {taskId: task.id, taskDesc: task.description, taskStatus: task.status, domainId: todo.id} )
                                    .then(callback);
            },
            deleteTask:function(todo,task,callback) {
                                $http.post('/deleteTask', {todoId: todo.id, taskId: task.id} )
                                    .then(callback)
            },
            deleteDomain:function(todo,callback) {
                                $http.post('/deleteDomain', {todoId: todo.id} )
                                    .then(callback);
            },
            addTask:function(todo,newTask,callback){
                                $http.post('/addTask', {taskDesc: newTask.description, taskStatus: newTask.status, domainId: todo.id} )
                                    .then(callback);
            }
        }
    }]);