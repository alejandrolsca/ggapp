module.exports = (function(angular){
    'use strict';
    
    return ['$rootScope', function($rootScope) {
        
        return function (input,param) {
                var translations = {
                    "es-MX" : require('./lang.locale.es-MX'),
                    "en-US" : require('./lang.locale.en-US')
                };
                var currentLanguage = $rootScope.currentLanguage || 'es-MX',
                keys = input.split('.'),
                data = translations[currentLanguage],
                value = undefined;
                try {
                    for(var key in keys) {
                      data = data[keys[key]];
                    }
                    if (!!data) {
                        return (typeof param === "undefined") ? data : data.replace('@@', param);
                    } else {
                        return input;
                    } 
                }
                catch (e) {
                    console.log(e.description);
                    return input;
                }

            }
        }];
})(angular);