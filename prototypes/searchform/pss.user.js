// ==UserScript==
// @name         Pss Bar
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  PSS Bar
// @author       Kevin Echols
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js
// @require      https://raw.githubusercontent.com/kechols/LN/master/prototypes/searchform/pss.js?vke1
// @resource     psscss https://raw.githubusercontent.com/kechols/LN/master/prototypes/searchform/pss.css?vkte1
// @match        http://localhost:61700/search/*
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// ==/UserScript==

(function() {
    'use strict';

    var checksilent = true;

    // waitForKeyElements(".content-switcher-list", switchHLCT, true);
    // waitForKeyElements(".ct-landing-wrapper", runMain, true);

    function runMain() {
        alert("here");

        var pssCSS = GM_getResourceText ("psscss");

        GM_addStyle (pssCSS);
        GM_addStyle (selectyCSS);
        GM_addStyle (jurisCSS);
        GM_addStyle (faCSS);

    }

})();
