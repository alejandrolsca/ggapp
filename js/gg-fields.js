(function(angular){
    
    angular.module('gg-fields',[])
    
    .constant('validTypes',{
            "singleSpaces": /^([-,a-zA-Z0-9ÁáÉéÍíÓóÚú\.](.[-,a-zA-Z0-9ÁáÉéÍíÓóÚú\.])*)*$/,
            "rfc": /^[A-Za-z]{3,4}\-\d{6}(?:\-[A-Za-z\d]{3})?$/,
            "email": /^[a-z0-9!#$%&'*+/=?^_`{|}~.-]+@[a-z0-9-]+(\.[a-z0-9-]+)*$/i,
            "decimal2": /^(\d+)?(\.\d{2,2})?$/,
            "discount": /^(0)?(\.\d{2,2})?$/,
            "integer": /^\d$/,
            "zipcode": /^\d{5,5}$/,
            "date": /^\d{4}-\d{2}-\d{2}$/,
            "user": /^\w{4,16}$/,
            "password": /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,16}$/,
            "phone": /^([-+\(\)0-9](.[-+\(\)0-9])*)*$/
    })
    
    .directive('ggInput',function(validTypes){
        return {
                restrict: "E",
                require: '^ngModel',
                scope: {
                    errClass: '@',
                    lbl: '@',
                    lblClass: '@',
                    fldClass: '@',
                    reqMsg: '@',
                    regexpMsg: '@',
                    ngModel: '='
                },
                template: function(elem, attrs) {
                    var disabled    = attrs.hasOwnProperty('disabled')  ? 'ng-disabled="true"'  : ''; //disable field
                    var required    = attrs.hasOwnProperty('required')  ? 'ng-required="true"'  : ''; //requires field
                    
                    return '<div class="form-group">\
                                <label class="{{lblClass}} control-label">{{lbl}}</label>\
                                <div class="{{fldClass}}">\
                                    <input class="form-control" type="text" ng-model="ngModel" '+disabled+' '+required+'/>\
                                    <p ng-class="errClass" ng-show="required">{{reqMsg}}</p>\
                                    <p ng-class="errClass" ng-show="invalid">{{regexpMsg}}</p>\
                                </div>\
                          </div>';
                },
                link: function(scope, elem, attrs, ctrl){
                            
                    //format text going to user (model to view)
                    ctrl.$formatters.unshift(function (modelValue){ 
                        
                        if(angular.isDefined(modelValue) || !ctrl.$pristine) ctrl.$setViewValue(modelValue);
                                                    
                    }); // triggers on DOM change
        
                    //format text from the user (view to model)
                    ctrl.$parsers.unshift(function (viewValue){
                        
                        var required = (!angular.isDefined(viewValue) && attrs.hasOwnProperty('required'));
                        var invalid = (angular.isDefined(viewValue) && !validTypes[attrs.regexp].test(viewValue));
                        
                        elem.toggleClass('has-error', (required || invalid));
                        elem.toggleClass('has-success', !(required || invalid));
                        
                        scope.required = required;
                        scope.invalid = invalid;
                        
                        ctrl.$setValidity('valid', ((required || invalid) ? false : true))
                        
                        return viewValue;
                    }); // triggers on code change
                }
        };
    })
    
    .directive('ggSelect',function(validTypes){
        return {
                restrict: "E",
                require: '^ngModel',
                scope: {
                        errClass: '@',
                        lbl: '@',
                        lblClass: '@',
                        fldClass: '@',
                        reqMsg: '@',
                        regexpMsg: '@',
                        options: '=',
                        ngModel: '='
                    },
                    template: function(elem, attrs) {
                        var disabled    = attrs.hasOwnProperty('disabled')  ? 'ng-disabled="true"'  : ''; //disable field
                        var required    = attrs.hasOwnProperty('required')  ? 'ng-required="true"'  : ''; //requires field
                        var multiple    = attrs.hasOwnProperty('multiple')  ? 'multiple'            : ''; //requires field
                        
                        return '<div class="form-group">\
                                    <label class="{{lblClass}} control-label">{{lbl}}</label>\
                                    <div class="{{fldClass}}">\
                                        <select class="form-control" ng-model="ngModel" ng-options="item.value as item.label for item in options" '+multiple+' '+disabled+' '+required+'>\
                                        </select>\
                                    <p ng-class="errClass" ng-show="required">{{reqMsg}}</p> \
                                    <p ng-class="errClass" ng-show="invalid">{{regexpMsg}}</p>\
                                    </div>\
                              </div>';
                    },
                    link: function(scope, elem, attrs, ctrl){
                        //format text going to user (model to view)
                        ctrl.$formatters.unshift(function (modelValue){

                            if(angular.isDefined(modelValue) || !ctrl.$pristine) ctrl.$setViewValue(modelValue);

                        }); // triggers on DOM change

                        //format text from the user (view to model)
                        ctrl.$parsers.unshift(function (viewValue){

                            var required = (!angular.isDefined(viewValue) && attrs.hasOwnProperty('required'));
                            var invalid = (angular.isDefined(viewValue) && !validTypes[attrs.regexp].test(viewValue));
                            
                            elem.toggleClass('has-error', (required || invalid));
                            elem.toggleClass('has-success', !(required || invalid));

                            scope.required = required;
                            scope.invalid = invalid;

                            ctrl.$setValidity('valid', ((required || invalid) ? false : true))

                            return viewValue;
                        }); // triggers on code change
                    }
            };
        })
    
        .directive('ggCountries',function(validTypes){
        return {
                restrict: "E",
                require: '^ngModel',
                scope: {
                        errClass: '@',
                        lbl: '@',
                        lblClass: '@',
                        fldClass: '@',
                        reqMsg: '@',
                        regexpMsg: '@',
                        options: '=',
                        ngChange: '&',
                        ngModel: '='
                    },
                    template: function(elem, attrs) {
                        var disabled    = attrs.hasOwnProperty('disabled')  ? 'ng-disabled="true"'  : ''; //disable field
                        var required    = attrs.hasOwnProperty('required')  ? 'ng-required="true"'  : ''; //requires field
                        var multiple    = attrs.hasOwnProperty('multiple')  ? 'multiple'            : ''; //requires field
                        
                        return '<div class="form-group">\
                                    <label class="{{lblClass}} control-label">{{lbl}}</label>\
                                    <div class="{{fldClass}}">\
                                        <select class="form-control" ng-model="ngModel" ng-change="ngChange()" ng-options="item.geonameId as item.countryName for item in options" '+multiple+' '+disabled+' '+required+'>\
                                        </select>\
                                    <p ng-class="errClass" ng-show="required">{{reqMsg}}</p> \
                                    <p ng-class="errClass" ng-show="invalid">{{regexpMsg}}</p>\
                                    </div>\
                              </div>';
                    },
                    link: function(scope, elem, attrs, ctrl){
                        //format text going to user (model to view)
                        ctrl.$formatters.unshift(function (modelValue){

                            if(angular.isDefined(modelValue) || !ctrl.$pristine) ctrl.$setViewValue(modelValue);

                        }); // triggers on DOM change

                        //format text from the user (view to model)
                        ctrl.$parsers.unshift(function (viewValue){

                            var required = (!angular.isDefined(viewValue) && attrs.hasOwnProperty('required'));
                            var invalid = (angular.isDefined(viewValue) && !validTypes[attrs.regexp].test(viewValue));
                            
                            elem.toggleClass('has-error', (required || invalid));
                            elem.toggleClass('has-success', !(required || invalid));

                            scope.required = required;
                            scope.invalid = invalid;

                            ctrl.$setValidity('valid', ((required || invalid) ? false : true))
                            
                            return viewValue;
                        }); // triggers on code change
                    }
            };
        })
    
        .directive('ggStates',function(validTypes){
        return {
                restrict: "E",
                require: '^ngModel',
                scope: {
                        errClass: '@',
                        lbl: '@',
                        lblClass: '@',
                        fldClass: '@',
                        reqMsg: '@',
                        regexpMsg: '@',
                        options: '=',
                        ngChange: '&',
                        ngModel: '='
                    },
                    template: function(elem, attrs) {
                        var disabled    = attrs.hasOwnProperty('disabled')  ? 'ng-disabled="true"'  : ''; //disable field
                        var required    = attrs.hasOwnProperty('required')  ? 'ng-required="true"'  : ''; //requires field
                        var multiple    = attrs.hasOwnProperty('multiple')  ? 'multiple'            : ''; //requires field
                        
                        return '<div class="form-group">\
                                    <label class="{{lblClass}} control-label">{{lbl}}</label>\
                                    <div class="{{fldClass}}">\
                                        <select class="form-control" ng-model="ngModel" ng-change="ngChange()" ng-options="item.geonameId as item.toponymName for item in options" '+multiple+' '+disabled+' '+required+'>\
                                        </select>\
                                    <p ng-class="errClass" ng-show="required">{{reqMsg}}</p> \
                                    <p ng-class="errClass" ng-show="invalid">{{regexpMsg}}</p>\
                                    </div>\
                              </div>';
                    },
                    link: function(scope, elem, attrs, ctrl, ggStatesCtrl){
                                           
                        //format text going to user (model to view)
                        ctrl.$formatters.unshift(function (modelValue){

                            if(angular.isDefined(modelValue) || !ctrl.$pristine) ctrl.$setViewValue(modelValue);

                        }); // triggers on DOM change

                        //format text from the user (view to model)
                        ctrl.$parsers.unshift(function (viewValue){

                            var required = (!angular.isDefined(viewValue) && attrs.hasOwnProperty('required'));
                            var invalid = (angular.isDefined(viewValue) && !validTypes[attrs.regexp].test(viewValue));
                            
                            elem.toggleClass('has-error', (required || invalid));
                            elem.toggleClass('has-success', !(required || invalid));

                            scope.required = required;
                            scope.invalid = invalid;

                            ctrl.$setValidity('valid', ((required || invalid) ? false : true))
                            
                            
                            return viewValue;
                        }); // triggers on code change
                    }
            };
        })
    
        .directive('ggCityCounty',function(validTypes){
        return {
                restrict: "E",
                require: '^ngModel',
                scope: {
                        errClass: '@',
                        lbl: '@',
                        lblClass: '@',
                        fldClass: '@',
                        reqMsg: '@',
                        regexpMsg: '@',
                        options: '=',
                        ngChange: '&',
                        ngModel: '='
                    },
                    template: function(elem, attrs) {
                        var disabled    = attrs.hasOwnProperty('disabled')  ? 'ng-disabled="true"'  : ''; //disable field
                        var required    = attrs.hasOwnProperty('required')  ? 'ng-required="true"'  : ''; //requires field
                        var multiple    = attrs.hasOwnProperty('multiple')  ? 'multiple'            : ''; //requires field
                        
                        return '<div class="form-group">\
                                    <label class="{{lblClass}} control-label">{{lbl}}</label>\
                                    <div class="{{fldClass}}">\
                                        <select class="form-control" ng-model="ngModel" ng-change="ngChange()" ng-options="item.geonameId as item.toponymName for item in options" '+multiple+' '+disabled+' '+required+'>\
                                        </select>\
                                    <p ng-class="errClass" ng-show="required">{{reqMsg}}</p> \
                                    <p ng-class="errClass" ng-show="invalid">{{regexpMsg}}</p>\
                                    </div>\
                              </div>';
                    },
                    link: function(scope, elem, attrs, ctrl, ggStatesCtrl){
                                           
                        //format text going to user (model to view)
                        ctrl.$formatters.unshift(function (modelValue){

                            if(angular.isDefined(modelValue) || !ctrl.$pristine) ctrl.$setViewValue(modelValue);

                        }); // triggers on DOM change

                        //format text from the user (view to model)
                        ctrl.$parsers.unshift(function (viewValue){

                            var required = (!angular.isDefined(viewValue) && attrs.hasOwnProperty('required'));
                            var invalid = (angular.isDefined(viewValue) && !validTypes[attrs.regexp].test(viewValue));
                            
                            elem.toggleClass('has-error', (required || invalid));
                            elem.toggleClass('has-success', !(required || invalid));

                            scope.required = required;
                            scope.invalid = invalid;

                            ctrl.$setValidity('valid', ((required || invalid) ? false : true))
                            
                            
                            return viewValue;
                        }); // triggers on code change
                    }
            };
        })
    
        .directive('ggTextarea',function(validTypes){
        return {
                restrict: "E",
                require: '^ngModel',
                scope: {
                        errClass: '@',
                        fldClass: '@',
                        lbl: '@',
                        lblClass: '@',
                        ngModel: '=',
                        options: '=',
                        reqMsg: '@',
                        regexpMsg: '@',
                        rows: '@'
                    },
                    template: function(elem, attrs) {
                        var disabled    = attrs.hasOwnProperty('disabled')  ? 'ng-disabled="true"'  : ''; //disable field
                        var required    = attrs.hasOwnProperty('required')  ? 'ng-required="true"'  : ''; //requires field
                        
                        return '<div class="form-group">\
                                    <label class="{{lblClass}} control-label">{{lbl}}</label>\
                                    <div class="{{fldClass}}">\
                                        <textarea class="form-control" ng-model="ngModel" rows="{{rows}}" '+disabled+' '+required+'>\
                                        </textarea>\
                                    <p ng-class="errClass" ng-show="required">{{reqMsg}}</p> \
                                    <p ng-class="errClass" ng-show="invalid">{{regexpMsg}}</p>\
                                    </div>\
                              </div>';
                    },
                    link: function(scope, elem, attrs, ctrl){
                        //format text going to user (model to view)
                        ctrl.$formatters.unshift(function (modelValue){

                            if(angular.isDefined(modelValue) || !ctrl.$pristine) ctrl.$setViewValue(modelValue);

                        }); // triggers on DOM change

                        //format text from the user (view to model)
                        ctrl.$parsers.unshift(function (viewValue){

                            var required = (!angular.isDefined(viewValue) && attrs.hasOwnProperty('required'));
                            var invalid = (angular.isDefined(viewValue) && !validTypes[attrs.regexp].test(viewValue));
                            
                            elem.toggleClass('has-error', (required || invalid));
                            elem.toggleClass('has-success', !(required || invalid));

                            scope.required = required;
                            scope.invalid = invalid;

                            ctrl.$setValidity('valid', ((required || invalid) ? false : true))

                            return viewValue;
                        }); // triggers on code change
                    }
            };
        })
        
        .directive('ggCheckbox',function(validTypes){
        return {
                restrict: "E",
                require: '^ngModel',
                scope: {
                        fldClass: '@',
                        lbl: '@',
                        lblClass: '@',
                        ngModel: '='
                    },
                    template: function(elem, attrs) {
                        var disabled    = attrs.hasOwnProperty('disabled')  ? 'ng-disabled="true"'  : ''; //disable field
                        
                        return '<div class="form-group">\
                                    <div class="{{lblClass}} {{fldClass}}">\
                                        <div class="checkbox" '+disabled+'>\
                                            <label>\
                                            <input type="checkbox" ng-model="ngModel" '+disabled+'> {{lbl}}\
                                            </label>\
                                        </div>\
                                    </div>\
                              </div>';
                    }
            };
        })
    
        .directive('ggRadio',function(validTypes){
        return {
                restrict: "E",
                require: '^ngModel',
                scope: {
                        fldClass: '@',
                        lbl: '@',
                        lblClass: '@',
                        ngModel: '=',
                        val: '@'
                    },
                    template: function(elem, attrs) {
                        var disabled    = attrs.hasOwnProperty('disabled')  ? 'ng-disabled="true"'  : ''; //disable field
                        
                        return '<div class="form-group">\
                                    <div class="{{lblClass}} {{fldClass}}">\
                                        <div class="radio" '+disabled+'>\
                                            <label>\
                                            <input type="radio" ng-model="ngModel" value="{{val}}" '+disabled+'> {{lbl}}\
                                            </label>\
                                        </div>\
                                    </div>\
                              </div>';
                    }
            };
        })
    
        .directive('ggSubmit',function(validTypes){
        return {
                restrict: "E",
                require: '^ngModel',
                scope: {
                        fldClass: '@',
                        lbl: '@',
                        lblClass: '@',
                        ngDisabled: '='
                    },
                    template: function(elem, attrs) {
                        
                        return '<div class="form-group">\
                                    <div class="{{lblClass}} {{fldClass}}">\
                                            <button type="submit" class="btn btn-default" ng-disabled="ngDisabled">{{lbl}}</button>\
                                    </div>\
                              </div>';
                    }
            };
        })

})(angular);