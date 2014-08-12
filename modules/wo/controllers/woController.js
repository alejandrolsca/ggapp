'use strict';

module.exports = function ($scope, woFactory,$location, i18nFilter) {
    
    $scope.fields = Object.keys(i18nFilter("WO.FIELDS"));
    
    console.log(JSON.stringify($scope.fields));
    
    $scope.showEdit = true;
    $scope.showDuplicate = true;
    
    $scope.edit = function (id) {
        if (angular.isNumber(id)) {
                //Embed the id to the link
                var link = "#/wo/update/" + id;
                //Open the link
                window.location = link;
        }
    }
    
    $scope.duplicate = function (id) {
        if (angular.isNumber(id)) {
                var link = "#/wo/duplicate/" + id;
                //Open the link
                window.location = link;
        }
    }
    
    $scope.$on('$viewContentLoaded', function() {
        // this code is executed after the view is loaded

        $scope.loading = true;
        woFactory.getData().then(function(promise){
            $scope.loading = false;
            if(angular.isArray(promise.data)) {
                $scope.data = promise.data;
            }
            //console.log(JSON.stringify(promise.data));
        });
     });
};