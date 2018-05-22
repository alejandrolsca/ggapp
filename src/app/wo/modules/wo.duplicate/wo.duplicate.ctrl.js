module.exports = (function (angular) {
    'use strict';

    return ['$scope', 'woDuplicateFactory', '$stateParams', 'i18nFilter', '$filter', '$location', 'authService',
        function ($scope, woDuplicateFactory, $stateParams, i18nFilter, $filter, $location, authService) {

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

            $scope.onSubmit = function () {

                woDuplicateFactory.duplicate($scope.fmData).then(function (promise) {
                    console.log(promise.data)
                    if (promise.data.rowCount === 1) {
                        $location.path('/wo/' + $stateParams.cl_id);
                    } else {
                        $scope.updateFail = true;
                    }
                });
            };

            $scope.$on('$viewContentLoaded', function () {
                // this code is executed after the view is loaded

                // create InputDate control
                $scope.wo_commitmentdate = new wijmo.input.InputDate('#wo_commitmentdate', {
                    format: 'yyyy-MM-dd',
                    mask: '9999-99-99',
                    isRequired: true
                });

                // wo_commitmentdate validator                
                $scope.wo_commitmentdate.itemValidator = function (date) {
                    return !moment(date).isBefore(moment(), 'day');
                }

                // wo_commitmentdate changed handler                
                $scope.wo_commitmentdate.valueChanged.addHandler(wo_commitmentdateChanged)

                // wo_commitmentdate changed function
                function wo_commitmentdateChanged(s, e) {
                    $scope.fmData.wo_commitmentdate = moment(s.value).format('YYYY-MM-DD')
                    $scope.$apply()
                }

                $scope.loading = true;
                woDuplicateFactory.getData().then(function (promise) {
                    $scope.loading = false;
                    if (angular.isArray(promise.data) && promise.data.length === 1) {
                        $scope.fmData = promise.data[0].wo_jsonb;
                        $scope.fmData.wo_release = undefined;
                        $scope.fmData.wo_po = undefined;
                        $scope.fmData.wo_line = undefined;
                        $scope.fmData.wo_linetotal = undefined;
                        $scope.fmData.wo_type = "R"; //N-new, R-rep, C-change
                        $scope.fmData.wo_status = 0; //0-Active
                        $scope.wo_id = promise.data[0].wo_id;
                        $scope.fmData.wo_previousid = promise.data[0].wo_id;
                        $scope.fmData.wo_previousdate = promise.data[0].wo_date.substring(0, 10);
                        $scope.fmData.wo_commitmentdate = moment($scope.wo_commitmentdate.value).format('YYYY-MM-DD')
                        const { username } = authService.profile()
                        $scope.fmData.wo_createdby = username;

                    }
                });

                woDuplicateFactory.getZone().then(function (promise) {
                    $scope.zo_idoptions = [];
                    if (angular.isArray(promise.data)) {
                        var rows = promise.data;
                        angular.forEach(rows, function (value, key) {
                            this.push({ "label": rows[key]['zo_jsonb']['zo_zone'], "value": rows[key]['zo_id'] });
                        }, $scope.zo_idoptions);
                    }
                })

                woDuplicateFactory.getProduct().then(function (promise) {
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
                                    woDuplicateFactory.getMachine(product[0]['pr_jsonb']['pr_process']).then(function (promise) {
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