/// <reference path="../../typescript_components/angularjs/angular.d.ts" />
 
(() => {
    'use strict';

    var serviceId = "utilsService";

    angular
        .module('blocks.utils')
        .factory(serviceId, Utils);


        function Utils() {
            return {
                hasAValue: hasAValue,
                createGuid : createGuid
            };





            function hasAValue(obj) {
                return obj !== null && angular.isDefined(obj) && obj !== "";
            }

            function createGuid() {
                return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                    var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
                    return v.toString(16);
                });
            };
        };


})();  