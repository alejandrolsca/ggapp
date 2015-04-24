module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.productOffsetGeneral.add',[])

    .config(['$stateProvider', '$urlRouterProvider','USER_ROLES',
    function($stateProvider, $urlRouterProvider, USER_ROLES) {
        $stateProvider.state('productOffsetGeneralAdd', {
            url:'/product/add/offset/general/:cl_id',
            templateUrl : 'modules/product/modules/productOffsetGeneral.add/productOffsetGeneral.add.view.html',
            controller : 'productOffsetGeneralAddCtrl',
            data: {
                authorizedRoles: [USER_ROLES.admin,USER_ROLES.editor]
            }    
        });
    }])

    .factory('productOffsetGeneralAddFac',require('./productOffsetGeneral.add.fac'))

    .controller('productOffsetGeneralAddCtrl',require('./productOffsetGeneral.add.ctrl'))

})(angular);