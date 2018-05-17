(function() {
    // Config
    function Config($routeProvider) {
        $routeProvider.when('/company/:id', {
            templateUrl: 'views/company.html',
            controller: 'Company',
            title: 'Информация за фирма'
        });
    }

    // Service
    function Service($rootScope, $routeParams) {
        // Get company
        this.getCompany = function() {
            return $rootScope.promise.get('/api/company/' + $routeParams.id);
        };

        // (Admin) Block company
        this.blockCompany = function() {
            return $rootScope.promise.patch('/api/company/block/' + $routeParams.id, {
                isBlocked: true
            });
        };
    }

    // Controller
    function Ctrl(CompanyService, $scope, $timeout, $rootScope, $location) {
        console.log('Init Company Controller');

        // Check for current user
        $rootScope
            .getCurrentUser()
            .then(function() {
                // Get company
                CompanyService.getCompany()
                    .then(function(response) {
                        console.log(response);
                        $scope.company = response.data;
                        $scope.loaded = true;
                        $scope.timeout = false;
                    })
                    .catch(function(err) {
                        $scope.loaded = true;
                        $scope.timeout = false;
                        console.error(err.data);
                    });

                // Show loading wheel if needed after 1 second
                $timeout(function() {
                    if (!$scope.loaded) {
                        $scope.timeout = true;
                    }
                }, 1000);
            })
            // If there's no user
            .catch(function() {
                // Redirect to the login
                $location.path('/login');
            });

        // (Admin) Block company
        $scope.blockCompany = CompanyService.getCompany.bind(null);
    }

    // Module
    angular
        .module('Company', ['ngRoute'])
        .config(Config)
        .service('CompanyService', Service)
        .controller('Company', Ctrl);
})();
