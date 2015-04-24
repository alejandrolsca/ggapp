module.exports = (function(angular){
    'use strict';
    
    return function ($scope, zoneUpdateFac, $window, $location, i18nFilter, $interval, $stateParams) {
        
        $scope.onSubmit = function() {

            zoneUpdateFac.update($scope.fmData).then(function(promise){
                if(promise.data == "1") {
                    $location.path('/zone/'+$stateParams.cl_id);
                } else {
                    $scope.updateFail = true;
                }
                //console.log(JSON.stringify(promise.data));
            });
            //console.log('form submitted:', $scope.formData);
        };
        
        $scope.getStates = function() {
            $scope.zo_stateoptions = [];
            $scope.zo_cityoptions = [];
            $scope.zo_countyoptions = [];
            $interval(function(){
                zoneUpdateFac.getStates($scope.fmData.zo_country).then(function(promise){
                    if(angular.isArray(promise.data.geonames)) {
                        $scope.zo_stateoptions = promise.data.geonames;
                    } else {
                        //$scope.updateFail = true;
                    }
                    //console.log(JSON.stringify(promise.data));
                });
            },0,1);
        }

        $scope.getCityCounty = function() {
            $scope.zo_cityoptions = [];
            $scope.zo_countyoptions = [];
            $interval(function(){
                zoneUpdateFac.getStates($scope.fmData.zo_state).then(function(promise){
                    if(angular.isArray(promise.data.geonames)) {
                        $scope.zo_cityoptions = promise.data.geonames;
                        $scope.zo_countyoptions = promise.data.geonames;
                    } else {
                        //$scope.updateFail = true;
                    }
                    //console.log(JSON.stringify(promise.data));
                });
            },0,1);
        }
        
        $scope.zo_statusoptions = i18nFilter("zone.fields.zo_statusoptions");
        
        $scope.$on('$viewContentLoaded', function () {
            // this code is executed after the view is loaded
            $scope.loading = true;
            zoneUpdateFac.data().then(function(promise){
                $scope.loading = false;
                if(angular.isObject(angular.fromJson(promise.data))) {
                        $scope.fmData = angular.fromJson(promise.data);
                }
                console.log(promise.data);
            }).then(function(){
                zoneUpdateFac.getCountries().then(function(promise){
                    if(angular.isArray(promise.data.geonames)) {
                        $scope.zo_countryoptions = promise.data.geonames;
                    } else {
                        //$scope.updateFail = true;
                    }
                    //console.log(JSON.stringify(promise.data.geonames));
                }).then(function(){
                    zoneUpdateFac.getStates($scope.fmData.zo_country).then(function(promise){
                        if(angular.isArray(promise.data.geonames)) {
                            $scope.zo_stateoptions = promise.data.geonames;
                        } else {
                            //$scope.updateFail = true;
                        }
                        //console.log(JSON.stringify(promise.data.geonames));
                    })
                }).then(function(){
                    zoneUpdateFac.getCityCounty($scope.fmData.zo_state).then(function(promise){
                        if(angular.isArray(promise.data.geonames)) {
                            $scope.zo_cityoptions = promise.data.geonames;
                            $scope.zo_countyoptions = promise.data.geonames;
                        } else {
                            //$scope.updateFail = true;
                        }
                        //console.log(JSON.stringify(promise.data.geonames));
                    })
                });
            });

         });
    };
    
})(angular);