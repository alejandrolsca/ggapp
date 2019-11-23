module.exports = (function (angular) {
    'use strict';

    return ['$scope', 'materialCountFac', 'i18nFilter', '$timeout',
        function ($scope, materialCountFac, i18nFilter, $timeout) {

            $scope.labels = Object.keys(i18nFilter("material-count.labels"));
            $scope.columns = i18nFilter("material-count.columns");
            $scope.workflow = i18nFilter("tlr.fields.wo_statusoptions");


            // export to xls
            $scope.exportXLS = function () {
                const timestamp = moment().tz('America/Chihuahua').format();
                const fileName = `materialCount_${timestamp}.xlsx`;
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
                    col.header = i18nFilter("material-count.labels." + $scope.columns[i].binding.replace('_', '-'));
                    col.wordWrap = false;
                    col.width = $scope.columns[i].width;
                    s.columns.push(col);
                }
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

                    if (col.binding === 'wo_status') {
                        angular.forEach($scope.workflow, function (value, key) {
                            if (value.value === panel.grid.getCellData(r, flex.columns.getColumn('wo_status').index)) {
                                row.dataItem.wo_status = `${value.value} - ${value.label}`;
                                cell.innerHTML = `${value.value} - ${value.label}`;
                            }
                        });
                    }
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
                const fromDate = moment($scope.fromDate.value).tz('UTC').format()
                const toDate = moment($scope.toDate.value).endOf('day').tz('UTC').format()
                $scope.loading = true;
                materialCountFac.data(fromDate, toDate).then(function (promise) {
                    $scope.loading = false;
                    if (angular.isArray(promise.data)) {
                        $scope.data = new wijmo.collections.CollectionView(promise.data);
                        $timeout(function () {
                            $scope.groupBy = '';
                            var cv = $scope.data;
                            cv.groupDescriptions.clear(); // clear current groups
                            var groupDesc = new wijmo.collections.PropertyGroupDescription('mt_code', function (item, prop) {
                                item.wo_materialqty = +item.wo_materialqty //convert string to number
                                return `${item.mt_code} - ${item.mt_description}`
                            });
                            cv.groupDescriptions.push(groupDesc);
                        }, 100)
                                        // start collapsed
                        $scope.ggGrid.collapseGroupsToLevel(0);
                    }
                });
            }

            $scope.$on('$viewContentLoaded', function () {
                // this code is executed after the view is loaded

                // create InputDate control
                $scope.fromDate = new wijmo.input.InputDate('#fromDate', {
                    format: 'yyyy-MM-dd',
                    mask: '9999-99-99',
                    value: new Date(moment().startOf('year'))
                });

                $scope.fromDate.valueChanged.addHandler(fromDateChanged)

                // create InputDate control
                $scope.toDate = new wijmo.input.InputDate('#toDate', {
                    min: $scope.fromDate.value,
                    format: 'yyyy-MM-dd',
                    mask: '9999-99-99',
                    value: new Date(moment().endOf('year'))
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

                getData()

            });
        }];

})(angular);