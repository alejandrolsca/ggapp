var img_gglogo = require('../../../../static/img/gg-logo.png');

module.exports = (function (angular) {
    'use strict';

    return ['$scope', 'shippingListReleaseInvoiceFac', '$location', 'i18nFilter', '$stateParams', '$filter', 'authService',
        function ($scope, shippingListReleaseInvoiceFac, $location, i18nFilter, $stateParams, $filter, authService) {

            $scope.fmData = {};
            $scope.flex = {};
            $scope.labels = Object.keys(i18nFilter("shippingList-invoice.labels"));
            $scope.columns = i18nFilter("shippingList-invoice.columns");

            // bind columns when grid is initialized
            $scope.initGrid = function (s, e) {
                $scope.flex[s.hostElement.id] = s

                for (var i = 0; i < $scope.columns.length; i++) {
                    var col = new wijmo.grid.Column();
                    col.binding = $scope.columns[i].binding;
                    col.dataType = $scope.columns[i].type;
                    col.isReadOnly = $scope.columns[i].isReadOnly;
                    col.filterType = $scope.columns[i].filterType;
                    col.header = i18nFilter("shippingList-invoice.labels." + $scope.columns[i].binding.replace('_', '-'));
                    col.wordWrap = false;
                    col.width = $scope.columns[i].width;
                    s.columns.push(col);
                }
            };

            $scope.disableXLS = false;
            // export to xls
            $scope.exportXLS = function (current, total, release) {
                console.log($scope.flex[release])
                const timestamp = moment().tz('America/Chihuahua').format();
                const fileName = `release_invoice_${$stateParams.sl_id}_${current}of${total}_${release}_${timestamp}.xlsx`;
                const flexGrid = $scope.flex[release]
                try {
                    wijmo.grid.xlsx.FlexGridXlsxConverter.save(flexGrid, {
                        includeColumnHeaders: true,
                        includeCellStyles: false
                    }, fileName);
                } catch (error) {
                    throw new Error(error)
                }

            }

            $scope.$on('$viewContentLoaded', async () => {
                $scope.loading = true;
                var client = undefined;
                var rows = undefined;
                let sl_date
                shippingListReleaseInvoiceFac.getSL().then(function (promise) {
                    const { data } = promise
                    const [shippinglist] = data
                    $scope.fmData = shippinglist
                    const flexSheet = $scope.flex;
                    sl_date = moment(shippinglist.sl_date).tz('America/Chihuahua').format('DD/MM/YYYY')
                    //flexSheet.setCellData(0, 0, `LISTA DE EMBARQUE #${shippinglist.sl_id} ${sl_date}`);
                }).then(function () {
                    $scope.wo_id = $scope.fmData.wo_id
                    shippingListReleaseInvoiceFac.searchWoId($scope.fmData.cl_id, $scope.fmData.wo_id, $scope.fmData.zo_id).then(function (promise) {
                        $scope.loading = false;
                        const { data } = promise
                        data.map((value, index, data)=>{
                            value.sl_date = sl_date
                        })
                        $scope.data = data
                        $scope.disableXLS = ($scope.data.length === 1);
                        const releases = _.groupBy(data, 'wo_release')
                        const releaseLabels = Object.keys(releases)
                        $scope.releases = releases
                        $scope.releaseLabels = releaseLabels
                    })

                })

            });
        }]

})(angular);