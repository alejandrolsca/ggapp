module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.productOffsetCounterfoil.add',[])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('productOffsetCounterfoilAdd', {
            url:'/product/add/offset/counterfoil/:cl_id',
            template: require('./productOffsetCounterfoil.add.view.html'),
            controller : 'productOffsetCounterfoilAddCtrl',
            data: {
                requiresLogin: true,
                roles: [
                    'admin',
                    'sales'
                ]
            }    
        });
    }])

    .factory('productOffsetCounterfoilAddFac',require('./productOffsetCounterfoil.add.fac'))

    .controller('productOffsetCounterfoilAddCtrl',require('./productOffsetCounterfoil.add.ctrl'))

})(angular);