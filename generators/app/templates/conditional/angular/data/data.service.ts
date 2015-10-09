/// <reference path="../../typescript_components/angularjs/angular.d.ts" />
declare var $;
(() => {
    'use strict'; 

    var serviceId = "dataService";

    angular
        .module('blocks.data')
        .factory(serviceId, Data);

    Data.$inject = ['$http', 'utilsService', 'loggerService'];


    function Data($http, utilsService, loggerService) {
        return {
            get: httpGet,
            post: httpPost,
            delete: httpDelete,
            update : httpMerge,
            getCallCount: function () { return callCount; }
        };


        var callCount = 0;

        function emptyCallback() { }

        function doCall(url: string, headers, body, verb: string) {
            callCount = ++callCount;   //only for performance testing
            
            return $http({
                url: encodeURI(url),   //Make sure to encode the URI
                method: verb,
                data: body,
                headers: headers
            }).then(
                function (response) {   //success
                    return response;
                }
                //don't handle failure here - let it bubble back to caller
                //response object will be passed to caller as well
                );

            
        }

        function httpGet(url: string, headers ) {

            return doCall(url, headers, "", "GET");
        }

        function postInternal(url: string, headers, body, action: string, eTag: string) {
            headers = headers || {};
            headers["X-RequestDigest"] = $("#__REQUESTDIGEST").val();
            headers["Content-Type"] = "application/json;odata=verbose";
            //#region Content Length header (removed)
            /* Per the XMLHttpRequest spec (http://www.w3.org/TR/XMLHttpRequest/#the-setrequestheader-method),
                Content-Length must not be set in code.  Chrome will record an error if you try to.  IE will not.               
            */
            

            //#endregion



            //Verb-tunneling for other verbs which may be blocked by firewalls
            if (utilsService.hasAValue(action)) {
                headers["X-HTTP-Method"] = action;

                //If-Match header, used passed value or default to *
                if (utilsService.hasAValue(eTag)) {
                    headers["IF-MATCH"] = eTag;
                }
                else {
                    headers["IF-MATCH"] = "*";
                }
            }


            //Make the call
            return doCall(url, headers, body, "POST");
        }


        function httpDelete(url: string, headers, eTag: string) {
            return postInternal(url, headers, "", "DELETE", eTag);
        }

        function httpPost(url: string, body, headers) {
            return postInternal(url, headers, body, undefined, undefined);
        }

        function httpMerge(url: string, body, headers, eTag) {
            return postInternal(url, headers, body, "MERGE", eTag);
        }

        
    };


})();   