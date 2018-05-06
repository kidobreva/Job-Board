var CompaniesModule = angular.module('App.Companies', ['ngRoute']);

CompaniesModule.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/companies', {
    templateUrl: 'views/companies.html',
    controller: 'CompaniesCtrl',
    title: 'Фирми'
  });
}])

CompaniesModule.controller('CompaniesCtrl', function($scope, $http) {
  console.log('CompaniesCtrl');
  $scope.loaded = false;

  $scope.companies = $http.get('/companies').then(function(companies) {
      console.log(companies);
      $scope.loaded = true;
      $scope.companies = companies.data;
  });
});
