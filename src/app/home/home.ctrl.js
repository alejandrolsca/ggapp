module.exports = (function (angular) {
    'use strict';

    return ['$scope', 'homeFac', 'authService',
        function ($scope, homeFac, authService) {
            $scope.init = function (s, e) {
                s.getText = function (gauge, part, value, text) {
                    switch (part) {
                        case 'value':
                            if (value <= 10) return 'Empty!';
                            if (value <= 25) return 'Low...';
                            if (value <= 95) return 'Good';
                            return 'Full';
                        case 'min': return 'EMPTY';
                        case 'max': return 'FULL';
                    }
                    return text;
                }
            }

            const getData = () => {
                const fromDate = moment($scope.fromDate.value).format('YYYY-MM-DD')
                const toDate = moment($scope.toDate.value).format('YYYY-MM-DD')
                $scope.loading = true;
                homeFac.getDelivered(fromDate, toDate).then((promise) => {
                    $scope.loading = false;
                    const { data } = promise
                    data.map((value, index, data) => {
                        value.delivered = +value.delivered
                        value.total = +value.total
                    })
                    $scope.data = data

                })
            }
            $scope.gauges = {}
            $scope.getText = function (gauge, part, value, text) {
                switch (part) {
                  case 'value':
                  if (value === 0) return 'Deficiente';
                  if (value <= (gauge.max/3)) return 'Bajo...';
                  if (value <= (gauge.max/3)*2) return 'Bien';
                  if (value < gauge.max) return 'Muy bien!';
                  if (value === gauge.max) return 'Excelente!';
                  case 'min':
                    return `Deficiente`;
                  case 'max':
                    return `Excelente!`;
                }
                return text;
              }

            $scope.$on('$viewContentLoaded', function () {
                // create InputDate control
                $scope.fromDate = new wijmo.input.InputDate('#fromDate', {
                    format: 'yyyy-MM-dd',
                    value: new Date(moment().startOf('month'))
                });

                $scope.fromDate.valueChanged.addHandler(fromDateChanged)

                // create InputDate control
                $scope.toDate = new wijmo.input.InputDate('#toDate', {
                    min: $scope.fromDate.value,
                    format: 'yyyy-MM-dd',
                    value: new Date(moment().endOf('month'))
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