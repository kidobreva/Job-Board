angular.module('App', [
  'ngRoute',
  'App.Home',
  'App.Auth',
  'App.AddAdvert'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/home'});
}]);
