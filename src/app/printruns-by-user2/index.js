module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.printrunsByUser2',[
    ])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('printrunsByUser2', {
            url:'/printrunsbyuser2',
            template: require('./printruns-by-user2.view.html'),
            controller : 'printrunsByUser2Ctrl',
            data: {
                requiresLogin: true,
                roles: [
                    'owner',
                    'admin_support'
                ]
            }    
        });
    }])

    .factory('printrunsByUser2Fac',require('./printruns-by-user2.fac'))

    .controller('printrunsByUser2Ctrl',require('./printruns-by-user2.ctrl'))
    
})(angular);
