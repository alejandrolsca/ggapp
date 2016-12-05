module.exports = (function (angular) {
    'use strict';

    return ['$scope', 'exportationInvoiceFac', '$location', 'i18nFilter', '$stateParams', '$filter', 'authService',
        function ($scope, exportationInvoiceFac, $location, i18nFilter, $stateParams, $filter, authService) {

            $scope.save = function () {
                var flexSheet = $scope.flex,
                    fileName;
                if (flexSheet) {
                    if (!!$scope.fileName) {
                        fileName = $scope.fileName;
                    } else {
                        fileName = 'FlexSheet.xlsx';
                    }
                    flexSheet.save(fileName);
                }
            }

            $scope.initialized = function (flexSheet) {
                if (flexSheet) {
                    flexSheet.mergeRange(new wijmo.grid.CellRange(0, 0, 0, 7))
                    flexSheet.setCellData(0, 0, "FACTURA DE EXPORTACION");
                    flexSheet.applyCellsStyle({
                        fontWeight: 'bold',
                        textAlign: 'center'
                    }, [new wijmo.grid.CellRange(0, 0, 0, 0)]);

                    flexSheet.mergeRange(new wijmo.grid.CellRange(1, 0, 1, 2));
                    flexSheet.setCellData(1, 0, "EXPORTADOR:");
                    flexSheet.mergeRange(new wijmo.grid.CellRange(2, 0, 2, 2));
                    flexSheet.mergeRange(new wijmo.grid.CellRange(3, 0, 3, 2));

                    flexSheet.mergeRange(new wijmo.grid.CellRange(1, 3, 1, 6));
                    flexSheet.setCellData(1, 3, "GRUPO GRAFICO DE MEXICO SA DE CV");
                    flexSheet.mergeRange(new wijmo.grid.CellRange(2, 3, 2, 6));
                    flexSheet.setCellData(2, 3, "CALLE RETORNO EL SAUCITO #1030, INTERIOR 10, COMPLEJO INDUSTRIAL EL SAUCITO. C.P. 31123");
                    flexSheet.mergeRange(new wijmo.grid.CellRange(3, 3, 3, 6));
                    flexSheet.setCellData(3, 3, "RFC GGM020610 Q54");

                    flexSheet.applyCellsStyle({
                        fontWeight: 'bold',
                    }, [new wijmo.grid.CellRange(1, 0, 1, 2)]);
                    flexSheet.applyCellsStyle({
                        backgroundColor: 'lightGreen',
                    }, [new wijmo.grid.CellRange(1, 0, 3, 7)]);
                }
            }


            $scope.$on('$viewContentLoaded', function () {
                exportationInvoiceFac.getData(50).then(function (promise) {
                    console.log(promise);
                    $scope.ctx = {
                        data: promise
                    }
                })
            });
        }]

})(angular);