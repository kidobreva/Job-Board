var CompaniesModule = angular.module('App.Companies', ['ngRoute']);

CompaniesModule.config([
    '$routeProvider',
    function($routeProvider) {
        $routeProvider.when('/companies', {
            templateUrl: 'views/companies.html',
            controller: 'CompaniesCtrl',
            title: 'Фирми'
        });
    }
]);

CompaniesModule.controller('CompaniesCtrl', function($scope, $http, $timeout) {
    console.log('CompaniesCtrl');
    $scope.loaded = false;

    $timeout(function() {
        if (!$scope.loaded) {
            $scope.timeout = true;
        }
    }, 1000);

    $http
        .get('/companies')
        .then(function(companies) {
            console.log(companies);
            $scope.loaded = true;
            $scope.timeout = false;
            $scope.companies = companies.data;
        })
        .catch(function(err) {
            $scope.loaded = true;
            $scope.timeout = false;
            console.log(err);
        });
});
