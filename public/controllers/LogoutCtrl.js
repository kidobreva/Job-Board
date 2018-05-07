var LogoutModule = angular.module('App.Logout', ['ngRoute']);

LogoutModule.config([
    '$routeProvider',
    function($routeProvider) {
        $routeProvider.when('/logout', {
            templateUrl: 'views/logout.html',
            controller: 'LogoutCtrl'
        });
    }
]);

LogoutModule.controller('LogoutCtrl', function($http, $window, $rootScope) {
    console.log('LogoutCtrl');

    $http
        .get('/logout')
        .then(function(response) {
            if (response.status === 200) {
                $rootScope.user = null;
                $rootScope.isLogged = false;
                console.log('Logged out!');
                $window.location.href = '#!/home';
            }
        })
        .catch(function(err) {
            console.error(err.data);
        });
});
