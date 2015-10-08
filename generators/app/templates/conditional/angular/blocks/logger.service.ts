/// <reference path="../../typescript_components/angularjs/angular.d.ts" />

declare var SP: any;
declare var ExecuteOrDelayUntilScriptLoaded: any;

(() => {
    'use strict';

    var serviceId = "loggerService";

    angular
        .module('blocks.logger')
        .factory(serviceId,
        [
            'utilsService',
            Logger
        ]);


        function Logger (utilsService) {
            return {
                log: logInfo,
                genericMessage: genericErrorMessage
            };


            var genericErrorMessage = "An error has occurred, please contact your adminstrator";


            function logInfo(logMessage, userMessage) {
                console.log(logMessage)
                if (utilsService.hasAValue(userMessage)
                    && SP) {
                    ExecuteOrDelayUntilScriptLoaded(function () {
                        if (SP.UI 
                            && SP.UI.Notify) {
                                SP.UI.Notify.addNotification(userMessage, false);
                        }
                    }, "core.js");
                }

                
                
            }

            
        }


})();  