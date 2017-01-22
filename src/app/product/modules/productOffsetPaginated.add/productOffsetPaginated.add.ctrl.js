module.exports = (function (angular) {
    'use strict';

    return ['$scope', 'productOffsetPaginatedAddFac', '$location', 'i18nFilter', '$stateParams',
        function ($scope, productOffsetPaginatedAddFac, $location, i18nFilter, $stateParams) {
            $scope.fmData = {};
            $scope.fmData = { "pr_process": "offset", "pr_type": "paginated", "cl_id": "6", "pr_partno": "TEST-ASA.asas: 23,34", "pr_description": "este es un producto de prueba", "pr_finalsizewidth": "100.00", "pr_finalsizeheight": "200.00", "pr_finalsizemeasure": "cm", "pr_inkfront": 2, "pr_inksfront": { "0": "2", "1": "3" }, "pr_inkback": 2, "pr_inksback": { "0": "2", "1": "2" }, "pa_id": "1", "pr_paperformatsqty": "123", "pr_papersizewidth": "100.00", "pr_papersizeheight": "200.00", "pr_papersizemeasure": "cm", "pr_varnish": "oneside", "pr_varnishfinished": "matte", "pr_laminate": "twosides", "pr_laminatefinished": "matte", "pr_laminatecaliber": "2mm", "pr_precut": "horizontal", "pr_fold": "tryptic", "pr_diecutting": "yes", "pr_diecuttingqty": "5", "pr_reinforcement": "one", "pr_cord": "allocated", "pr_wire": "allocated", "pr_folio": "yes", "pr_blocks": "100", "pr_status": "A", "pr_intinkfront": 2, "pr_intinksfront": { "0": "2", "1": "3" }, "pr_intinkback": 2, "pr_intinksback": { "0": "2", "1": "3" }, "pr_intpages": "100", "pa_intid": "1", "pr_intpaperformatsqty": "500", "pr_stapling": "2", "pr_bound": "yes", "pr_spiralbind": "plastic", "pr_name": "asdasdas", "pr_code": "asdasd" };

            $scope.fmData.pr_process = 'offset';
            $scope.fmData.pr_type = 'paginated';
            $scope.fmData.cl_id = $stateParams.cl_id;

            $scope.onSubmit = function () {

                productOffsetPaginatedAddFac.add($scope.fmData).then(function (promise) {
                    if (promise.data.rowCount == 1) {
                        $location.path('/product/' + $stateParams.cl_id);
                    } else {
                        $scope.updateFail = true;
                    }
                });
            };

            $scope.pr_languageoptions = i18nFilter("productOffsetPaginated-add.fields.pr_languageoptions");            
            $scope.pr_finalsizemeasureoptions = i18nFilter("productOffsetPaginated-add.fields.pr_finalsizemeasureoptions");
            $scope.pr_inkfrontoptions = i18nFilter("productOffsetPaginated-add.fields.pr_inkfrontoptions");
            $scope.pr_inkbackoptions = i18nFilter("productOffsetPaginated-add.fields.pr_inkbackoptions");
            $scope.pr_varnishoptions = i18nFilter("productOffsetPaginated-add.fields.pr_varnishoptions");
            $scope.pr_varnisfinishedoptions = i18nFilter("productOffsetPaginated-add.fields.pr_varnisfinishedoptions");
            $scope.pr_laminateoptions = i18nFilter("productOffsetPaginated-add.fields.pr_laminateoptions");
            $scope.pr_laminatefinishedoptions = i18nFilter("productOffsetPaginated-add.fields.pr_laminatefinishedoptions");
            $scope.pr_laminatecaliberoptions = i18nFilter("productOffsetPaginated-add.fields.pr_laminatecaliberoptions");
            $scope.pr_laminatesidesoptions = i18nFilter("productOffsetPaginated-add.fields.pr_laminatesidesoptions");
            $scope.pr_foliooptions = i18nFilter("productOffsetPaginated-add.fields.pr_foliooptions");
            $scope.pr_precutoptions = i18nFilter("productOffsetPaginated-add.fields.pr_precutoptions");
            $scope.pr_foldoptions = i18nFilter("productOffsetPaginated-add.fields.pr_foldoptions");
            $scope.pr_diecuttingoptions = i18nFilter("productOffsetPaginated-add.fields.pr_diecuttingoptions");
            $scope.pr_reinforcementoptions = i18nFilter("productOffsetPaginated-add.fields.pr_reinforcementoptions");
            $scope.pr_cordoptions = i18nFilter("productOffsetPaginated-add.fields.pr_cordoptions");
            $scope.pr_wireoptions = i18nFilter("productOffsetPaginated-add.fields.pr_wireoptions");
            $scope.pr_staplingoptions = i18nFilter("productOffsetPaginated-add.fields.pr_staplingoptions");
            $scope.pr_boundoptions = i18nFilter("productOffsetPaginated-add.fields.pr_boundoptions");
            $scope.pr_spiralbindoptions = i18nFilter("productOffsetPaginated-add.fields.pr_spiralbindoptions");
            $scope.pr_blocksoptions = i18nFilter("productOffsetPaginated-add.fields.pr_blocksoptions");
            $scope.pr_statusoptions = i18nFilter("productOffsetPaginated-add.fields.pr_statusoptions");
            $scope.pr_papersizemeasureoptions = i18nFilter("productOffsetPaginated-add.fields.pr_papersizemeasureoptions");
            

            // create front ink fields
            $scope.$watch('fmData.pr_inkfront', function (newValue, oldValue) {
                if ($scope.fmData.pr_inkfront != undefined) {
                    $scope.frontInks = new Array(newValue);
                    for (var i = 0; i < newValue; i++) {
                        if (oldValue != newValue) {
                            $scope.fmData['pr_inksfront'][i] = undefined;
                        }
                    }
                }
            });

            // create back ink fields
            $scope.$watch('fmData.pr_inkback', function (newValue, oldValue) {
                if ($scope.fmData.pr_inkback != undefined) {
                    $scope.backInks = new Array(newValue);
                    for (var i = 0; i < oldValue; i++) {
                        if (oldValue != newValue) {
                            $scope.fmData['pr_inksback'][i] = undefined;
                        }
                    }
                }
            });

            // create front interior ink fields
            $scope.$watch('fmData.pr_intinkfront', function (newValue, oldValue) {
                if ($scope.fmData.pr_intinkfront != undefined) {
                    $scope.intFrontInks = new Array(newValue);
                    for (var i = 0; i < newValue; i++) {
                        if (oldValue != newValue) {
                            $scope.fmData['pr_intinksfront'][i] = undefined;
                        }
                    }
                }
            });

            // create back interior ink fields
            $scope.$watch('fmData.pr_intinkback', function (newValue, oldValue) {
                if ($scope.fmData.pr_intinkback != undefined) {
                    $scope.intBackInks = new Array(newValue);
                    for (var i = 0; i < oldValue; i++) {
                        if (oldValue != newValue) {
                            $scope.fmData['pr_intinksback'][i] = undefined;
                        }
                    }
                }
            });

            $scope.$on('$viewContentLoaded', function () {
                // this code is executed after the view is loaded

                productOffsetPaginatedAddFac.getClient().then(function (promise) {
                    $scope.loading = false;
                    if (angular.isObject(promise.data)) {
                        $scope.client = promise.data;
                    }
                });

                productOffsetPaginatedAddFac.getInks().then(function (promise) {
                    if (angular.isArray(promise.data)) {
                        $scope.pr_inkoptions = [];
                        angular.forEach(promise.data, function (value, key) {
                            this.push({ "label": value.in_code, "value": value.in_id });
                        }, $scope.pr_inkoptions);
                    } else {
                        //$scope.updateFail = true;
                    }
                });

                productOffsetPaginatedAddFac.getPapers().then(function (promise) {
                    if (angular.isArray(promise.data)) {
                        $scope.pa_idoptions = [];
                        angular.forEach(promise.data, function (value, key) {
                            this.push({ "label": value.pa_code, "value": value.pa_id, "width": value.pa_width, "height": value.pa_height, "measure": value.pa_measure });
                        }, $scope.pa_idoptions);
                    } else {
                        //$scope.updateFail = true;
                    }
                });

            });
        }];

})(angular);