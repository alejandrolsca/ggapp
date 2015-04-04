module.exports = (function (angular) {
    'use strict';
    
    return function ($scope, woFactory,$location, i18nFilter) {
    
        $scope.fields = Object.keys(i18nFilter("WO.FIELDS"));

        $scope.edit = function (id) {
            if (angular.isNumber(id)) {
                    var link = "#/wo/update/" + id;
                    window.location = link;
            }
        };

        $scope.duplicate = function (id) {
            if (angular.isNumber(id)) {
                var link = "#/wo/duplicate/" + id;
                window.location = link;
            }
        };
        
        // bind columns when grid is initialized
        $scope.initGrid = function(s, e) {
            for (var i = 0; i < $scope.labels.length; i++) {
                var col = new wijmo.grid.Column();
                col.binding = $scope.fields[i].toLowerCase();
                col.header = i18nFilter("WO.labels." + $scope.fields[i]);
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
                    if (!ht.cellRange.equals(rng)) {

                        // new cell selected, show tooltip
                        if (ht.cellType == wijmo.grid.CellType.Cell) {
                            rng = ht.cellRange;
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

        $scope.$on('$viewContentLoaded', function() {
            // this code is executed after the view is loaded

            $scope.loading = true;
            
            woFactory.getData().then(function(promise){
                
                $scope.loading = false;
                
                if(angular.isArray(promise.data)) {
                                            
                    // expose data as a CollectionView to get events
                    $scope.data = new wijmo.collections.CollectionView(promise.data);   
                    
                }
                //console.log(JSON.stringify(promise.data));
            });
         });
    };
    
})(angular);