module.exports = (function (angular) {
    'use strict';

    return ['$scope', '$rootScope', 'i18nFilter', '$location', 'authService', 'appFac','$state', 'notyf',
        function ($scope, $rootScope, i18nFilter, $location, authService, appFac, $state, notyf) {

            $scope.authService = authService;
            $scope.profile = authService.profile()
            $scope.copyright = i18nFilter("general.copyright");

            $scope.open = function(wo_id) {
                const {wo_jsonb:{cl_id}} = $scope.searchResults.find(wo => wo.wo_id === wo_id)
                const url = $state.href('woView', {
                    cl_id: cl_id,
                    wo_id: wo_id
                })
                window.open(url,'_blank')
            }

            $scope.searchWoID = function (wo_id) {
                return appFac.searchWoID(wo_id).then(function (promise) {
                    if (angular.isArray(promise.data)) {
                        const {data} = promise
                        $scope.searchResults = data
                        return data
                    }
                })
            }

            /*
            langFac.getLang().then(function (promise) {
                if (promise.data.success) {
                    $rootScope.currentLanguage = promise.data.lang;
                    $scope.navItems = i18nFilter("GENERAL.NAV");
                }
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
                });
            }
            */
        }]

})(angular);