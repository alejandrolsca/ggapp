module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.productOffsetGeneral.update',[])

    .config(['$stateProvider', '$urlRouterProvider','USER_ROLES',
    function($stateProvider, $urlRouterProvider, USER_ROLES) {
        $stateProvider.state('productOffsetGeneralUpdate', {
            url:'/productOffsetGeneral/update/:cl_id/:pr_id',
            templateUrl : 'modules/product/modules/productOffsetGeneral.update/productOffsetGeneral.update.view.html',
            controller : 'productOffsetGeneralUpdateCtrl',
            data: {
                authorizedRoles: [USER_ROLES.admin,USER_ROLES.editor]
            }    
        });
    }])

    .factory('productOffsetGeneralUpdateFac',require('./productOffsetGeneral.update.fac'))

    .controller('productOffsetGeneralUpdateCtrl',require('./productOffsetGeneral.update.ctrl'))

})(angular);