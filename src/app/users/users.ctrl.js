module.exports = (function (angular) {
    'use strict';

    return ['$scope', 'usersFac', 'i18nFilter',
        function ($scope, usersFac, i18nFilter) {

            $scope.labels = Object.keys(i18nFilter("users.labels"));
            $scope.columns = i18nFilter("users.columns");

            // bind columns when grid is initialized
            $scope.initGrid = function (s, e) {
                for (var i = 0; i < $scope.columns.length; i++) {
                    var col = new wijmo.grid.Column();
                    col.binding = $scope.columns[i].binding;
                    col.dataType = $scope.columns[i].type;
                    col.isContentHtml = $scope.columns[i].html;
                    col.header = i18nFilter("users.labels." + $scope.columns[i].binding.replace('_', '-'));
                    col.wordWrap = false;
                    col.width = $scope.columns[i].width;
                    s.columns.push(col);
                }
            };

            $scope.itemFormatter = function (panel, r, c, cell) {

                // fix prevent randomn coloring
                cell.style.backgroundColor = '';
                cell.style.color = '';
                // end fix
                cell.style.height = '8em';
            }

            $scope.$on('$viewContentLoaded', function () {
                // this code is executed after the view is loaded
                $scope.loading = true;
                usersFac.getUsers().then(function (promise) {
                    $scope.loading = false;
                    if (angular.isArray(promise.data)) {
                        promise.data.map(value => {
                            const { us_group } = value.app_metadata
                            value.us_group = us_group.join('<br>')
                        })
                        $scope.data = new wijmo.collections.CollectionView(promise.data);
                    }
                });
            });
        }];

})(angular);