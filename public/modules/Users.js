(function() {
    // Config
    function Config($routeProvider) {
        $routeProvider.when('/admin/users', {
            templateUrl: 'views/users.html',
            controller: 'Users',
            title: 'Кандидати'
        });

        $routeProvider.when('/admin/companies', {
            templateUrl: 'views/users.html',
            controller: 'Users',
            title: 'Компании'
        });
    }

    // Service
    function Service($rootScope) {
        // Get users
        this.getUsers = function() {
            return $rootScope.promise.get('/api/admin/users');
        };

        this.getCompanies = function() {
            return $rootScope.promise.get('/api/admin/users?companies=true');
        };

        this.blockUser = function(id) {
            return $rootScope.promise.patch('/api/admin/block/' + id);
        };

        this.unblockUser = function(id) {
            return $rootScope.promise.patch('/api/admin/unblock/' + id);
        };
    }

    // Controller
    function Ctrl(UsersService, $rootScope, $scope, $location, $timeout) {
        console.log('Init Users Controller');
        $scope.location = $location;

        // Check for current user
        $rootScope
            .getCurrentUser()
            .then(function(currentUser) {
                // Check for the user's role
                if (currentUser.role !== 'ADMIN') {
                    $location.path('/home');
                } else {
                    if (location.pathname === '/admin/companies') {
                        // Get users
                        UsersService.getCompanies()
                            .then(function(response) {
                                console.log(response)
                                console.log($location.path());
                                $scope.users = response.data;
                                $scope.$apply();
                                $scope.loaded = true;
                                $scope.timeout = false;
                            })
                            .catch(function() {
                                $scope.loaded = true;
                                $scope.timeout = false;
                            });
                    } else {
                        // Get users
                        UsersService.getUsers()
                            .then(function(response) {
                                $scope.users = response.data;
                                $scope.$apply();
                                $scope.loaded = true;
                                $scope.timeout = false;
                            })
                            .catch(function() {
                                $scope.loaded = true;
                                $scope.timeout = false;
                            });
                    }

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

        $scope.blockUser = function(id, index) {
            UsersService.blockUser(id).then(function(res) {
                $scope.users[index].isBlocked = true;
                $scope.$apply();
            });
        };
        $scope.unblockUser = function(id, index) {
            UsersService.unblockUser(id).then(function(res) {
                delete $scope.users[index].isBlocked;
                $scope.$apply();
            });
        };
    }

    // Module
    angular
        .module('Users', ['ngRoute'])
        .config(Config)
        .service('UsersService', Service)
        .controller('Users', Ctrl);
})();
