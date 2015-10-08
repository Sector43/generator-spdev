/// <reference path="../../typescript_components/angularjs/angular.d.ts" />
(function () {
    'use strict';
    var serviceId = "loggerService";
    angular
        .module('blocks.logger')
        .factory(serviceId, Logger);
    Logger.$inject = ['utilsService'];
    function Logger(utilsService) {
        return {
            logInfo: logInfo,
            logWarning: logWarning,
            logError: logError,
            genericMessage: "An error has occurred, please contact your adminstrator"
        };
        function logInfo(logMessage, userMessage) {
            write("info", logMessage, userMessage);
        }
        function logWarning(logMessage, userMessage) {
            write("warn", logMessage, userMessage);
        }
        function logError(logMessage, userMessage) {
            write("error", logMessage, userMessage);
        }
        function write(severity, logMessage, userMessage) {
            console[severity](logMessage);
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
