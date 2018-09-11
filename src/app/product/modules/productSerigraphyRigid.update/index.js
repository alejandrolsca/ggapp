module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.productSerigraphyRigid.update',[])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('productSerigraphyRigidUpdate', {
            url:'/product/update/serigraphy/rigid/:cl_id/:pr_id',
            template: require('./productSerigraphyRigid.update.view.html'),
            controller : 'productSerigraphyRigidUpdateCtrl',
            data: {
                requiresLogin: true,
                roles: [
                    'admin',
                    'finishing',
                    'packaging',
                    'production',
                    'quality_assurance',
                    'sales',
                    'warehouse'
                ]
            }    
        });
    }])

    .factory('productSerigraphyRigidUpdateFac',require('./productSerigraphyRigid.update.fac'))

    .controller('productSerigraphyRigidUpdateCtrl',require('./productSerigraphyRigid.update.ctrl'))

})(angular);