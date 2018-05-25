(function() {
    // Config
    function Config($routeProvider) {
        $routeProvider.when('/message/:id', {
            templateUrl: '/views/message.html',
            controller: 'Message',
            resolve: {
                title: function($route) {
                    return 'Съобщение №' + $route.current.params.id;
                }
            }
        });
    }

    // Service
    function Service($rootScope, $routeParams) {
        return {
            // Get message
            getMessage: function() {
                return $rootScope.promise.get('/api/message/' + $routeParams.id);
            },

            // Delete advert
            deleteMessage: function(id) {
                return $rootScope.promise.delete('/api/message/' + id);
            }
        };
    }

    // Controller
    function Ctrl(MessageService, $rootScope, $scope, $timeout, $location) {
        console.log('Init Message Controller');
        //$rootScope.title = title;

        // Get message
        MessageService.getMessage()
            .then(function(response) {
                console.log(response.data);
                $scope.message = response.data.message;
                $scope.loaded = true;
                $scope.timeout = false;
                $scope.$apply();
            })
            .catch(function(err) {
                $scope.loaded = true;
                $scope.timeout = false;
                $scope.$apply();
                console.error(err);
            });

        // Loader
        $timeout(function() {
            if (!$scope.loaded) {
                $scope.timeout = true;
            }
        }, 1000);

        // Delete message
        $scope.deleteMessage = function() {
            MessageService.deleteMessage($scope.message.id)
                .then(function(response) {
                    console.log(response);
                })
                .catch(function(err) {
                    console.error(err.data);
                });
        };
    }

    // Module
    angular
        .module('Message', ['ngRoute'])
        .config(Config)
        .factory('MessageService', Service)
        .controller('Message', Ctrl);
})();
