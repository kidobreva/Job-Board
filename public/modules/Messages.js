(function() {
    // Config
    function Config($routeProvider) {
        $routeProvider.when('/messages', {
            templateUrl: 'views/messages.html',
            controller: 'Messages',
            title: 'Съобщения'
        });
    }

    // Service
    function Service($rootScope) {
        // Get messages
        this.getMessages = function() {
            return $rootScope.promise.get('/api/my-messages');
        };
    }

    // Controller
    function Ctrl(MessagesService, MessageService, $rootScope, $scope, $location, $timeout) {
        console.log('Init Messages Controller');

        // Check for current user
        $rootScope
            .getCurrentUser()
            .then(function(currentUser) {
                // Check for the user's role
                if (currentUser.role === 'USER') {
                    $location.path('/home');
                } else {
                    // Get messages
                    MessagesService.getMessages()
                        .then(function(response) {
                            console.log(response.data);
                            $scope.messages = response.data.messages;
                            $scope.loaded = true;
                            $scope.timeout = false;
                            $scope.$apply();
                        })
                        .catch(function(res) {
                            console.log(res);
                            $scope.loaded = true;
                            $scope.timeout = false;
                            $scope.$apply();
                        });

                    // Show loading wheel if needed after 1 second
                    $timeout(function() {
                        if (!$scope.loaded) {
                            $scope.timeout = true;
                        }
                    }, 1000);
                }
            })
            // If there's no user
            .catch(function() {
                // Redirect to the login
                $location.url('/auth?redirect=' + $location.path());
            });

        $scope.showMessage = function(id) {
            $location.path('/message/' + id);
        };

        // Delete message
        $scope.deleteMessage = function(id, index) {
            MessageService.deleteMessage(id)
                .then(function() {
                    $scope.messages.splice(index, 1);
                    $scope.$apply();
                })
                .catch(function(err) {
                    console.error(err.data);
                });
        };
    }

    // Module
    angular
        .module('Messages', ['ngRoute'])
        .config(Config)
        .service('MessagesService', Service)
        .controller('Messages', Ctrl);
})();
