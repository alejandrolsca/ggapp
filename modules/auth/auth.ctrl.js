module.exports = (function(angular){
    'use strict';
    
    return function ($rootScope, $scope, authFac, $location, AUTH_EVENTS) {
        $scope.login_databases = [
            {"label":"Grupo Grafico","value":"ggapp"},
            {"label":"Print Source","value":"printsource"}
        ];

        $scope.user = {
            us_database: $scope.login_databases[0] // Grupo Grafico
        };

        $scope.onSubmit = function(user) {
            authFac.login({
                us_database: user.us_database.value,
                us_user: user.us_user,
                us_password: user.us_password
            }).then(function(promise){
                if(promise.data.success) {
                    $rootScope.user = promise.data;
                    $location.path("/home");
                }
                console.log(JSON.stringify($rootScope.user));
            });
        }
        $scope.$on(AUTH_EVENTS.notAuthenticated, function () {
            $scope.notAuthenticated = true;
        });
        $scope.$on(AUTH_EVENTS.notAuthorized, function () {
            $scope.notAuthorized = true;
        });
        $scope.$on('$viewContentLoaded', function () {
            // this code is executed after the view is loaded
         });

        $scope.us_passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,16}$/;
    };
    
})(angular);