angular.module('App', [
  'ngRoute',
  'App.home',
  'App.auth',
  'App.add-advert'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/home'});
}]);
