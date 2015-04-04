module.exports = (function(angular){
    'use strict';
    
    return function ($scope, $window, $location, i18nFilter, $rootScope) {
        $scope.user = $rootScope.user;
        $scope.$on('$viewContentLoaded', function () {
            // this code is executed after the view is loaded
         });
    };
    
})(angular);