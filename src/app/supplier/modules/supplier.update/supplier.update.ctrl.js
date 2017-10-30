module.exports = (function (angular) {
    'use strict';

    return ['$scope', 'supplierUpdateFac', '$location', 'i18nFilter', '$interval',
        function ($scope, supplierUpdateFac, $location, i18nFilter, $interval) {

            $scope.onSubmit = function () {

                supplierUpdateFac.update($scope.fmData).then(function (promise) {
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
                    supplierUpdateFac.getChilds($scope.fmData.su_country).then(function (promise) {
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
                    supplierUpdateFac.getChilds($scope.fmData.su_state).then(function (promise) {
                        if (angular.isArray(promise.data)) {
                            $scope.su_cityoptions = promise.data;
                        } else {
                            //$scope.updateFail = true;
                        }
                    });
                }, 0, 1);
            }

            $scope.getCounty = function () {
                $scope.su_countyoptions = [];
                $interval(function () {
                    supplierUpdateFac.getChilds($scope.fmData.su_city).then(function (promise) {
                        if (angular.isArray(promise.data)) {
                            $scope.su_countyoptions = promise.data;
                        } else {
                            //$scope.updateFail = true;
                        }
                    });
                }, 0, 1);
            }

            $scope.su_statusoptions = i18nFilter("supplier.fields.su_statusoptions");
            $scope.su_typeoptions = i18nFilter("supplier.fields.su_typeoptions");

            $scope.$on('$viewContentLoaded', function () {
                // this code is executed after the view is loaded
                $scope.loading = true;
                supplierUpdateFac.data().then(function (promise) {
                    $scope.loading = false;
                    if (angular.isArray(promise.data) && promise.data.length === 1) {
                        $scope.fmData = promise.data[0].su_jsonb;
                    }
                }).then(function () {
                    supplierUpdateFac.getCountries().then(function (promise) {
                        if (angular.isArray(promise.data)) {
                            $scope.su_countryoptions = promise.data;
                        } else {
                            //$scope.updateFail = true;
                        }
                    }).then(function () {
                        supplierUpdateFac.getChilds($scope.fmData.su_country).then(function (promise) {
                            if (angular.isArray(promise.data)) {
                                $scope.su_stateoptions = promise.data;
                            } else {
                                //$scope.updateFail = true;
                            }
                        })
                    }).then(function () {
                        supplierUpdateFac.getChilds($scope.fmData.su_state).then(function (promise) {
                            if (angular.isArray(promise.data)) {
                                $scope.su_cityoptions = promise.data;
                            } else {
                                //$scope.updateFail = true;
                            }
                        })
                    }).then(function () {
                        supplierUpdateFac.getChilds($scope.fmData.su_city).then(function (promise) {
                            if (angular.isArray(promise.data)) {
                                $scope.su_countyoptions = promise.data;
                            } else {
                                //$scope.updateFail = true;
                            }
                        })
                    });
                });

            });
        }];

})(angular);