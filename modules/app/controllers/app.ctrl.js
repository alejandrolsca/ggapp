'use strict';

module.exports = function ($scope,$rootScope,langFac,logoutFac,i18nFilter,USER_ROLES,$location) {
    
    langFac.getLang().then(function(promise){
        if(promise.data.success) {
            $rootScope.currentLanguage = promise.data.lang;
            $scope.navItems = i18nFilter("GENERAL.NAV");
        }
        console.log(JSON.stringify(promise.data.lang));
    });
    
    for(var item in $scope.navItems) {
        if ($scope.navItems[item].subMenu) {
            $scope.lastSubmenu = item;   
        }
    }
    
    $scope.lang = function (lang) {
        langFac.setLang(lang).then(function(promise){
            if(promise.data.success) {
                $rootScope.currentLanguage = promise.data.lang;
                $scope.navItems = i18nFilter("GENERAL.NAV");
            }
            console.log(JSON.stringify(promise.data.lang));
        });
    }
    $scope.logout = function() {
        logoutFac.logout().then(function(promise){
            if(promise.data.success) {
                $rootScope.user = {
                    user:null,
                    userRole:USER_ROLES.guest,
                    userName:null,
                    userFathersLastName:null,
                    userMothersLastName:null, 
                    userDatabase:null
                }
                $location.path("/auth");
            }
        });
    }
};