module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.productSerigraphyRigid.add',[])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('productSerigraphyRigidAdd', {
            url:'/product/add/serigraphy/rigid/:cl_id',
            template: require('./productSerigraphyRigid.add.view.html'),
            controller : 'productSerigraphyRigidAddCtrl',
            data: {
                requiresLogin: true,
                roles: [
                    'admin',
                    'sales'
                ]
            }    
        });
    }])

    .factory('productSerigraphyRigidAddFac',require('./productSerigraphyRigid.add.fac'))

    .controller('productSerigraphyRigidAddCtrl',require('./productSerigraphyRigid.add.ctrl'))

})(angular);