var backtop = angular.module('angular.backtop', []);

backtop.directive('backTop', [function() {
  return {
    restrict: 'E',
    transclude: true,
    replace: true,
    template: '<div id="backtop" class="{{theme}}"><button><div ng-transclude></div></button></div>',
    scope: {
      text: "@buttonText",
      speed: "@scrollSpeed",
      theme: "@buttonTheme"
    },
    link: function(scope, element) {
      scope.text = scope.text || 'Scroll top';
      scope.theme = scope.theme || 'light';
      scope.speed = parseInt(scope.speed, 10) || 300;
      var speed = Math.round(scope.speed / 100);
      
      function isElementInViewport (el) {
        return (
            document.documentElement.clientHeight - el.getBoundingClientRect().top > 0
        );
      }
      var onscroll = function() {
        var footer = document.getElementsByTagName('footer')[0];
        if (isElementInViewport(footer) && window.pageYOffset) {
          if(!element.showing){
            element.addClass('show');
            element.showing = true;
          }
        } else {
            element.removeClass('show');
            element.showing = false;
        }
      }

      scope.currentYPosition = function() {
        if (document.documentElement && document.documentElement.scrollTop)
          return document.documentElement.scrollTop;
        if (document.body.scrollTop)
          return document.body.scrollTop;
        return 0;
      };

      element.showing = false;
      element.on('click', function() {
        window.removeEventListener("scroll", onscroll);

        element.removeClass('show');
        element.showing = false;

        var startY = scope.currentYPosition();

        var step = Math.round(startY / 25);
        var leapY = startY < 100 ? 0 : startY - step;

        var scrollInterval = setInterval(function(){
          window.scrollTo(0, leapY)
          if(!leapY){
            clearInterval(scrollInterval);
            window.addEventListener("scroll", onscroll)
          }

          leapY -= step;

          if(leapY < 0) leapY = 0;
        }, speed)
      });

      window.addEventListener('scroll', onscroll);
      scope.$on('$destroy', function(){
        window.removeEventListener('scroll', onscroll)
      })
    }
  };

}]);
