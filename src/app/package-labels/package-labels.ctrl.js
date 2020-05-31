module.exports = (function (angular) {
    'use strict';

    return ['$scope', 'packageLabelsFac', 'i18nFilter', 'authService','notyf',
        function ($scope, packageLabelsFac, i18nFilter, authService, notyf) {

            $scope.save = function () {
                $scope.pdfDisabled = true //prevents saving multiple times
                const margin = 11.33858267717
                const labelSize = new wijmo.Size((72 * 4), (72 * 2))
                var doc = new wijmo.pdf.PdfDocument({
                    header: { height: 0 },
                    footer: { height: 0 },
                    pageSettings: {
                        layout: wijmo.pdf.PdfPageOrientation.Portrait,
                        size: labelSize,  //wijmo.pdf.PdfPageSize.Letter,
                        margins: { // margins are given in points
                            left: margin,
                            top: margin,
                            right: margin,
                            bottom: margin
                        },
                    },
                    ended: function (sender, args) {
                        wijmo.pdf.saveBlob(args.blob, `package_labels_${$scope.wo.wo_id}.pdf`);
                    }
                });

                const iterationsFormula = {
                    "cientos": Math.floor(($scope.wo.wo_qty * 100) / $scope.wo.wo_packageqty),
                    "piezas": Math.floor($scope.wo.wo_qty / $scope.wo.wo_packageqty),
                    "millares": Math.floor(($scope.wo.wo_qty * 1000) / $scope.wo.wo_packageqty),
                    "rollos": Math.floor(($scope.wo.wo_qty * $scope.wo.wo_packageqty) / $scope.wo.wo_packageqty)
                }

                const residueFormula = {
                    "cientos": ($scope.wo.wo_qty * 100) % $scope.wo.wo_packageqty,
                    "piezas": $scope.wo.wo_qty % $scope.wo.wo_packageqty,
                    "millares": ($scope.wo.wo_qty * 1000) % $scope.wo.wo_packageqty,
                    "rollos": ($scope.wo.wo_qty * $scope.wo.wo_packageqty) % $scope.wo.wo_packageqty
                }

                let iterations = iterationsFormula[$scope.wo.wo_qtymeasure]
                const residue = residueFormula[$scope.wo.wo_qtymeasure]

                let qty = $scope.wo.wo_packageqty                

                if (residue > 0) {
                    iterations += 1
                }
                for (let i = 1; i <= iterations; i++) {
                    if (i === iterations && (residue > 0)) {
                        qty = residue
                    }
                    doc.setFont(new wijmo.pdf.PdfFont('Helvetica', 10, 'normal', 'bold'));
                    doc.drawText("Producto:", 144 - margin, 0, {
                        align: wijmo.pdf.PdfTextHorizontalAlign.Left
                    });
                    doc.setFont(new wijmo.pdf.PdfFont('Helvetica', 10, 'normal', '400'));
                    doc.drawText(`${$scope.wo.pr_name}`, 144 - margin, 12, {
                        height: 48,
                        width: 144 - margin,
                        align: wijmo.pdf.PdfTextHorizontalAlign.Left
                    });
                    doc.setFont(new wijmo.pdf.PdfFont('Helvetica', 12, 'normal', '500'));
                    doc.drawText(`${$scope.wo.cl_corporatename}`, 0, 63, {
                        height: 72 - margin,
                        width: 144 - margin,
                        align: wijmo.pdf.PdfTextHorizontalAlign.Left
                    });
                    doc.setFont(new wijmo.pdf.PdfFont('Helvetica', 10, 'normal', 'bold'));
                    doc.drawText("No parte", 144 - margin, 58, {
                        align: wijmo.pdf.PdfTextHorizontalAlign.Left
                    });
                    doc.setFont(new wijmo.pdf.PdfFont('Helvetica', 10, 'normal', '400'));
                    doc.drawText(`${$scope.wo.pr_partno}`, 144 - margin, 70, {
                        height: 24,
                        width: 144 - margin,
                        align: wijmo.pdf.PdfTextHorizontalAlign.Left
                    });
                    doc.setFont(new wijmo.pdf.PdfFont('Helvetica', 10, 'normal', 'bold'));
                    doc.drawText("Cant.", 144 - margin, 93, {
                        align: wijmo.pdf.PdfTextHorizontalAlign.Left
                    });
                    doc.setFont(new wijmo.pdf.PdfFont('Helvetica', 10, 'normal', '400'));
                    doc.drawText(`${qty}`, 144 - margin, 105, {
                        align: wijmo.pdf.PdfTextHorizontalAlign.Left
                    });
                    doc.setFont(new wijmo.pdf.PdfFont('Helvetica', 10, 'normal', 'bold'));
                    doc.drawText("Paq.", 180 - margin, 93, {
                        align: wijmo.pdf.PdfTextHorizontalAlign.Left
                    });
                    doc.setFont(new wijmo.pdf.PdfFont('Helvetica', 10, 'normal', '400'));
                    doc.drawText(`${i}/${iterations}`, 180 - margin, 105, {
                        align: wijmo.pdf.PdfTextHorizontalAlign.Left
                    });
                    doc.setFont(new wijmo.pdf.PdfFont('Helvetica', 10, 'normal', 'bold'));
                    doc.drawText("# Orden", 228 - margin, 93, {
                        align: wijmo.pdf.PdfTextHorizontalAlign.Left
                    });
                    doc.setFont(new wijmo.pdf.PdfFont('Helvetica', 10, 'normal', '400'));
                    doc.drawText(`${$scope.wo.wo_id}`, 228 - margin, 105, {
                        align: wijmo.pdf.PdfTextHorizontalAlign.Left
                    });
                    if (i < iterations) {
                        doc.addPage();
                    }
                }
                doc.end()
            }

            $scope.pdfDisabled = true;
            $scope.onSubmit = function () {
                try {
                    packageLabelsFac.searchWoId($scope.fmData.wo_id).then(function (promise) {
                        const { data } = promise
                        const woFound = (data.length === 1)
                        if (woFound) {
                            const [wo] = data
                            $scope.wo = wo
                            console.log(authService.userHasRole(['owner']))
                            const isValidStatus = authService.userHasRole(['owner']) ? true : [11].includes(wo.wo_status)
                            if (!isValidStatus) {
                                $scope.pdfDisabled = true
                                $scope.fmData.wo_packageqty = undefined
                                notyf.open({
                                    type: 'warning',
                                    message: 'Solo se aceptan ordenes en Empaque e Inspección Final.'
                                });
                                return;
                            }
                            if(!$scope.wo.wo_qtymeasure) {
                                console.log($scope.wo.wo_qtymeasure)
                                notyf.error('No se encontro la unidad de medida (cientos, millares, piezas, rollos) para Cantidad.');
                                return;
                            }
                            $scope.fmData.wo_packageqty = wo.wo_packageqty
                            $scope.pdfDisabled = false
                        } else {
                            $scope.pdfDisabled = true
                            $scope.fmData.wo_packageqty = undefined
                            notyf.open({
                                type: 'warning',
                                message: 'No se encontro la orden de trabajo.'
                            });
                            return;
                        }
                    })
                } catch (error) {
                    throw new Error(error)
                }

            }

            $scope.$on('$viewContentLoaded', function () {

            });
        }]

})(angular);