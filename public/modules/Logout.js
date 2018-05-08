(function() {
    // Config
    function Config($routeProvider) {
        $routeProvider.when('/logout', {
            templateUrl: 'views/logout.html',
            controller: 'LogoutCtrl'
        });
    }

    // Controller
    function Ctrl($http, $window, $rootScope) {
        console.log('LogoutCtrl');

        // Logout
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
    }

    // Module
    angular
        .module('App.Logout', ['ngRoute'])
        .config(['$routeProvider', Config])
        .controller('LogoutCtrl', Ctrl);
})();
