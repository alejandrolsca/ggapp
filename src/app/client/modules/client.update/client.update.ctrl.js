module.exports = (function (angular) {
    'use strict';

    return ['$scope', 'clientUpdateFac', '$location', 'i18nFilter', '$interval',
        function ($scope, clientUpdateFac, $location, i18nFilter, $interval) {

            $scope.onSubmit = function () {

                clientUpdateFac.update($scope.fmData).then(function (promise) {
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
                    clientUpdateFac.getChilds($scope.fmData.cl_country).then(function (promise) {
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
                    clientUpdateFac.getChilds($scope.fmData.cl_state).then(function (promise) {
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
                    clientUpdateFac.getChilds($scope.fmData.cl_city).then(function (promise) {
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
                $scope.loading = true;
                clientUpdateFac.data().then(function (promise) {
                    $scope.loading = false;
                    if (angular.isArray(promise.data) && promise.data.length === 1) {
                        $scope.fmData = promise.data[0].cl_jsonb;
                    }
                }).then(function () {
                    clientUpdateFac.getCountries().then(function (promise) {
                        if (angular.isArray(promise.data)) {
                            $scope.cl_countryoptions = promise.data;
                        } else {
                            //$scope.updateFail = true;
                        }
                    }).then(function () {
                        clientUpdateFac.getChilds($scope.fmData.cl_country).then(function (promise) {
                            if (angular.isArray(promise.data)) {
                                $scope.cl_stateoptions = promise.data;
                            } else {
                                //$scope.updateFail = true;
                            }
                        })
                    }).then(function () {
                        clientUpdateFac.getChilds($scope.fmData.cl_state).then(function (promise) {
                            if (angular.isArray(promise.data)) {
                                $scope.cl_cityoptions = promise.data;
                            } else {
                                //$scope.updateFail = true;
                            }
                        })
                    }).then(function () {
                        clientUpdateFac.getChilds($scope.fmData.cl_city).then(function (promise) {
                            if (angular.isArray(promise.data)) {
                                $scope.cl_countyoptions = promise.data;
                            } else {
                                //$scope.updateFail = true;
                            }
                        })
                    });
                });

            });
        }];

})(angular);