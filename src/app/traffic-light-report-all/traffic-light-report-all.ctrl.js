module.exports = (function (angular) {
    'use strict';

    return ['$scope', 'tlrAllFactory', '$location', 'i18nFilter', '$stateParams', '$filter', 'authService',
        function ($scope, tlrAllFactory, $location, i18nFilter, $stateParams, $filter, authService) {

            $scope.labels = Object.keys(i18nFilter("tlrAll.labels"));
            $scope.columns = i18nFilter("tlrAll.columns");
            $scope.workflow = i18nFilter("tlrAll.fields.wo_statusoptions");

            // formatter to add checkboxes to boolean columns
            $scope.onUpdate = function () {
                var flex = $scope.ggGrid;
                var arr = []
                for (var i = 0; i < flex.rows.length; i++) {
                    if (flex.getCellData(i, flex.columns.getColumn('active').index) === true) arr.push(+flex.getCellData(i, flex.columns.getColumn('wo_id').index));
                }
                $scope.wo_id = arr;
                $scope.selected = (arr.length > 0) ? true : false;
                var next_status = undefined;
                angular.forEach($scope.wo_statusoptions, function (value, key) {
                    if (value.value === $scope.fmData.wo_nextstatus) next_status = value.label;
                });
                $scope.next_status = next_status;
            };

            $scope.exportXLS = function () {
                const timestamp = moment().tz('America/Chihuahua').format();
                const fileName = `tlrAll_${timestamp}.xlsx`;
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

            $scope.itemFormatter = function (panel, r, c, cell) {

                if ((panel.cellType == wijmo.grid.CellType.Cell)) {
                    var flex = panel.grid;
                    var col = flex.columns[c];
                    var row = flex.rows[r];
                    // fix prevent randomn coloring
                    cell.style.backgroundColor = '';
                    cell.style.color = '';
                    // end fix
                    
                    // localize timezone America/Chihuahua
                    if (col.binding === 'wo_updated') {
                        if (row.dataItem.wo_updated) {
                            row.dataItem.wo_updated = moment(row.dataItem.wo_updated).tz('America/Chihuahua').format();
                        }
                    }
                    if (col.binding === 'wo_status') {
                        angular.forEach($scope.workflow, function (value, key) {
                            if (value.value === panel.grid.getCellData(r, flex.columns.getColumn('wo_status').index)) {
                                row.dataItem.wo_status = `(${value.value}) ${value.label}`;
                                cell.innerHTML = `(${value.value}) ${value.label}`;
                            }
                        });
                    }
                    if (col.binding === 'wo_deliverydate') {
                        if (row.dataItem.wo_deliverydate) {
                            row.dataItem.wo_deliverydate = moment(row.dataItem.wo_deliverydate).tz('America/Chihuahua').format();
                        }
                    }
                    if (col.binding === 'status') {
                        var closing_time = 18;
                        var commitment_date = moment(panel.grid.getCellData(r, flex.columns.getColumn('wo_commitmentdate').index, false)).set({
                            hour: closing_time,
                            minute: 0,
                            second: 0
                        });
                        var delivery_date = panel.grid.getCellData(r, flex.columns.getColumn('wo_deliverydate').index, false);
                        var hours = undefined;
                        var status = undefined;
                        if (delivery_date === null) {
                            hours = moment.duration(commitment_date.diff(moment().tz('America/Chihuahua').format('YYYY-MM-DD HH:mm:ss'))).asHours();
                            // delayed, commitment_date is due                            
                            if (hours < 0) {
                                status = 'Atrasado (' + Math.floor(Math.abs(hours) / 24) + ' Dia(s) ' + Math.floor(Math.abs(hours) % 24) + ' horas)';
                                cell.style.backgroundColor = 'OrangeRed';
                                cell.style.color = 'yellow';
                            }
                            // 2 days before commitment_date is due                           
                            if (hours >= 0 && hours <= 48) {
                                status = 'Restan ' + Math.floor(Math.abs(hours) / 24) + ' Dia(s) ' + Math.floor(Math.abs(hours) % 24) + ' horas';
                                cell.style.backgroundColor = 'Gold';
                            }
                            // mora than 2 days before commitment_date is due                           
                            if (hours > 48) {
                                status = 'Restan ' + Math.floor(Math.abs(hours) / 24) + ' Dia(s) ' + Math.floor(Math.abs(hours) % 24) + ' horas';
                                cell.style.backgroundColor = 'LightYellow';
                            }

                        } else {
                            hours = moment.duration(commitment_date.diff(moment(delivery_date).tz('America/Chihuahua').format('YYYY-MM-DD HH:mm:ss'))).asHours();
                            // delivered on commitment_date (same day)
                            if (hours >= 0 && hours <= closing_time) {
                                status = 'Entregado a tiempo';
                                cell.style.backgroundColor = 'LimeGreen';
                                cell.style.color = 'Black';
                            }
                            // delivered any time after commitment_date
                            if (hours < 0) {
                                status = 'Entrega a destiempo (' + Math.floor(Math.abs(hours) / 24) + ' Dia(s) ' + Math.floor(Math.abs(hours) % 24) + ' horas)';
                                cell.style.backgroundColor = 'Grey';
                                cell.style.color = 'Gainsboro';
                            }
                            // delivered a day before commitment_date                            
                            if (hours > closing_time) {
                                status = 'Entrega eficiente (' + Math.floor(Math.abs(hours) / 24) + ' Dia(s) ' + Math.floor(Math.abs(hours) % 24) + ' horas)'
                                cell.style.backgroundColor = 'DodgerBlue';
                                cell.style.color = 'White';
                            }
                        }
                        cell.style.overflow = 'visible';
                        row.dataItem.status = status;
                        cell.innerHTML = status;
                    }
                }



                // highlight rows that have 'active' set
                if (panel.cellType == wijmo.grid.CellType.Cell) {
                    var flex = panel.grid;
                    var row = flex.rows[r];
                    if (row.dataItem.active && col.header !== 'Status') {
                        cell.style.backgroundColor = 'gold';
                    }
                }

                if (panel.cellType == wijmo.grid.CellType.ColumnHeader) {
                    var flex = panel.grid;
                    var col = flex.columns[c];

                    // check that this is a boolean column
                    if (col.dataType == wijmo.DataType.Boolean) {

                        // prevent sorting on click
                        col.allowSorting = false;

                        // count true values to initialize checkbox
                        var cnt = 0;
                        for (var i = 0; i < flex.rows.length; i++) {
                            if (flex.getCellData(i, c) == true) cnt++;
                        }

                        // create and initialize checkbox
                        cell.innerHTML = '<input type="checkbox"> ' + cell.innerHTML;
                        var cb = cell.firstChild;
                        cb.checked = cnt > 0;
                        cb.indeterminate = cnt > 0 && cnt < flex.rows.length;

                        // apply checkbox value to cells
                        cb.addEventListener('click', function (e) {
                            flex.beginUpdate();
                            for (var i = 0; i < flex.rows.length; i++) {
                                flex.setCellData(i, c, cb.checked);
                            }
                            flex.endUpdate();
                        });
                    }
                }
            }

            // autosize columns
            $scope.itemsSourceChanged = function (sender, args) {
                sender.autoSizeColumns();
            };

            // autoSizeRows on sorted column
            $scope.onSortedColumn = function (sender, args) {
                console.log(sender)
                sender.autoSizeRows()
            };

            // bind columns when grid is initialized
            $scope.initGrid = function (s, e) {
                for (var i = 0; i < $scope.columns.length; i++) {
                    var col = new wijmo.grid.Column();
                    col.binding = $scope.columns[i].binding;
                    col.dataType = $scope.columns[i].type;
                    col.header = i18nFilter("tlrAll.labels." + $scope.columns[i].binding.replace('_', '-'));
                    s.columns.push(col);
                }
            };

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
                                    if (rng.col !== 0)
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

            $scope.$on('$viewContentLoaded', function () {

                // this code is executed after the view is loaded
                $scope.loading = true;
                tlrAllFactory.getData().then(function (promise) {
                    $scope.loading = false;
                    if (angular.isArray(promise.data)) {
                        // expose data as a CollectionView to get events
                        $scope.data = new wijmo.collections.CollectionView(promise.data);
                    }
                });
            });
        }];

})(angular);