/* ANGULAR */

angular.module('MyApp',[])

    .controller('MainCtrl',function($scope,$http){

        $scope.todos = [];

        $http.get('/tasks')
            .success(function(data) {
                $scope.todos = data;
                console.log(data);
            })
            .error(function(err) {
                console.log('Error: ' + err);
            });
        $scope.categories = ["todo","understood","practiced","masterized"];

        $scope.editTask = function(todo,index) {
            todo.tasks[index].isEditing = true;
        };

        $scope.addTask = function(newTask,todo) {

            var copyTask = angular.copy(newTask);

            $http.post('/newTask', {description: newTask.description, status: newTask.status, domain: todo.domain} )
                .success(function(data, status, headers, config) {
                    todo.tasks.push(copyTask);
                    console.log(data);
                    newTask.status = "";
                    newTask.description = "";
                    todo.isAddEditTask = false;
                    console.log("Succès");
                })
                .error(function(data, status, headers, config) {
                    console.log("ErrData: " +data);
                });
        };
        $scope.toggleExpand = function(todo) {
            todo.isExpand = !todo.isExpand;
        },
            $scope.saveTask = function(todo,index) {
                todo.tasks[index].isEditing = false;
            };
        $scope.addEditTask = function (todo) {
            todo.isAddEditTask = true;
        }
    });