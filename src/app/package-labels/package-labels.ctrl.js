module.exports = (function (angular) {
    'use strict';

    return ['$scope', 'packageLabelsFac', 'i18nFilter', 'authService',
        function ($scope, packageLabelsFac, i18nFilter, authService) {

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
                let iterations = Math.floor($scope.wo.wo_qty / $scope.wo.wo_packageqty)
                let qty = $scope.wo.wo_packageqty                
                const residue = ($scope.wo.wo_qty % $scope.wo.wo_packageqty)
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
                    doc.drawText($scope.wo.pr_name, 144 - margin, 12, {
                        height: 48,
                        width: 144 - margin,
                        align: wijmo.pdf.PdfTextHorizontalAlign.Left
                    });
                    doc.setFont(new wijmo.pdf.PdfFont('Helvetica', 10, 'normal', 'bold'));
                    doc.drawText("Cantidad:", 144 - margin, 63, {
                        align: wijmo.pdf.PdfTextHorizontalAlign.Left
                    });
                    doc.setFont(new wijmo.pdf.PdfFont('Helvetica', 10, 'normal', '400'));
                    doc.drawText(`${qty}`, 144 - margin, 75, {
                        align: wijmo.pdf.PdfTextHorizontalAlign.Left
                    });
                    doc.setFont(new wijmo.pdf.PdfFont('Helvetica', 10, 'normal', 'bold'));
                    doc.drawText("No parte:", 216 - margin, 63, {
                        align: wijmo.pdf.PdfTextHorizontalAlign.Left
                    });
                    doc.setFont(new wijmo.pdf.PdfFont('Helvetica', 10, 'normal', '400'));
                    doc.drawText($scope.wo.pr_partno, 216 - margin, 75, {
                        align: wijmo.pdf.PdfTextHorizontalAlign.Left
                    });
                    doc.setFont(new wijmo.pdf.PdfFont('Helvetica', 10, 'normal', 'bold'));
                    doc.drawText("Paquete", 144 - margin, 93, {
                        align: wijmo.pdf.PdfTextHorizontalAlign.Left
                    });
                    doc.setFont(new wijmo.pdf.PdfFont('Helvetica', 10, 'normal', '400'));
                    doc.drawText(`${i}/${iterations}`, 144 - margin, 105, {
                        align: wijmo.pdf.PdfTextHorizontalAlign.Left
                    });
                    doc.setFont(new wijmo.pdf.PdfFont('Helvetica', 10, 'normal', 'bold'));
                    doc.drawText("No. Orden:", 216 - margin, 93, {
                        align: wijmo.pdf.PdfTextHorizontalAlign.Left
                    });
                    doc.setFont(new wijmo.pdf.PdfFont('Helvetica', 10, 'normal', '400'));
                    doc.drawText(`${$scope.wo.wo_id}`, 216 - margin, 105, {
                        align: wijmo.pdf.PdfTextHorizontalAlign.Left
                    });
                    doc.setFont(new wijmo.pdf.PdfFont('Helvetica', 12, 'normal', '500'));
                    doc.drawText($scope.wo.cl_corporatename, 0, 63, {
                        height: 72 - margin,
                        width: 144 - margin,
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
                        if (!data.length > 0) {
                            $scope.pdfDisabled = true
                            $scope.fmData.wo_packageqty = undefined
                            return;
                        }
                        const [wo] = data
                        $scope.wo = wo
                        $scope.fmData.wo_packageqty = wo.wo_packageqty
                        $scope.pdfDisabled = false
                    })
                } catch (error) {
                    throw new Error(error)
                }

            }

            $scope.$on('$viewContentLoaded', function () {

            });
        }]

})(angular);