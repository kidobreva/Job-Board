var HomeModule = angular.module('App.Home', ['ngRoute']);

HomeModule.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/home', {
    templateUrl: 'views/home.html',
    controller: 'HomeCtrl',
    title: 'Job Board - Начало'
  });
}])

HomeModule.controller('HomeCtrl', [function() {
  console.log('HomeCtrl');
}]);
