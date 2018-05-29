'use strict';
angular.module('fblindSimpleImageGallery', [])
  .directive('simpleImageGallery',
  function () {
    var template =  '<div id="simple-gallery">' + '<h3 ng-if="isprofile">Галерия</h3>' +
                      '<div id="simple-gallery" class="col-sm-12 image">' +
                      '<a href="#" ng-if="isprofile" ng-click="deletepicture(currentImage)"><i class="far fa-trash-alt fa-2x"></i></a>' +
                        '<div class="item active">' +
                        '<a href="{{currentImage || images[0]}}"><img ng-src="{{ currentImage || images[0] }}" class="img-responsive"></a>' +
                        '</div>' +
                        '</div>' +
                      '<div class="col-sm-12">' +
                        '<div class="row">' +
                          '<div class="col-sm-12" id="slider-thumbs">' +
                            '<ul>' +
                              '<li ng-repeat="image in images track by $index">' +
                                '<a ng-click="activateImg($index)" href="">' +
                                  '<img ng-src="{{ image }}" class="img-responsive simple-gallery-thumbnail">' +
                                '</a>' +
                              '</li>' +
                            '</ul>' +
                          '</div>' +
                        '</div>' +
                        '</div>' +
                      '</div>';
    return {
      restrict: 'E',
      scope: {
        images: '=',
        isprofile: '=',
        deletepicture: '='
      },
      template: template,
      controller: function ($scope) {
        $scope.activateImg = function (index) {
          $scope.currentImage = $scope.images[index];
        };
      },
      link: function (scope, element, attrs) {
        scope.currentImage = scope.images[0] || {};
        
      }
    };
  });
