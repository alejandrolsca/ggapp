module.exports = (function (angular) {
    'use strict';

    angular

    return ['$scope', '$rootScope', 'langFac', 'i18nFilter', '$location', 'auth', 'store',
        function ($scope, $rootScope, langFac, i18nFilter, $location, auth, store) {

            $scope.logout = function () {
                auth.signout();
                store.remove('profile');
                store.remove('token');
                $location.path("/login");
            }

            langFac.getLang().then(function (promise) {
                if (promise.data.success) {
                    $rootScope.currentLanguage = promise.data.lang;
                    $scope.navItems = i18nFilter("GENERAL.NAV");
                }
                console.log(JSON.stringify(promise.data.lang));
            });

            for (var item in $scope.navItems) {
                if ($scope.navItems[item].subMenu) {
                    $scope.lastSubmenu = item;
                }
            }
            $scope.lang = function (lang) {
                langFac.setLang(lang).then(function (promise) {
                    if (promise.data.success) {
                        $rootScope.currentLanguage = promise.data.lang;
                        $scope.navItems = i18nFilter("GENERAL.NAV");
                    }
                    console.log(JSON.stringify(promise.data.lang));
                });
            }
        }]

})(angular);