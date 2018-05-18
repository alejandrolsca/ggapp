module.exports = (function (angular) {
    'use strict';

    return ['$scope', 'earningsByStatusFac', 'i18nFilter', '$timeout',
        function ($scope, earningsByStatusFac, i18nFilter, $timeout) {

            $scope.labels = Object.keys(i18nFilter("earnings-by-status.labels"));
            $scope.columns = i18nFilter("earnings-by-status.columns");
            $scope.workflow = i18nFilter("tlr.fields.wo_statusoptions");


            // export to xls
            $scope.exportXLS = function () {
                const timestamp = moment().tz('America/Chihuahua').format();
                const fileName = `earningsbystatus_${timestamp}.xlsx`;
                const flexGrid = $scope.ggGrid
                try {
                    wijmo.grid.xlsx.FlexGridXlsxConverter.save(flexGrid, {
                        includeColumnHeaders: true,
                        includeCellStyles: false
                    }, fileName);
                } catch (error) {
                    throw new Error(error)
                }
            }

            // bind columns when grid is initialized
            $scope.initGrid = function (s, e) {
                for (var i = 0; i < $scope.columns.length; i++) {
                    var col = new wijmo.grid.Column();
                    col.binding = $scope.columns[i].binding;
                    col.dataType = $scope.columns[i].type;
                    col.isContentHtml = $scope.columns[i].html;
                    col.format = $scope.columns[i].format;
                    col.aggregate = $scope.columns[i].aggregate;
                    col.header = i18nFilter("earnings-by-status.labels." + $scope.columns[i].binding.replace('_', '-'));
                    col.wordWrap = false;
                    col.width = $scope.columns[i].width;
                    s.columns.push(col);
                }
                //s.columns.moveElement(0, 1)
            };

            $scope.itemFormatter = function (panel, r, c, cell) {

                if ((panel.cellType == wijmo.grid.CellType.Cell)) {
                    var flex = panel.grid;
                    var col = flex.columns[c];
                    var row = flex.rows[r];
                    // fix prevent randomn coloring
                    cell.style.backgroundColor = '';
                    cell.style.color = '';
                    // end fix
                }
            }

            // create the tooltip object
            $scope.$watch('ggGrid', function () {
                if ($scope.ggGrid) {

                    // store reference to grid
                    var flex = $scope.ggGrid;

                    // create tooltip
                    var tip = new wijmo.Tooltip(),
                        rng = null;

                    // monitor the mouse over the grid
                    flex.hostElement.addEventListener('mousemove', function (evt) {
                        var ht = flex.hitTest(evt);
                        if (!ht.range.equals(rng)) {

                            // new cell selected, show tooltip
                            if (ht.cellType == wijmo.grid.CellType.Cell) {
                                rng = ht.range;
                                var col = flex.columns[rng.col].header;
                                var cellElement = document.elementFromPoint(evt.clientX, evt.clientY),
                                    cellBounds = wijmo.Rect.fromBoundingRect(cellElement.getBoundingClientRect()),
                                    data = wijmo.escapeHtml(flex.getCellData(rng.row, rng.col, true)),
                                    tipContent = col + ': "<b>' + data + '</b>"';
                                if (cellElement.className.indexOf('wj-cell') > -1) {
                                    tip.show(flex.hostElement, tipContent, cellBounds);
                                } else {
                                    tip.hide(); // cell must be behind scroll bar...
                                }
                            }
                        }
                    });
                    flex.hostElement.addEventListener('mouseout', function () {
                        tip.hide();
                        rng = null;
                    });
                }
            });

            const getData = () => {
                const target_date = $scope.target_date
                let fromDate
                let toDate
                if (target_date === 'wo_date') {
                    fromDate = moment($scope.fromDate.value).tz('UTC').format()
                    toDate = moment($scope.toDate.value).endOf('day').tz('UTC').format()
                }
                if (target_date === 'wo_commitmentdate') {
                    fromDate = moment($scope.fromDate.value).format('YYYY-MM-DD')
                    toDate = moment($scope.toDate.value).format('YYYY-MM-DD')
                }
                console.log(fromDate, toDate)
                const wo_currency = $scope.wo_currency
                $scope.loading = true;
                earningsByStatusFac.data(target_date, wo_currency, fromDate, toDate).then(function (promise) {
                    $scope.loading = false;
                    if (angular.isArray(promise.data)) {
                        $scope.data = new wijmo.collections.CollectionView(promise.data);
                        $timeout(function () {
                            $scope.groupBy = '';
                            var cv = $scope.data;
                            cv.groupDescriptions.clear(); // clear current groups
                            var groupDesc = new wijmo.collections.PropertyGroupDescription('cl_corporatename', function (item, prop) {
                                //convert string to number
                                item['total'] = Number(item['total'])
                                item['0'] = Number(item['0'])
                                item['1'] = Number(item['1'])
                                item['2'] = Number(item['2'])
                                item['3'] = Number(item['3'])
                                item['4'] = Number(item['4'])
                                item['5'] = Number(item['5'])
                                item['6'] = Number(item['6'])
                                item['7'] = Number(item['7'])
                                item['8'] = Number(item['8'])
                                item['9'] = Number(item['9'])
                                item['10'] = Number(item['10'])
                                item['11'] = Number(item['11'])
                                item['12'] = Number(item['12'])
                                item['13'] = Number(item['13'])
                                item['14'] = Number(item['14'])
                                item['15'] = Number(item['15'])
                                item['16'] = Number(item['16'])
                                item['17'] = Number(item['17'])
                                item['18'] = Number(item['18'])
                                return item.wo_updatedby
                            });
                            cv.groupDescriptions.push(groupDesc);
                        }, 100)
                    }
                });
            }

            $scope.target_date = 'wo_commitmentdate'
            $scope.wo_currency = 'DLLS'
            $scope.wo_currencyoptions = i18nFilter("earnings-by-status.fields.wo_currencyoptions");
            $scope.target_dateoptions = i18nFilter("earnings-by-status.fields.target_dateoptions");

            $scope.$on('$viewContentLoaded', function () {
                // this code is executed after the view is loaded              

                // create InputDate control
                $scope.fromDate = new wijmo.input.InputDate('#fromDate', {
                    format: 'MM/dd/yyyy',
                    value: new Date(moment().startOf('month').format('YYYY-MM-DD HH:mm:ss'))
                });

                $scope.fromDate.valueChanged.addHandler(fromDateChanged)

                // create InputDate control
                $scope.toDate = new wijmo.input.InputDate('#toDate', {
                    min: $scope.fromDate.value,
                    format: 'MM/dd/yyyy',
                    value: new Date(moment().endOf('month').format('YYYY-MM-DD HH:mm:ss'))
                });

                $scope.toDate.valueChanged.addHandler(toDateChanged)

                // fromDate changed function
                function fromDateChanged(s, e) {
                    $scope.toDate.min = s.value
                    getData()
                }

                // fromDate changed function
                function toDateChanged(s, e) {
                    getData()
                }

                $scope.$watchGroup(['wo_currency', 'target_date'], function (newValues, oldValues, scope) {
                    console.log('entro')
                    getData()
                })

            });
        }];

})(angular);