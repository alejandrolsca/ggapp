var img_gglogo = require('../../../../static/img/gg-logo.png');

module.exports = (function (angular) {
    'use strict';

    return ['$scope', 'shippingListViewFac', '$location', 'i18nFilter', '$stateParams', '$filter', 'authService',
        function ($scope, shippingListViewFac, $location, i18nFilter, $stateParams, $filter, authService) {

            $scope.exportPDF = async () => {
                console.log('entro')
                const margin = 36
                var doc = new wijmo.pdf.PdfDocument({
                    pageSettings: {
                        layout: wijmo.pdf.PdfPageOrientation.Portrait,
                        size: wijmo.pdf.PdfPageSize.Letter,
                        margins: { // margins are given in points
                            left: margin,
                            top: margin,
                            right: margin,
                            bottom: margin
                        },
                    },
                    ended: function (sender, args) {
                        wijmo.pdf.saveBlob(args.blob, 'FlexGrid.pdf');
                    }
                });
                console.log('width', wijmo.pdf.pxToPt(150), 'height', wijmo.pdf.pxToPt(79))
                console.log('width', doc.width, 'height', doc.height) // plus 72 points

                doc.header.drawImage(img_gglogo, 0, 0, {
                    width: wijmo.pdf.pxToPt(150),
                    height: wijmo.pdf.pxToPt(79)
                });
                const exporter = dedent`Grupo Gráfico de México S.A. de C.V.
                                    Calle Retorno El Saucito #1030, interior 10, Complejo Industrial El Saucito.
                                    C.P. 31123 Chihuahua, Chih.
                                    RFC:GGM020610Q54
                                    Tel: (614) 4216260, 4216261
                                    Fax: 4214353
                                    Chihuahua, Chih.
                                    info@grupografico.com.mx`
                const { data: clientData } = await shippingListViewFac.getClient()
                const [client] = clientData
                const soldTo = dedent`SOLD TO / VENDIDO A:
                                ${client.cl_corporatename}
                                ${client.cl_street} ${client.cl_streetnumber} ${(client.cl_suitenumber || '')}
                                ${(client.cl_neighborhood || '')}
                                ${client.cl_city}, ${client.cl_state}. ${client.cl_country}
                                ${client.cl_rfc}
                                ${(client.cl_immex || '')}`

                doc.setFont(new wijmo.pdf.PdfFont('Helvetica', 10, 'normal', '500'));
                doc.header.drawText(exporter, margin + wijmo.pdf.pxToPt(150) + 5, 0, {
                    align: wijmo.pdf.PdfTextHorizontalAlign.Right,
                    width: doc.width - wijmo.pdf.pxToPt(150) - margin
                });

                shippingListViewFac.getClient().then(function (promise) {
                    if (angular.isArray(promise.data)) {
                        var client = promise.data[0];
                        doc.header.drawText(soldTo, 0, 100, {
                            align: wijmo.pdf.PdfTextHorizontalAlign.Left,
                            width: 270
                        });

                    }
                }).then(function () {
                    doc.footer.drawText("FIRMA Y SELLO DE RECIBIDO", null, null, {
                        align: wijmo.pdf.PdfTextHorizontalAlign.Center
                    });
                    //doc.addPage();
                    doc.end();
                })
                const headers = ['ORDER NO', 'QUANTITY', 'DESCRIPTION', 'WEIGHT', 'P.O.', 'LINE', 'SHIPPED']
                const headersSpanish = ['NO ORDEN', 'CANTIDAD', 'DESCRIPCION', 'PESO', 'O.C', 'RELEASE', 'ENVIADO']
                const colWidth = 60
                const rowHeight = doc.lineHeight() + 2
                const widths = [colWidth, colWidth, colWidth * 3, colWidth, colWidth, colWidth, colWidth]
                let x = 0
                let y = 160
                headers.map((value, index, data) => {
                    console.log(x)
                    doc.paths
                        .rect(x, y, widths[index], rowHeight)
                        .stroke();
                    doc.drawText(data[index], x, y + 1, {
                        height: rowHeight,
                        width: widths[index],
                        align: wijmo.pdf.PdfTextHorizontalAlign.Center
                    });
                    x += (widths[index] / colWidth) * colWidth
                })
                x = 0
                y += rowHeight
                headersSpanish.map((value, index, data) => {
                    console.log(x)
                    doc.paths
                        .rect(x, y, widths[index], rowHeight)
                        .stroke();
                    doc.drawText(data[index], x, y + 1, {
                        height: rowHeight,
                        width: widths[index],
                        align: wijmo.pdf.PdfTextHorizontalAlign.Center
                    });
                    x += (widths[index] / colWidth) * colWidth
                })
                x = 0
                y += rowHeight
                for (var i = 0; i < 40; i++) {
                    headers.map((value, index, data) => {
                        console.log(x)
                        doc.paths
                            .rect(x, y, widths[index], rowHeight)
                            .stroke();
                        doc.drawText(data[index], x, y + 1, {
                            height: rowHeight,
                            width: widths[index],
                            align: wijmo.pdf.PdfTextHorizontalAlign.Center
                        });
                        x += (widths[index] / colWidth) * colWidth
                    })
                    x = 0
                    y += rowHeight
                }

            }

            $scope.fmData = {};

            $scope.disableXLS = false;
            $scope.exportXLS = function () {
                var flexSheet = $scope.flex,
                    fileName, timestamp;
                if (flexSheet) {
                    if (!!$scope.fileName) {
                        fileName = $scope.fileName;
                    } else {
                        timestamp = moment().tz('America/Chihuahua').format();
                        fileName = `shipping_list_${$scope.fmData.sl_id}_${timestamp}.xlsx`;
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
                    flexSheet.setCellData(16, 8, "RELEASE");
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

            $scope.$on('$viewContentLoaded', async () => {
                $scope.loading = true;
                var client = undefined;
                var rows = undefined;
                shippingListViewFac.getSL().then(function (promise) {
                    const { data } = promise
                    const [shippinglist] = data
                    $scope.fmData = shippinglist
                    const flexSheet = $scope.flex;
                    const sl_date = moment(shippinglist.sl_date).tz('America/Chihuahua').format('DD/MM/YYYY')
                    flexSheet.setCellData(0, 0, `LISTA DE EMBARQUE #${shippinglist.sl_id} ${sl_date}`);
                }).then(function () {
                    shippingListViewFac.getClient($scope.fmData.cl_id).then(function (promise) {
                        const { data } = promise
                        if (angular.isArray(data)) {
                            const [client] = data
                            var flexSheet = $scope.flex;
                            flexSheet.setCellData(8, 0,
                                dedent`${client.cl_corporatename}
                                ${client.cl_street} ${client.cl_streetnumber} ${(client.cl_suitenumber || '')}
                                ${(client.cl_neighborhood || '')}
                                ${client.cl_city}, ${client.cl_state}. ${client.cl_country}
                                ${client.cl_rfc}`
                            );
                        }
                    }).then(function () {
                        shippingListViewFac.getZone($scope.fmData.cl_id).then(function (promise) {
                            $scope.zo_idoptions = [];
                            const { data } = promise
                            if (angular.isArray(data)) {
                                rows = data;
                                angular.forEach(rows, function (value, key) {
                                    this.push({ "label": value.zo_zone, "value": value.zo_id });
                                }, $scope.zo_idoptions);
                                $scope.$watch(
                                    "fmData.zo_id",
                                    function zoChange(newValue, oldValue) {
                                        const zone = rows.find(function (zone) {
                                            return zone.zo_id = newValue
                                        })
                                        console.log(zone)
                                        var flexSheet = $scope.flex;
                                        if (newValue !== undefined && flexSheet) {
                                            flexSheet.setCellData(8, 5,
                                                zone.zo_corporatename + '\n' +
                                                zone.zo_street + ' ' + zone.zo_streetnumber + ' ' + (zone.zo_suitenumber || '') + '\n' +
                                                (zone.zo_neighborhood || '') + '\n' +
                                                zone.zo_city + ', ' + zone.zo_state + '. ' + zone.zo_country + '\n' +
                                                zone.zo_rfc + '\n' +
                                                (zone.zo_immex || '') + '\n'

                                            );
                                        }
                                    }
                                );
                            }
                        }).then(function () {
                            $scope.wo_id = $scope.fmData.wo_id
                            shippingListViewFac.searchWoId($scope.fmData.cl_id, $scope.fmData.wo_id).then(function (promise) {
                                $scope.loading = false;

                                $scope.data = promise.data
                                $scope.disableXLS = ($scope.data.length === 1);

                                console.log($scope.disableXLS)

                                var flexSheet = $scope.flex,
                                    row = 17;
                                if (flexSheet) {
                                    flexSheet.deleteRows(17, 975);
                                    flexSheet.insertRows(17, 975);
                                }
                                if (angular.isArray(promise.data)) {
                                    promise.data.map(function (value, index, data) {

                                        flexSheet.setCellData(row, 0, value.wo_id);
                                        flexSheet.setCellData(row, 1, value.wo_qty);
                                        flexSheet.mergeRange(new wijmo.grid.CellRange(row, 2, row, 5));
                                        flexSheet.setCellData(row, 2, value.pr_name);
                                        flexSheet.setCellData(row, 6, $filter('number')(value.pr_weight, 6));
                                        flexSheet.setCellData(row, 7, value.wo_po);
                                        flexSheet.setCellData(row, 8, value.wo_release);
                                        flexSheet.setCellData(row, 9, (++index < data.length) ? moment().tz('America/Chihuahua').format('YYYY-MM-DD') : null);
                                        row += 1;
                                    })
                                }
                            })
                        })
                    })
                })
            });
        }]

})(angular);