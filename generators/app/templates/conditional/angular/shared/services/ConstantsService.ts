
declare var _spPageContextInfo: any;

(() => {
    'use strict';

   
    angular
        .module('app')
        .constant("constants", {
            version: "2015.8.5-1",
            baseUrl: _spPageContextInfo.webAbsoluteUrl,
            author: 'David Mann'
        });
})(); 