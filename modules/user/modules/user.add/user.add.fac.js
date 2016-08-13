module.exports = (function(angular){
    'use strict';
    
    return ['$http', '$q', '$alerts', '$stateParams',
    function($http, $q, $alerts, $stateParams){
        var factory = {};
        factory.add = function(us_jsonb) {
            var promise = $http.post('modules/user/modules/user.add/user.add.model.php', {
                    /* POST variables here */
                    us_jsonb: us_jsonb
            }).success(function(data, status, headers, config){
                return data;
            }).error(function (data, status, headers, config) {
                return {"status": false};
            });
            return promise;
        };
        return factory;
    }];
    
})(angular);