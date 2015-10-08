/// <reference path="../../typescript_components/angularjs/angular.d.ts" />
(function () {
    'use strict';
    var serviceId = "dataService";
    angular
        .module('blocks.data')
        .factory(serviceId, [
        '$http',
        'utilsService',
        Data
    ]);
    function Data($http, utilsService) {
        return {
            get: httpGet,
            post: httpPost,
            delete: httpDelete,
            update: httpMerge,
            getCallCount: function () { return callCount; }
        };
        var callCount = 0;
        function emptyCallback() { }
        function doCall(url, success, failure, headers, body, verb) {
            callCount = ++callCount; //only for performance testing
            if ("function" !== typeof success) {
                success = emptyCallback;
            }
            if ("function" !== typeof failure) {
                failure = emptyCallback;
            }
            $http({
                url: encodeURI(url),
                method: verb,
                data: body,
                headers: headers
            }).then(function (response) {
                success(response.data);
            }, function (response) {
                failure(response);
            });
        }
        function httpGet(url, success, failure, headers) {
            doCall(url, success, failure, headers, "", "GET");
        }
        function postPromiseInternal(url, success, failure, headers, body, action, eTag) {
            headers["X-RequestDigest"] = $("#__REQUESTDIGEST").val();
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
            doCall(url, success, failure, headers, body, "POST");
        }
        function httpDelete(url, success, failure, headers, eTag) {
            postPromiseInternal(url, success, failure, headers, "", "DELETE", eTag);
        }
        function httpPost(url, success, failure, headers, body) {
            postPromiseInternal(url, success, failure, headers, body, undefined, undefined);
        }
        function httpMerge(url, success, failure, headers, eTag) {
            postPromiseInternal(url, success, failure, headers, "", "MERGE", eTag);
        }
    }
    ;
})();
