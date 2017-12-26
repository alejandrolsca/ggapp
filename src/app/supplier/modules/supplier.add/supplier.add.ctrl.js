module.exports = (function (angular) {
    'use strict';

    return ['$scope', 'supplierAddFac', '$location', 'i18nFilter', '$interval',
        function ($scope, supplierAddFac, $location, i18nFilter, $interval) {
            $scope.fmData = {};

            $scope.onSubmit = function () {

                supplierAddFac.add($scope.fmData).then(function (promise) {
                    if (promise.data.rowCount === 1) {
                        $location.path('/supplier');
                    } else {
                        $scope.updateFail = true;
                    }
                });
            };

            $scope.getStates = function () {
                $scope.su_stateoptions = [];
                $scope.su_cityoptions = [];
                $scope.su_countyoptions = [];
                $interval(function () {
                    supplierAddFac.getChilds($scope.fmData.su_country).then(function (promise) {
                        if (angular.isArray(promise.data)) {
                            $scope.su_stateoptions = promise.data;
                        } else {
                            //$scope.updateFail = true;
                        }
                    });
                }, 0, 1);
            }

            $scope.getCity = function () {
                $scope.su_cityoptions = [];
                $scope.su_countyoptions = [];
                $interval(function () {
                    supplierAddFac.getChilds($scope.fmData.su_state).then(function (promise) {
                        if (angular.isArray(promise.data)) {
                            $scope.su_cityoptions = promise.data;
                        } else {
                            //$scope.updateFail = true;
                        }
                    });
                }, 0, 1);
            };

            $scope.getCounty = function () {
                $scope.su_countyoptions = [];
                $interval(function () {
                    supplierAddFac.getChilds($scope.fmData.su_city).then(function (promise) {
                        if (angular.isArray(promise.data)) {
                            $scope.su_countyoptions = promise.data;
                        } else {
                            //$scope.updateFail = true;
                        }
                    });
                }, 0, 1);
            };

            $scope.su_statusoptions = i18nFilter("supplier.fields.su_statusoptions");
            $scope.su_typeoptions = i18nFilter("supplier.fields.su_typeoptions");

            $scope.$on('$viewContentLoaded', function () {
                // this code is executed after the view is loaded

                supplierAddFac.getCountries().then(function (promise) {
                    if (angular.isArray(promise.data)) {
                        $scope.su_countryoptions = promise.data;
                    } else {
                        //$scope.updateFail = true;
                    }
                });

            });
        }];

})(angular);