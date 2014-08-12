'use strict';

module.exports = function($http, $stateParams){
        var factory = {};
        factory.add = function(us_jsonb) {
            var promise = $http.post('modules/user/modules/user.add/models/user.add.model.php', {
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
    };