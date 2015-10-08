/// <reference path="../../typescript_components/angularjs/angular.d.ts" />

(() => {
    'use strict';

    var serviceId = "homeService";

    angular
        .module('app.home')
        .factory(serviceId, HomeService);

    HomeService.$inject = ['loggerService', 'dataService', 'constants'];

    function HomeService(loggerService, dataService, constants) {
        return {
            serviceCall: serviceCall,
            getWebTitle: getWebTitle
        };
        function serviceCall() {
            
            return " from " + serviceId;
        }

        function getWebTitle(constants) {
            loggerService.logInfo("getWebTitle called", "Retrieving web title");
            var url = constants.baseUrl + "/_api/web?select = title";

            return dataService.get(url).then(
                function (data) {                    
                    loggerService.logInfo("web title is " + data.d.Title);
                    return data.d.Title;
                },
                function (response) {                    
                    loggerService.logError(response.statusText, loggerService.genericMessage);
                    return "<error>";
                });
            loggerService.logInfo("done data call");
        }

    }
        


})(); 