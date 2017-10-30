module.exports = (function (angular) {
    'use strict';

    return ['$scope', 'clientAddFac', '$location', 'i18nFilter', '$interval',
        function ($scope, clientAddFac, $location, i18nFilter, $interval) {
            $scope.fmData = {};

            $scope.onSubmit = function () {

                clientAddFac.add($scope.fmData).then(function (promise) {
                    if (promise.data.rowCount === 1) {
                        $location.path('/client');
                    } else {
                        $scope.updateFail = true;
                    }
                });
            };

            $scope.getStates = function () {
                $scope.cl_stateoptions = [];
                $scope.cl_cityoptions = [];
                $scope.cl_countyoptions = [];
                $interval(function () {
                    clientAddFac.getChilds($scope.fmData.cl_country).then(function (promise) {
                        if (angular.isArray(promise.data)) {
                            $scope.cl_stateoptions = promise.data;
                        } else {
                            //$scope.updateFail = true;
                        }
                    });
                }, 0, 1);
            }

            $scope.getCity = function () {
                $scope.cl_cityoptions = [];
                $scope.cl_countyoptions = [];
                $interval(function () {
                    clientAddFac.getChilds($scope.fmData.cl_state).then(function (promise) {
                        if (angular.isArray(promise.data)) {
                            $scope.cl_cityoptions = promise.data;
                        } else {
                            //$scope.updateFail = true;
                        }
                    });
                }, 0, 1);
            };

            $scope.getCounty = function () {
                $scope.cl_countyoptions = [];
                $interval(function () {
                    clientAddFac.getChilds($scope.fmData.cl_city).then(function (promise) {
                        if (angular.isArray(promise.data)) {
                            $scope.cl_countyoptions = promise.data;
                        } else {
                            //$scope.updateFail = true;
                        }
                    });
                }, 0, 1);
            };

            $scope.cl_statusoptions = i18nFilter("client.fields.cl_statusoptions");
            $scope.cl_typeoptions = i18nFilter("client.fields.cl_typeoptions");
            
            $scope.$on('$viewContentLoaded', function () {
                // this code is executed after the view is loaded
            
                clientAddFac.getCountries().then(function (promise) {
                    if (angular.isArray(promise.data)) {
                        $scope.cl_countryoptions = promise.data;
                    } else {
                        //$scope.updateFail = true;
                    }
                });

            });
        }];

})(angular);