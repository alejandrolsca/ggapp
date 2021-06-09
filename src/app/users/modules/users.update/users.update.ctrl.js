module.exports = (function (angular) {
    'use strict';

    return ['$scope', 'usersUpdateFac', '$location', 'i18nFilter', 'notyf', 'roles',
        function ($scope, usersUpdateFac, $location, i18nFilter, notyf, roles) {

            $scope.onSubmit = function () {
                const { app_metadata } = $scope.fmData
                const data = {
                    app_metadata
                }
                usersUpdateFac.update(data).then(function (promise) {
                    if (typeof promise.data === 'object') {
                        notyf.open({
                            type: 'success',
                            message: `Usuario actualizado`
                        });
                        $location.path('/users');
                    } else {
                        notyf.error(`Ocurrio un error al intentar actualizar el usuario.`)
                    }
                });
            };

            $scope.us_groupoptions = roles;

            $scope.$on('$viewContentLoaded', function () {
                // this code is executed after the view is loaded
                $scope.loading = true;
                usersUpdateFac.getUser().then(function (promise) {
                    $scope.loading = false;
                    if (typeof promise.data === 'object') {
                        $scope.fmData = promise.data;
                    }
                });
            });
        }];

})(angular);