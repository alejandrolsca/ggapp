'use strict';

module.exports = function($http){
    var factory = {};
    factory.login = function(user) {
        var promise = $http.post('modules/auth/models/auth.login.model.php', {
            /* POST variables here */
            us_database: user.us_database,
            us_user: user.us_user,
            us_password: user.us_password
        }).success(function(data, status, headers, config){
            return data;
        }).error(function (data, status, headers, config) {
            return {"status": false};
        });
        return promise;
    }
    factory.logout = function(user) {
        var promise = $http.post('modules/auth/models/authLogoutModel.php', {
                /* POST variables here */
                us_database: user.us_database,
                us_user: user.us_user,
                us_password: user.us_password
        }).success(function(data, status, headers, config){
            return data;
        }).error(function (data, status, headers, config) {
            return {"status": false};
        });
        return promise;
    };
    return factory;
};