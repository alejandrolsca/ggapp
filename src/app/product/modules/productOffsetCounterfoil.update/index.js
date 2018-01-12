module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.productOffsetCounterfoil.update',[])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('productOffsetCounterfoilUpdate', {
            url:'/product/update/offset/counterfoil/:cl_id/:pr_id',
            template: require('./productOffsetCounterfoil.update.view.html'),
            controller : 'productOffsetCounterfoilUpdateCtrl',
            data: {
                requiresLogin: true
            }    
        });
    }])

    .factory('productOffsetCounterfoilUpdateFac',require('./productOffsetCounterfoil.update.fac'))

    .controller('productOffsetCounterfoilUpdateCtrl',require('./productOffsetCounterfoil.update.ctrl'))

})(angular);