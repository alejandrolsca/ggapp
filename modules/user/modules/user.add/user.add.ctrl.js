module.exports = (function (angular) {
    'use strict';

    return ['$scope', 'userAddFac', '$location',
        function ($scope, userAddFac, $location) {

            $scope.onSubmit = function () {

                userAddFac.add($scope.fmData).then(function (promise) {
                    if (promise.data == "1") {
                        $location.path('/user');
                    } else {
                        $scope.updateFail = true;
                    }
                    //console.log(JSON.stringify(promise.data));
                });
                //console.log('form submitted:', $scope.formData);
            };

            $scope.$on('$viewContentLoaded', function () {
                // this code is executed after the view is loaded
            });
        }];

})(angular);