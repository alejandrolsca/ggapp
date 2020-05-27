module.exports = (function (angular) {
    'use strict';

    return ['$sce', function($sce) {
        return function(htmlCode){
            console.log(typeof htmlCode)
            return $sce.trustAsHtml(htmlCode);
        }
    }];
})(angular);