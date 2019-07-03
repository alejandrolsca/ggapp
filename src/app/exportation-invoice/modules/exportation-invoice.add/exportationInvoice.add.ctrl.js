module.exports = (function (angular) {
    'use strict';

    return ['$scope', 'exportationInvoiceAddFac', '$location', 'i18nFilter', '$stateParams', '$filter', 'authService',
        function ($scope, exportationInvoiceAddFac, $location, i18nFilter, $stateParams, $filter, authService) {

            var numberToText = require('./convertir-num-letras');

            $scope.fmData = {};

            $scope.disableXLS = true;
            $scope.exportXLS = function () {
                var flexSheet = $scope.flex,
                    fileName, timestamp;
                if (flexSheet) {
                    if (!!$scope.fileName) {
                        fileName = $scope.fileName;
                    } else {
                        timestamp = moment().tz('America/Chihuahua').format();
                        fileName = `exportation_invoice_${$scope.ei_id}_${timestamp}.xlsx`;
                    }
                    flexSheet.save(fileName);
                }
            }
            $scope.onSubmit = function () {
                $('#myModal').modal('show');
            }
            $scope.add = function () {
                $('#myModal').modal('hide');
                const { username: ei_createdby } = authService.profile()
                exportationInvoiceAddFac.add($scope.zo_id, $stateParams.wo_id, ei_createdby).then(function (promise) {
                    $scope.disableXLS = false
                    $scope.disableAdd = true
                    const { data: exportationinvoice } = promise
                    $scope.ei_id = exportationinvoice.ei_id
                    const flexSheet = $scope.flex;
                    const ei_date = moment(exportationinvoice.ei_date).tz('America/Chihuahua').format('DD/MM/YYYY')
                    flexSheet.setCellData(0, 0, `FACTURA DE EXPORTACION #${exportationinvoice.ei_id} ${ei_date}`);
                })
            }

            $scope.initialized = function (flexSheet) {
                if (flexSheet) {

                    // flexSheet.rows.forEach(function(value,key){
                    //      value.wordWrap = true;
                    // })
                    flexSheet.mergeRange(new wijmo.grid.CellRange(0, 0, 0, 9)) //new wijmo.grid.CellRange(row1, column1, row2, column2)
                    flexSheet.setCellData(0, 0, "FACTURA DE EXPORTACION");
                    flexSheet.applyCellsStyle({
                        fontWeight: 'bold',
                        textAlign: 'center'
                    }, [
                            new wijmo.grid.CellRange(0, 0, 0, 0),
                            new wijmo.grid.CellRange(22, 0, 23, 9)
                        ]);

                    flexSheet.applyCellsStyle({
                        fontWeight: 'bold',
                        textAlign: 'left'
                    }, [
                            new wijmo.grid.CellRange(1, 0, 1, 0),
                            new wijmo.grid.CellRange(1, 8, 3, 9),
                            new wijmo.grid.CellRange(7, 0, 7, 0),
                            new wijmo.grid.CellRange(7, 5, 7, 5),
                            new wijmo.grid.CellRange(15, 5, 15, 5),
                            new wijmo.grid.CellRange(17, 0, 17, 0),
                            new wijmo.grid.CellRange(20, 0, 20, 0)
                        ]);

                    flexSheet.applyCellsStyle({
                        className: 'wordwrap'
                    }, [
                            new wijmo.grid.CellRange(2, 0, 5, 3),
                            new wijmo.grid.CellRange(8, 0, 14, 4),
                            new wijmo.grid.CellRange(8, 5, 14, 9),
                            new wijmo.grid.CellRange(18, 0, 19, 4),
                            new wijmo.grid.CellRange(16, 5, 21, 9)
                        ]);

                    flexSheet.mergeRange(new wijmo.grid.CellRange(1, 0, 1, 3));
                    flexSheet.setCellData(1, 0, "EXPORTADOR");
                    flexSheet.mergeRange(new wijmo.grid.CellRange(2, 0, 5, 3));
                    flexSheet.setCellData(2, 0,
                        "GRUPO GRAFICO DE MEXICO SA DE CV\n" +
                        "CALLE RETORNO EL SAUCITO #1030, INTERIOR 10, COMPLEJO INDUSTRIAL EL SAUCITO. C.P. 31123\n" +
                        "RFC GGM020610 Q54"
                    );

                    flexSheet.setCellData(1, 8, "FACTURA");
                    flexSheet.setCellData(2, 8, "FECHA");
                    flexSheet.setCellData(3, 8, "PEDIMENTO No");

                    flexSheet.mergeRange(new wijmo.grid.CellRange(7, 0, 7, 4));
                    flexSheet.setCellData(7, 0, "DESTINATARIO");

                    flexSheet.mergeRange(new wijmo.grid.CellRange(8, 0, 14, 4));

                    flexSheet.mergeRange(new wijmo.grid.CellRange(7, 5, 7, 9));
                    flexSheet.setCellData(7, 5, "COMPRADOR");
                    flexSheet.mergeRange(new wijmo.grid.CellRange(8, 5, 14, 9));

                    flexSheet.mergeRange(new wijmo.grid.CellRange(15, 0, 15, 4));
                    flexSheet.setCellData(15, 0, "INCOTERM EXW ST-22");

                    flexSheet.mergeRange(new wijmo.grid.CellRange(15, 5, 15, 9));
                    flexSheet.setCellData(15, 5, "AGENTE");

                    flexSheet.mergeRange(new wijmo.grid.CellRange(16, 5, 21, 9));
                    flexSheet.setCellData(16, 5,
                        "A.A LIC. SANTIAGO GARCIA DIAZ\n" +
                        "CALLE PINO 1202 FRACC.SAN PABLO\n" +
                        "CHIHUAHUA,CHIH.\n" +
                        "RFC: GADS590724TB9"
                    );

                    flexSheet.mergeRange(new wijmo.grid.CellRange(17, 0, 17, 4));
                    flexSheet.setCellData(17, 0, "COMENTARIOS");

                    flexSheet.mergeRange(new wijmo.grid.CellRange(18, 0, 19, 4));
                    flexSheet.setCellData(18, 0,
                        "ESTA OPERACIÓN SE REALIZA DE CONFORMIDAD CON LAS REGLAS 5.2.6 \nFRACCION II y 4.3.21 DE LA R.C.G.M.C.E"
                    );

                    flexSheet.mergeRange(new wijmo.grid.CellRange(20, 0, 20, 4));
                    flexSheet.setCellData(20, 0, "FACTURAS");
                    flexSheet.mergeRange(new wijmo.grid.CellRange(21, 0, 21, 4));

                    flexSheet.mergeRange(new wijmo.grid.CellRange(22, 0, 23, 2));
                    flexSheet.setCellData(22, 0, "DESCRIPCION");
                    flexSheet.setCellData(22, 3, "IDIOMA");
                    flexSheet.setCellData(22, 4, "CANTIDAD");
                    flexSheet.setCellData(22, 5, "U.M");
                    flexSheet.setCellData(22, 6, "PESO NETO");
                    flexSheet.setCellData(23, 6, "KGS");
                    flexSheet.setCellData(22, 7, "PESO");
                    flexSheet.setCellData(23, 7, "KGS");
                    flexSheet.setCellData(22, 8, "UNITARIO");
                    flexSheet.setCellData(23, 8, "USD");
                    flexSheet.setCellData(22, 9, "VALOR TOTAL");
                    flexSheet.setCellData(23, 9, "USD");
                }

            }

            $scope.savePdf = function savePdf() {
                var flexSheet = $scope.flex;
                wijmo.grid.pdf.FlexGridPdfConverter.export(flexSheet, "FlexGrid.pdf", {
                    exportMode: wijmo.grid.pdf.ExportMode.Selection,
                    scaleMode: wijmo.grid.pdf.ScaleMode.SinglePage,
                    documentOptions: {
                        pageSettings: {
                            layout: wijmo.pdf.PdfPageOrientation.Portrait,
                            size: wijmo.pdf.PdfPageSize.Letter
                        }
                    },
                    styles: {
                        cellStyle: {
                            backgroundColor: '#ffffff',
                            borderColor: '#c6c6c6'
                        },
                        altCellStyle: {
                            backgroundColor: '#f9f9f9'
                        },
                        groupCellStyle: {
                            backgroundColor: '#dddddd'
                        },
                        headerCellStyle: {
                            backgroundColor: '#eaeaea'
                        }
                    }
                });
            }

            $scope.$on('$viewContentLoaded', function () {
                $scope.loading = true;
                var client = undefined;
                var rows = undefined;
                exportationInvoiceAddFac.getClient().then(function (promise) {
                    const { data } = promise
                    if (angular.isArray(data)) {
                        const [client] = data
                        var flexSheet = $scope.flex;
                        flexSheet.setCellData(8, 5,
                            dedent`${client.cl_corporatename}
                            ${client.cl_street} ${client.cl_streetnumber} ${(client.cl_suitenumber || '')}
                            ${(client.cl_neighborhood || '')}
                            ${client.cl_city}, ${client.cl_state}. ${client.cl_country}
                            ${client.cl_rfc}
                            ${client.cl_ssntin  || '' }`
                        );
                    }
                }).then(function () {
                    exportationInvoiceAddFac.getZone().then(function (promise) {
                        $scope.zo_idoptions = [];
                        const { data } = promise
                        if (angular.isArray(data)) {
                            rows = data;
                            angular.forEach(rows, function (value, key) {
                                this.push({ "label": rows[key]['zo_jsonb']['zo_zone'], "value": key });
                            }, $scope.zo_idoptions);
                        }
                    });
                    $scope.loading = false;
                }).then(function () {
                    $scope.wo_id = $stateParams.wo_id
                    exportationInvoiceAddFac.searchWoId($stateParams.wo_id).then(function (promise) {
                        $scope.data = promise.data
                        $scope.disableAdd = ($scope.data.length < 1);


                        var flexSheet = $scope.flex,
                            row = 24;
                        if (flexSheet) {
                            flexSheet.deleteRows(24, 975);
                            flexSheet.insertRows(24, 975);
                            var total = {
                                qty: 0,
                                weight: 0,
                                gross_weight: 0,
                                usd: 0
                            }
                        }
                        if (angular.isArray(promise.data) && promise.data.length > 0) {
                            var tariffCodeHeaders = [];
                            promise.data.map((value, index, data) => {
                                if (value.pr_language === 'TOTAL FRACCION') {
                                    tariffCodeHeaders.push({ "row": row, "tc_code": data[index - 1].tc_code, "tc_description": data[index - 1].tc_description })
                                    total.qty += +value.wo_qty;
                                    total.weight += +value.pr_weight;
                                    total.gross_weight += +value.pr_grossweight;
                                    total.usd += +value.total_price;
                                    flexSheet.applyCellsStyle({
                                        fontWeight: 'bold'
                                    }, [new wijmo.grid.CellRange(row, 0, row, 9)]);
                                }

                                flexSheet.mergeRange(new wijmo.grid.CellRange(row, 0, row, 2));
                                flexSheet.setCellData(row, 0, value.pr_partno);
                                flexSheet.setCellData(row, 3, value.pr_language);
                                flexSheet.setCellData(row, 4, value.wo_qty);
                                flexSheet.setCellData(row, 5, "PIEZAS");
                                flexSheet.setCellData(row, 6, $filter('number')(value.pr_weight, 6));
                                flexSheet.setCellData(row, 7, $filter('number')(value.pr_grossweight, 6));
                                flexSheet.setCellData(row, 8, $filter('currency')(value.wo_price, '$', 6));
                                flexSheet.setCellData(row, 9, $filter('currency')(value.total_price, '$', 6));
                                row += 1;
                            })
                            row += 2;
                            flexSheet.setCellData(row, 0, "TOTAL");
                            flexSheet.setCellData(row, 4, total.qty);
                            flexSheet.setCellData(row, 5, "PIEZAS");
                            flexSheet.setCellData(row, 6, $filter('number')(total.weight, 6));
                            flexSheet.setCellData(row, 7, $filter('number')(total.gross_weight, 6));
                            flexSheet.setCellData(row, 9, $filter('currency')(total.usd, '$', 2));
                            flexSheet.applyCellsStyle({
                                fontWeight: 'bold'
                            }, [new wijmo.grid.CellRange(row, 0, row, 9)]);
                            flexSheet.applyCellsStyle({
                                textAlign: 'right'
                            }, [new wijmo.grid.CellRange(24, 4, row, 4)]);
                            row += 2;
                            flexSheet.mergeRange(new wijmo.grid.CellRange(row, 0, row, 9));
                            flexSheet.setCellData(row, 0, numberToText(total.usd.toFixed(2)));
                            flexSheet.applyCellsStyle({
                                fontWeight: 'bold'
                            }, [new wijmo.grid.CellRange(row, 0, row, 9)]);
                            flexSheet.applyCellsStyle({
                                textAlign: 'right'
                            }, [new wijmo.grid.CellRange(24, 6, row, 9)]);

                            var sumRow = 2;
                            tariffCodeHeaders.reverse().map((value, index, data) => {
                                if (index > 0) {
                                    flexSheet.insertRows(data[index].row + 1, 2)
                                    flexSheet.setCellData(data[index].row + 1, 0, data[index - 1].tc_description);
                                    flexSheet.setCellData(data[index].row + 2, 0, `FRACCION ${data[index - 1].tc_code}`);
                                    flexSheet.mergeRange(new wijmo.grid.CellRange(data[index].row + 1, 0, data[index].row + 1, 2));
                                    flexSheet.mergeRange(new wijmo.grid.CellRange(data[index].row + 2, 0, data[index].row + 2, 2));
                                    flexSheet.applyCellsStyle({
                                        className: 'wordwrap',
                                        fontWeight: 'bold'
                                    }, [
                                            new wijmo.grid.CellRange(data[index].row + 1, 0, data[index].row + 1, 2),
                                            new wijmo.grid.CellRange(data[index].row + 2, 0, data[index].row + 2, 2)
                                        ])
                                    flexSheet.autoSizeRow(data[index].row + 1);
                                }
                            })
                            tariffCodeHeaders.reverse().map((value, index, data) => {
                                if (index === 0) {
                                    flexSheet.insertRows(24, 2)
                                    flexSheet.setCellData(24, 0, value.tc_description);
                                    flexSheet.setCellData(25, 0, `FRACCION ${value.tc_code}`);
                                    flexSheet.mergeRange(new wijmo.grid.CellRange(24, 0, 24, 2));
                                    flexSheet.mergeRange(new wijmo.grid.CellRange(25, 0, 25, 2));
                                    flexSheet.applyCellsStyle({
                                        className: 'wordwrap',
                                        fontWeight: 'bold'
                                    }, [
                                            new wijmo.grid.CellRange(24, 0, 24, 2),
                                            new wijmo.grid.CellRange(25, 0, 25, 2)
                                        ])
                                    flexSheet.autoSizeRow(24);
                                }
                            })

                        }
                    })
                })
                $scope.$watch(
                    "fmData.zo_id",
                    function zoChange(newValue, oldValue) {
                        var flexSheet = $scope.flex;
                        if (newValue !== undefined && flexSheet) {
                            $scope.zo_id = rows[newValue].zo_id
                            flexSheet.setCellData(8, 0,
                                rows[newValue].zo_corporatename + '\n' +
                                rows[newValue].zo_street + ' ' + rows[newValue].zo_streetnumber + ' ' + (rows[newValue].zo_suitenumber || '') + '\n' +
                                (rows[newValue].zo_neighborhood || '') + '\n' +
                                rows[newValue].zo_city + ', ' + rows[newValue].zo_state + '. ' + rows[newValue].zo_country + '\n' +
                                rows[newValue].zo_rfc + '\n' +
                                (rows[newValue].zo_immex || '') + '\n'

                            );
                        }
                    }
                );
            });
        }]

})(angular);