module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.cardinalArt',[
    ])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('cardinalArt', {
            url:'/cardinalArt',
            template: require('./cardinal-art.view.html'),
            controller : 'cardinalArtCtrl',
            data: {
                requiresLogin: true,
                roles: [
                    'admin',
                    'owner',
                    'cardinal'
                ]
            }    
        });
    }])

    .factory('cardinalArtFac',require('./cardinal-art.fac'))

    .controller('cardinalArtCtrl',require('./cardinal-art.ctrl'))
    
})(angular);
