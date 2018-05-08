var Company = angular.module('App.Company', ['ngRoute']);

// Route
Company.config([
    '$routeProvider',
    function($routeProvider) {
        $routeProvider.when('/company/:id', {
            templateUrl: 'views/company.html',
            controller: 'CompanyCtrl',
            title: 'Информация за фирма'
        });
    }
]);

// Controller
Company.controller('CompanyCtrl', function(
    $scope,
    $http,
    $window,
    $routeParams,
    $timeout
) {
    console.log('CompanyCtrl');

    // Loader
    $scope.loaded = false;
    $timeout(function() {
        if (!$scope.loaded) {
            $scope.timeout = true;
        }
    }, 1000);

    // Get company
    $http
        .get('/company/' + $routeParams.id)
        .then(function(response) {
            console.log(response);
            if (response.status === 200) {
                $scope.loaded = true;
                $scope.timeout = false;
                $scope.company = response.data;
            }
        })
        .catch(function(err) {
            $scope.loaded = true;
            $scope.timeout = false;
            console.error(err.data);
        });

    // (Admin) Block company
    $scope.blockCompany = function() {
        $http
            .patch('/company/block/' + $routeParams.id, { isBlocked: true })
            .then(function(response) {
                console.log(response);
                if (response.status === 200) {
                    $scope.loaded = true;
                    $scope.timeout = false;
                    $scope.company = response.data;
                }
            })
            .catch(function(err) {
                $scope.loaded = true;
                $scope.timeout = false;
                console.error(err.data);
            });
    };
});
