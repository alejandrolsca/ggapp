module.exports = (function(angular){
    'use strict';
    
    return function ($scope, paperUpdateFac, $window, $location, i18nFilter, $interval) {
        
        $scope.onSubmit = function() {

            paperUpdateFac.update($scope.fmData).then(function(promise){
                if(promise.data == "1") {
                    $location.path('/paper');
                } else {
                    $scope.updateFail = true;
                }
                //console.log(JSON.stringify(promise.data));
            });
            //console.log('form submitted:', $scope.formData);
        };
        
        $scope.pa_statusoptions = i18nFilter("paper.fields.pa_statusoptions");
        $scope.pa_typeoptions = i18nFilter("paper.fields.pa_typeoptions");

        $scope.$on('$viewContentLoaded', function () {
            // this code is executed after the view is loaded
            $scope.loading = true;
            paperUpdateFac.data().then(function(promise){
                $scope.loading = false;
                if(angular.isObject(angular.fromJson(promise.data))) {
                        $scope.fmData = angular.fromJson(promise.data);
                }
                console.log(promise.data);
            }).then(function(){
                paperUpdateFac.getSuppliers().then(function(promise){
                if(angular.isArray(promise.data)) {
                    $scope.su_idoptions = [];
                    angular.forEach(promise.data,function(value, key){
                          this.push({"label":value.su_corporatename,"value":value.su_id});
                    },$scope.su_idoptions);
                } else {
                    //$scope.updateFail = true;
                }
                console.log(JSON.stringify($scope.su_idoptions));
                console.log(JSON.stringify(promise.data));
            });
            });

         });
    };
    
})(angular);