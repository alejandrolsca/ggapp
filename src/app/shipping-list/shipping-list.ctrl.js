var img_gglogo = require('../../static/img/gg-logo.png');

module.exports = (function (angular) {
    'use strict';

    return ['$scope', 'shippingListFac', '$location', 'i18nFilter', '$stateParams', '$filter', 'authService',
        function ($scope, shippingListFac, $location, i18nFilter, $stateParams, $filter, authService) {

            $scope.export = function () {
                console.log('entro')
                var doc = new wijmo.pdf.PdfDocument({
                    pageSettings: {
                        layout: wijmo.pdf.PdfPageOrientation.Portrait,
                        size: wijmo.pdf.PdfPageSize.Letter,
                        margins: {
                            left: 36,
                            top: 36,
                            right: 36,
                            bottom: 36
                        }
                    },
                    ended: function (sender, args) {
                        wijmo.pdf.saveBlob(args.blob, 'FlexGrid.pdf');
                    }
                });
                console.log('width',wijmo.pdf.pxToPt(150),'height',wijmo.pdf.pxToPt(79))
                console.log('width',doc.width,'height',doc.height) // plus 72 points
                doc.header.drawImage(img_gglogo,0,0,{
                    width: wijmo.pdf.pxToPt(150),
                    height: wijmo.pdf.pxToPt(79)
                });
                doc.setFont(new wijmo.pdf.PdfFont('Helvetica', 10, 'normal', '500'));
                doc.header.drawText("Grupo Gráfico de México S.A. de C.V.\n"+
                    "Calle Retorno El Saucito #1030, interior 10, Complejo Industrial El Saucito.\n"+
                    "C.P. 31123 Chihuahua, Chih.\n"+
                    "RFC:GGM020610Q54\n" +
                    "Tel: (614) 4216260, 4216261\n"+
                    "Fax: 4214353\n" +
                    "Chihuahua, Chih.\n"+
                    "info@grupografico.com.mx"
                ,36 + wijmo.pdf.pxToPt(150) + 5, 0, {
                    align: wijmo.pdf.PdfTextHorizontalAlign.Right,
                    width: doc.width - wijmo.pdf.pxToPt(150) - 36
                });
                
                shippingListFac.getClient().then(function (promise) {
                    if (angular.isArray(promise.data)) {
                        var client = promise.data[0];
                        doc.header.drawText(
                                "SOLD TO / VENDIDO A:\n" +
                                client.cl_jsonb.cl_corporatename + '\n' +
                                client.cl_jsonb.cl_street + ' ' + client.cl_jsonb.cl_streetnumber + ' ' + client.cl_jsonb.cl_suitenumber + '\n' +
                                client.cl_jsonb.cl_neighborhood + '\n' +
                                client.cl_jsonb.cl_state + ' ' + client.cl_jsonb.cl_city + '\n' +
                                client.cl_jsonb.cl_tin
                            ,0, 100, {
                            align: wijmo.pdf.PdfTextHorizontalAlign.Left,
                            width: 270
                        });
                                        
                    }
                }).then(function() {
                    doc.footer.drawText("FIRMA Y SELLO DE RECIBIDO",null,null,{
                        align: wijmo.pdf.PdfTextHorizontalAlign.Center
                    });
                    doc.addPage();
                    doc.end();
                })
                
            }

            var numberToText = require('./convertir-num-letras');

            $scope.fmData = {};
            $scope.fmData.wo_search = 'wo_release';
 
            $scope.save = function () {
                
                var flexSheet = $scope.flex,
                    fileName, timestamp;

                wijmo.grid.pdf.FlexGridPdfConverter.draw(grid, doc);
                wijmo.grid.pdf.FlexGridPdfConverter.drawToPosition(grid, doc, new wijmo.Point(0, 300));


                if (flexSheet) {
                    if (!!$scope.fileName) {
                        fileName = $scope.fileName;
                    } else {
                        timestamp = moment().format();
                        fileName = 'exportation_invoice_'+ timestamp +'.xlsx';
                    }
                    flexSheet.save(fileName);
                }
            }

            $scope.initialized = function (flexSheet) {
                if (flexSheet) {

                    // flexSheet.rows.forEach(function(value,key){
                    //      value.wordWrap = true;
                    // })
                    flexSheet.mergeRange(new wijmo.grid.CellRange(0, 0, 0, 9)) //new wijmo.grid.CellRange(row1, column1, row2, column2)
                    flexSheet.setCellData(0, 0, "LISTA DE EMBARQUE");
                    flexSheet.applyCellsStyle({
                        fontWeight: 'bold',
                        textAlign: 'center'
                    }, [new wijmo.grid.CellRange(0, 0, 0, 0)]);

                    flexSheet.applyCellsStyle({
                        fontWeight: 'bold',
                        textAlign: 'left'
                    }, [
                            new wijmo.grid.CellRange(1, 0, 1, 0),
                            new wijmo.grid.CellRange(1, 8, 3, 9),
                            new wijmo.grid.CellRange(7, 0, 7, 0),
                            new wijmo.grid.CellRange(7, 5, 7, 5),
                            new wijmo.grid.CellRange(22, 0, 23, 9),
                        ]);

                    flexSheet.applyCellsStyle({
                        className: 'wordwrap'
                    }, [
                            new wijmo.grid.CellRange(2, 0, 5, 3),
                            new wijmo.grid.CellRange(8, 0, 14, 4),
                            new wijmo.grid.CellRange(8, 5, 14, 9)
                        ]);

                    flexSheet.applyCellsStyle({
                        backgroundColor: 'Gainsboro'
                    }, [new wijmo.grid.CellRange(1, 0, 1, 3)]);

                    flexSheet.applyCellsStyle({
                        backgroundColor: 'Gainsboro'
                    }, [new wijmo.grid.CellRange(7, 0, 7, 7)]);

                    flexSheet.applyCellsStyle({
                        backgroundColor: 'Gainsboro',
                        textAlign: 'center'
                    }, [new wijmo.grid.CellRange(15, 0, 16, 9)]);

                    flexSheet.mergeRange(new wijmo.grid.CellRange(1, 0, 1, 3));
                    flexSheet.setCellData(1, 0, "EXPORTER / EXPORTADOR");
                    flexSheet.mergeRange(new wijmo.grid.CellRange(2, 0, 5, 3));
                    flexSheet.setCellData(2, 0,
                        "GRUPO GRAFICO DE MEXICO SA DE CV\n" +
                        "CALLE RETORNO EL SAUCITO #1030, INTERIOR 10, COMPLEJO INDUSTRIAL EL SAUCITO. C.P. 31123\n" +
                        "RFC GGM020610 Q54"
                    );

                    flexSheet.mergeRange(new wijmo.grid.CellRange(7, 0, 7, 4));
                    flexSheet.setCellData(7, 0, "SOLD TO / VENDIDO A:");

                    flexSheet.mergeRange(new wijmo.grid.CellRange(8, 0, 14, 4));

                    flexSheet.mergeRange(new wijmo.grid.CellRange(7, 5, 7, 9));
                    flexSheet.setCellData(7, 5, "SHIPPED TO / ENVIADO A:");

                    flexSheet.mergeRange(new wijmo.grid.CellRange(8, 5, 14, 9));
                    flexSheet.setCellData(8, 5,
                        "GILBERTO FERNANDEZ LEO\n" +
                        "2632   AV. ZARCO  COL. ZARCO 31020\n" +
                        "CHIHUAHUA CHIHUAHUA MEXICO\n" +
                        "R.F.C. FELG5404291K2"
                    );

                    flexSheet.setCellData(15, 0, "ORDER NO.");
                    flexSheet.setCellData(16, 0, "NO. ORDEN");
                    flexSheet.setCellData(15, 1, "CANTIDAD");
                    flexSheet.setCellData(16, 1, "QUANTITY");
                    flexSheet.mergeRange(new wijmo.grid.CellRange(15, 2, 15, 5));
                    flexSheet.mergeRange(new wijmo.grid.CellRange(16, 2, 16, 5));
                    flexSheet.setCellData(15, 2, "DESCRIPTION");
                    flexSheet.setCellData(16, 2, "DESCRIPCION");
                    flexSheet.setCellData(15, 6, "WEIGHT");
                    flexSheet.setCellData(16, 6, "PESO");
                    flexSheet.mergeRange(new wijmo.grid.CellRange(15, 7, 16, 7));
                    flexSheet.setCellData(15, 7, "P.O.");
                    flexSheet.setCellData(15, 8, "LINE");
                    flexSheet.setCellData(16, 8, "LINEA");
                    flexSheet.setCellData(15, 9, "SHIPPED");
                    flexSheet.setCellData(16, 9, "ENVIADO");
                    




                }

            }

            $scope.savePdf = function savePdf() {
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
            $scope.saveBtn = true;
            $scope.onSubmit = function () {
                var searchFn = {
                    "wo_release":"searchWoRelease",
                    "wo_id":"searchWoId",
                    "wo_po":"searchWoPo"
                }
                shippingListFac[searchFn[$scope.fmData.wo_search]]($scope.fmData[$scope.fmData.wo_search]).then(function (promise) {
                    $scope.saveBtn = !promise.data.length > 0;
                    
                        var flexSheet = $scope.flex,
                            row = 17;
                        if (flexSheet) {
                            flexSheet.deleteRows(17,975);
                            flexSheet.insertRows(17,975);

                            var total = {
                                qty:0,
                                weight:0,
                                gross_weight:0,
                                usd:0
                            }
                        }
                        if (angular.isArray(promise.data)) {
                            promise.data.forEach(function (value) {
                                
                                total.qty += +value.wo_qty;
                                total.weight += +value.total_weight;
                                total.gross_weight += +value.total_weight;                                
                                total.usd += +value.total_price;       

                                flexSheet.setCellData(row, 0, value.wo_id);
                                flexSheet.setCellData(row, 1, value.wo_qty);
                                flexSheet.mergeRange(new wijmo.grid.CellRange(row, 2, row, 5));
                                flexSheet.setCellData(row, 2, value.pr_description);
                                flexSheet.setCellData(row, 6, value.total_weight);
                                flexSheet.setCellData(row, 7, value.wo_po);                                
                                flexSheet.setCellData(row, 8, value.wo_line + ' / ' + value.wo_linetotal);                                
                                flexSheet.setCellData(row, 9, $filter('currency')(value.total_price, '$', 5));
                                row += 1;
                            })
                            row += 2;
                            flexSheet.setCellData(row, 0, "TOTAL");
                            flexSheet.setCellData(row, 4, total.qty);
                            flexSheet.setCellData(row, 5, "PIEZAS");
                            flexSheet.setCellData(row, 6, $filter('number')(total.weight, 5));
                            flexSheet.setCellData(row, 7, $filter('number')(total.gross_weight, 5));
                            flexSheet.setCellData(row, 9, $filter('currency')(total.usd, '$', 2));
                            flexSheet.applyCellsStyle({
                                fontWeight: 'bold'
                            }, [new wijmo.grid.CellRange(row, 0, row, 9)]);
                            row += 2;
                            flexSheet.mergeRange(new wijmo.grid.CellRange(row, 0, row, 9));
                            flexSheet.setCellData(row, 0, numberToText(total.usd.toFixed(2)));
                            flexSheet.applyCellsStyle({
                                fontWeight: 'bold'
                            }, [new wijmo.grid.CellRange(row, 0, row, 9)]);
                            flexSheet.applyCellsStyle({
                                textAlign: 'right'
                            }, [new wijmo.grid.CellRange(17, 6, row, 9)]);

                        } 
                        // var products = [];
                        // angular.forEach(promise.data, function (value, key) {
                        //     this.push({ "label": rows[key]['zo_jsonb']['zo_name'], "value": key });
                        // }, products);
                })
            }

            $scope.wo_searchoptions = i18nFilter("exportation-invoice-custom.fields.wo_searchoptions");


            $scope.$on('$viewContentLoaded', function () {
                $scope.loading = true;
                var client = undefined;
                var rows = undefined;
                shippingListFac.getClient().then(function (promise) {
                    if (angular.isArray(promise.data)) {
                        client = promise.data[0];
                    }
                }).then(function () {
                    shippingListFac.getZone().then(function (promise) {
                        $scope.zo_idoptions = [];
                        $scope.zo_idoptions.push({ "label": client.cl_jsonb.cl_tin, "value": "0" });
                        if (angular.isArray(promise.data)) {
                            rows = promise.data;
                            angular.forEach(rows, function (value, key) {
                                this.push({ "label": rows[key]['zo_jsonb']['zo_name'], "value": key });
                            }, $scope.zo_idoptions);
                        }
                    });
                    $scope.loading = false;
                })
                $scope.$watch(
                    "fmData.zo_id",
                    function zoChange(newValue, oldValue) {
                        var flexSheet = $scope.flex;
                        if (newValue !== undefined && flexSheet) {
                                if (newValue === "0") {
                                    flexSheet.setCellData(8, 0,
                                        client.cl_jsonb.cl_corporatename + '\n' +
                                        client.cl_jsonb.cl_street + ' ' + client.cl_jsonb.cl_streetnumber + ' ' + client.cl_jsonb.cl_suitenumber + '\n' +
                                        client.cl_jsonb.cl_neighborhood + '\n' +
                                        client.cl_jsonb.cl_state + ' ' + client.cl_jsonb.cl_city + '\n' +
                                        client.cl_jsonb.cl_tin + '\n' +
                                        client.cl_jsonb.cl_immex + '\n'

                                    );
                                    return;
                                }
                            flexSheet.setCellData(8, 0,
                                rows[newValue].zo_corporatename + '\n' +
                                rows[newValue].zo_street + ' ' + rows[newValue].zo_streetnumber + ' ' + rows[newValue].zo_suitenumber + '\n' +
                                rows[newValue].zo_neighborhood + '\n' +
                                rows[newValue].zo_state + ' ' + rows[newValue].zo_city + '\n' +
                                rows[newValue].zo_tin + '\n' +
                                rows[newValue].zo_immex + '\n'

                            );
                        }
                    }
                );
            });
        }]

})(angular);