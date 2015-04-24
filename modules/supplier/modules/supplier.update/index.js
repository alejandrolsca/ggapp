module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.supplier.update',[])

    .config(['$stateProvider', '$urlRouterProvider','USER_ROLES',
    function($stateProvider, $urlRouterProvider, USER_ROLES) {
        $stateProvider.state('supplierUpdate', {
            url:'/supplier/update/:su_id',
            templateUrl : 'modules/supplier/modules/supplier.update/supplier.update.view.html',
            controller : 'supplierUpdateCtrl',
            data: {
                authorizedRoles: [USER_ROLES.admin,USER_ROLES.editor]
            }    
        });
    }])

    .factory('supplierUpdateFac',require('./supplier.update.fac'))

    .controller('supplierUpdateCtrl',require('./supplier.update.ctrl'))

})(angular);