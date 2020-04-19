module.exports = (function (angular) {
    'use strict';

    return ['$scope', 'woSplitFactory', '$stateParams', 'i18nFilter', '$filter', '$location', 'authService', 'notyf',
        function ($scope, woSplitFactory, $stateParams, i18nFilter, $filter, $location, authService, notyf) {

            const camelCase = (...args) => {
                const camelCase = args.map(function (value, index) {
                    if (index === 0) {
                        return value.toLowerCase()
                    }
                    return value.charAt(0).toUpperCase() + value.substr(1);
                });
                return camelCase.join('')
            }

            $scope.wo_foliosperformatoptions = i18nFilter("wo-add.fields.wo_foliosperformatoptions");
            $scope.wo_currencyoptions = i18nFilter("wo-add.fields.wo_currencyoptions");
            $scope.wo_emailoptions = i18nFilter("wo-add.fields.wo_emailoptions");

            $scope.splitted = false

            $scope.onSubmit = function () {

                woSplitFactory.split($scope.fmData).then(function (promise) {
                    $scope.splitted = true;
                    if (promise.data.rowCount === 1) {
                        notyf.open({
                            type: 'success',
                            message: 'Orden dividida.'
                        });
                    } else {
                        $scope.splitted = false;
                    }
                });
            };

            $scope.$on('$viewContentLoaded', function () {
                // this code is executed after the view is loaded

                $scope.loading = true;
                woSplitFactory.getData().then(function (promise) {
                    $scope.loading = false;
                    if (angular.isArray(promise.data) && promise.data.length === 1) {
                        const { wo_id, wo_jsonb: fmData, wo_date } = promise.data[0]
                        if (fmData.wo_componentmaterialqty) {
                            for (let key in fmData.wo_componentmaterialqty) {
                                fmData.wo_componentmaterialqty[key] = "0.00"
                            }
                        } else {
                            fmData.wo_materialqty = "0.00";
                        }
                        fmData.wo_type = "P"; // P-Partial
                        fmData.wo_status = 0; // 0-Active
                        fmData.wo_previousid = wo_id;
                        fmData.wo_originalqty = +fmData.wo_qty
                        fmData.wo_originalfoliosfrom = +fmData.wo_foliosfrom
                        fmData.wo_originalfoliosto = +fmData.wo_foliosto
                        fmData.wo_previousdate = wo_date.substring(0, 10);
                        fmData.wo_cancellationnotes = undefined;
                        const { username } = authService.profile()
                        fmData.wo_createdby = username;
                        $scope.fmData = fmData;
                        $scope.wo_id = wo_id;


                        $scope.$watch("fmData.wo_qtydone", function qtyDondeChanged(newValue, oldValue) {
                            const isEmpty = (newValue === undefined)
                            if (isEmpty) {
                                $scope.fmData.wo_qty = $scope.fmData.wo_originalqty
                                $scope.fmData.wo_foliosfrom = $scope.fmData.wo_originalfoliosfrom
                                return
                            } 
                            newValue = +newValue
                            if ($scope.fmData.wo_foliosfrom) {
                                $scope.fmData.wo_foliosfrom = (+$scope.fmData.wo_originalfoliosfrom) + newValue
                            }
                            $scope.fmData.wo_qty = $scope.fmData.wo_originalqty - newValue
                        })
                    }
                });
                woSplitFactory.getZone().then(function (promise) {
                    $scope.zo_idoptions = [];
                    if (angular.isArray(promise.data)) {
                        var rows = promise.data;
                        angular.forEach(rows, function (value, key) {
                            this.push({ "label": rows[key]['zo_jsonb']['zo_zone'], "value": rows[key]['zo_id'] });
                        }, $scope.zo_idoptions);
                    }
                })

                woSplitFactory.getProduct().then(function (promise) {
                    $scope.pr_idoptions = [];
                    var rows = [];
                    if (angular.isArray(promise.data)) {
                        rows = promise.data;
                        angular.forEach(rows, function (value, key) {
                            this.push({ "label": rows[key]['pr_jsonb']['pr_code'] + ' - ' + rows[key]['pr_jsonb']['pr_name'], "value": rows[key]['pr_id'] });
                        }, $scope.pr_idoptions);
                    }
                    $scope.$watch(
                        "fmData.pr_id",
                        function prChange(newValue, oldValue) {
                            if (newValue !== undefined) {
                                var product = $filter('filter')(rows, { "pr_id": newValue }, true);
                                if (product.length !== 1) {
                                    $scope.prinfo = false;
                                    return;
                                } else {
                                    $scope.prinfo = true;
                                    $scope.product = product[0];
                                    $scope.productUpdateUrl = `/product/update/${$scope.product['pr_jsonb']['pr_process']}/${$scope.product['pr_jsonb']['pr_type']}/${$scope.product['pr_jsonb']['cl_id']}/${$scope.product['pr_id']}`
                                    $scope.folio = (product[0]['pr_jsonb']['pr_folio'] === 'yes') ? true : false;
                                    var pr_type = product[0]['pr_jsonb']['pr_type']
                                    $scope.pr_inactive = product[0]['pr_jsonb']['pr_status'] === 'I' ? true : false;
                                    $scope.components = (pr_type === 'paginated' || pr_type === 'counterfoil') ? true : false;
                                    $scope.componentsArray = new Array(product[0]['pr_jsonb']['pr_components'])
                                    const rawMaterials = $scope.product['pr_material'].split(',')
                                    $scope.mt_inactive = false
                                    const materials = rawMaterials.map((value, index, data) => {
                                        const mtArray = value.split('|')
                                        value = {
                                            "description": mtArray[0],
                                            "status": mtArray[1]
                                        }
                                        if (mtArray[1] === 'I') {
                                            $scope.mt_inactive = true
                                        }
                                        return value
                                    })
                                    $scope.materials = materials
                                    woSplitFactory.getMachine(product[0]['pr_jsonb']['pr_process']).then(function (promise) {
                                        $scope.ma_idoptions = [];
                                        if (angular.isArray(promise.data)) {
                                            var rows = promise.data;
                                            angular.forEach(rows, function (value, key) {
                                                this.push({ "label": rows[key]['ma_jsonb']['ma_name'], "value": rows[key]['ma_id'] });
                                            }, $scope.ma_idoptions);
                                        }
                                    });
                                }
                            }
                        }
                    );
                });
                $scope.loading = false;
            });
        }];

})(angular);