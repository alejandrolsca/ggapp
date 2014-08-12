'use strict';

module.exports = function ($scope, clientAddFac, $window, $location, i18nFilter) {
    
    $scope.fields = Object.keys(i18nFilter("CLIENT.FIELDS"));
    
    $scope.cl_statusoptions = [
        {"label":"Activo","value":"A"},
        {"label":"Inactivo","value":"I"}
    ]
        
    $scope.onSubmit = function() {
    
        clientAddFac.add($scope.fmData).then(function(promise){
            if(promise.data == "1") {
                $location.path('/client');
            } else {
                $scope.updateFail = true;
            }
            //console.log(JSON.stringify(promise.data));
        });
        //console.log('form submitted:', $scope.formData);
    };
    
    $scope.$on('$viewContentLoaded', function () {
        // this code is executed after the view is loaded
     });
};