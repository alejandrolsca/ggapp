module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.product',[
        require('./modules/productOffsetGeneral.add').name,
        require('./modules/productOffsetGeneral.update').name
    ])

    .config(['$stateProvider', '$urlRouterProvider','USER_ROLES',
    function($stateProvider, $urlRouterProvider, USER_ROLES) {
        $stateProvider.state('product', {
            url:'/product/:cl_id',
            templateUrl : 'modules/product/product.view.html',
            controller : 'productCtrl',
            data: {
                authorizedRoles: [USER_ROLES.admin,USER_ROLES.editor]
            }    
        });
    }])

    .factory('productFac',require('./product.fac'))

    .controller('productCtrl',require('./product.ctrl'))
    
})(angular);
