module.exports = (function(angular){
    'use strict';
    
    return function ($scope, woAddFactory, $window, $stateParams) {
        $scope.fmData = {};
        
        $scope.$on('$viewContentLoaded', function () {
            // this code is executed after the view is loaded
            $scope.loading = true;
            woAddFactory.getClient().then(function(promise){
                $scope.loading = false;
                if(angular.isObject(promise.data)) {
                    $scope.client = promise.data;
                    $scope.fmData.cl_corporatename = $scope.client.cl_corporatename;
                }
                console.log(JSON.stringify(promise.data));
            });
         });
    };
    
})(angular);