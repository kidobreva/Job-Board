angular.module('App.auth', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/auth', {
    templateUrl: 'views/auth.html',
    controller: 'AuthCtrl'
  });
}])

.controller('AuthCtrl', [function() {

}]);
