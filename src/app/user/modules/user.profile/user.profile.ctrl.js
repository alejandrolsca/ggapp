module.exports = (function(angular){
    'use strict';
    
    return ['$scope', '$location', 'i18nFilter', '$rootScope','authService',
    function ($scope, $location, i18nFilter, $rootScope, authService) {
        $scope.$on('$viewContentLoaded', function () {
            // this code is executed after the view is loaded
            $scope.profile = authService.profile()
         });
    }];
    
})(angular);