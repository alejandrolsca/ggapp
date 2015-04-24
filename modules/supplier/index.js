module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.supplier',[
        require('./modules/supplier.add').name,
        require('./modules/supplier.update').name
    ])

    .config(['$stateProvider', '$urlRouterProvider','USER_ROLES',
    function($stateProvider, $urlRouterProvider, USER_ROLES) {
        $stateProvider.state('supplier', {
            url:'/supplier',
            templateUrl : 'modules/supplier/supplier.view.html',
            controller : 'supplierCtrl',
            data: {
                authorizedRoles: [USER_ROLES.admin,USER_ROLES.editor]
            }    
        });
    }])

    .factory('supplierFac',require('./supplier.fac'))

    .controller('supplierCtrl',require('./supplier.ctrl'))
    
})(angular);
