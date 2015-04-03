module.exports = (function(angular){
    'use strict';
    
    return function ($scope, woUpdateFactory, $window) {
    
        $scope.$on('$viewContentLoaded', function () {
            // this code is executed after the view is loaded
            $scope.loading = true;
            woUpdateFactory.updateData().then(function(promise){
                $scope.loading = false;
                if(angular.isArray(promise.data)) {

                }
                console.log(JSON.stringify(promise.data));
            });
         });
    };
    
})(angular);