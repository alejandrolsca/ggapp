module.exports = (function (angular) {
    'use strict';

    return ['$scope', 'tlrFactory', '$location', 'i18nFilter', '$stateParams', '$filter', 'authService',
        function ($scope, tlrFactory, $location, i18nFilter, $stateParams, $filter, authService) {

            var userProfile = angular.fromJson(localStorage.getItem('profile')) || {};



            $scope.labels = Object.keys(i18nFilter("tlr.labels"));
            $scope.columns = i18nFilter("tlr.columns");

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

            $scope.onSubmit = function () {
                console.log($scope.wo_id.join(','))
                tlrFactory.update($scope.fmData.wo_nextstatus, $scope.wo_id.join(',')).then(function (promise) {
                    console.log(promise.data)
                    if (promise.data.rowCount >= 1) {
                        $scope.fmData.wo_status = $scope.fmData.wo_nextstatus;
                    } else {
                        $scope.updateFail = true;
                    }
                });
                $('#myModal').modal('hide');
                console.log('submited')
            }

            $scope.itemFormatter = function (panel, r, c, cell) {

                if ((panel.cellType == wijmo.grid.CellType.Cell) && (c === 1)) {
                    var commitment_date = moment(panel.grid.getCellData(r, 24, false).substring(0, 10));
                    var delivery_date = panel.grid.getCellData(r, 25, false);
                    var days = undefined;
                    //console.log(delivery_date);
                    if (delivery_date === null) {
                        if (commitment_date.diff(moment(), 'days') <= 0) cell.style.backgroundColor = 'OrangeRed';
                        if (commitment_date.diff(moment(), 'days') > 0 && commitment_date.diff(moment(), 'days') < 3) cell.style.backgroundColor = 'Gold';
                        days = commitment_date.diff(moment(), 'days');
                    } else {
                        if (commitment_date.diff(moment(delivery_date.substring(0, 10)), 'days') === 0) cell.style.backgroundColor = 'LimeGreen';
                        if (commitment_date.diff(moment(delivery_date.substring(0, 10)), 'days') < 0) cell.style.backgroundColor = 'Grey';
                        if (commitment_date.diff(moment(delivery_date.substring(0, 10)), 'days') > 0) cell.style.backgroundColor = 'DodgerBlue';
                        days = commitment_date.diff(moment(delivery_date.substring(0, 10)), 'days');
                    }
                    //a.diff(b, 'days') // 1
                    cell.style.overflow = 'visible';
                    cell.innerHTML = days;
                }



                // highlight rows that have 'active' set
                if (panel.cellType == wijmo.grid.CellType.Cell) {
                    var flex = panel.grid;
                    var row = flex.rows[r];
                    if (row.dataItem.active) {
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

            // bind columns when grid is initialized
            $scope.initGrid = function (s, e) {
                for (var i = 0; i < $scope.columns.length; i++) {
                    var col = new wijmo.grid.Column();
                    col.binding = $scope.columns[i];
                    col.header = i18nFilter("tlr.labels." + $scope.labels[i]);
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

            $scope.wo_statusoptions = [];
            var wo_statusoptions = JSON.parse(JSON.stringify(i18nFilter("tlr.fields.wo_statusoptions")))
            var duplicated = [];
            angular.forEach(wo_statusoptions, function (value, key) {
                if (value.us_group === userProfile.app_metadata.us_group) {
                    this.push.apply(this, value.wo_prevstatus);
                }
            }, duplicated)

            duplicated.reduce(function (accum, current) {
                if (accum.indexOf(current) < 0) {
                    accum.push(current);
                }
                return accum;
            }, []);

            angular.forEach(wo_statusoptions, function (value, key) {
                if (duplicated.includes(value.value)) {
                    value.notAnOption = false;
                } else {
                    value.notAnOption = true;
                }
                this.push(value)
            }, $scope.wo_statusoptions)

            $scope.pagesizeoptions = [
                { "label": "2", "value": 2 },
                { "label": "5", "value": 5 },
                { "label": "25", "value": 25 },
                { "label": "50", "value": 50 },
                { "label": "100", "value": 100 },
                { "label": "200", "value": 200 },
                { "label": "500", "value": 500 },
                { "label": "1000", "value": 1000 },
            ]

            $scope.$on('$viewContentLoaded', function () {

                // this code is executed after the view is loaded
                $scope.loading = true;
                $scope.$watch('fmData.wo_status', function (newValue, oldValue) {
                    $scope.actions = [];
                    var actions = JSON.parse(JSON.stringify(i18nFilter("tlr.fields.wo_statusoptions")));
                    angular.forEach(actions, function (value, key) {
                        if (value.wo_prevstatus.includes(newValue)) {
                            if (value.us_group === userProfile.app_metadata.us_group || userProfile.app_metadata.us_group === "admin") {
                                if ([14, 15].includes(newValue) && [14, 15].includes(value.value)) {
                                    value.notAnOption = true;
                                } else {
                                    value.notAnOption = false;
                                }
                            } else {
                                value.notAnOption = true;
                            }
                            this.push(value);
                        }
                    }, $scope.actions)
                    tlrFactory.getData(newValue).then(function (promise) {
                        $scope.loading = false;
                        if (angular.isArray(promise.data)) {
                            // expose data as a CollectionView to get events
                            $scope.data = new wijmo.collections.CollectionView(promise.data);
                            $scope.data.pageSize = 25;
                        }
                    });
                });
            });
        }];

})(angular);