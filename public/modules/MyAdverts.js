// // Check for current user
// $rootScope
//     .getCurrentUser()
//     .then(function(currentUser) {
//         // Check for the user's role
//         if (currentUser.role !== 'COMPANY') {
//             $location.path('/home');
//         } else {
//             // Get search data
//             AdvertsService.getSearchData().then(function(res) {
//                 $scope.categories = res.data.categories;
//                 $scope.cities = res.data.cities;
//                 $scope.payments = res.data.payments;
//                 $scope.$apply();
//                 doSearch($scope.currentPage, $scope.advertsPerPage);
//             });

//             // Show loading wheel if needed after 1 second
//             $timeout(function() {
//                 if (!$scope.loaded) {
//                     $scope.timeout = true;
//                 }
//             }, 1000);
//         }
//     })
//     // If there's no user
//     .catch(function() {
//         // Redirect to the login
//         $location.path('/auth');
//     });
