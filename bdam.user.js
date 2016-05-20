// ==UserScript==
// @name         Better Dynamo Administration Manager
// @namespace    BetterDynAdmin
// @include      */dyn/admin/*
// @version      0.1
// @homepageURL  https://github.com/onewingedfallen59/BetterDynAdminManager
// @supportURL   https://github.com/onewingedfallen59/BetterDynAdminManager/issues
// @description  Requires Jean-Charles Manoury Better Dyn Admin. Allow you to access easily any Dyn/Admin instance of an environment in a single tab :)
// @author       Benjamin DESCAMPS
// @updateUrl https://raw.githubusercontent.com/onewingedfallen59/bdam/master/bdam.js
// @downloadUrl https://raw.githubusercontent.com/onewingedfallen59/bdam/master/bdam.js

// @grant GM_addStyle
// @grant GM_getValue
// @grant GM_setValue
// @require https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.3/jquery.min.js
// ==/UserScript==

function loadCSS() {
    if(window.self === window.top) {
        GM_addStyle(".tab-content{display:none}#tab-1{display:block}iframe{position:absolute; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%; border:none; margin:0; padding:0; overflow:hidden; z-index:999999;}");
    } else {
        GM_addStyle("#bdaManager{background-color: #007bb8;}#bdaManager a {color:white;}.instance{float: left;border: 1px solid #dcdcdc;font-size: medium;margin-right: inherit;}");
    }
}

(function() {
    'use strict';
    var start = Date.now();

    //Check if dyn/admin is loaded and if the current document is the root document (opposed to an iframe document)
    if(document.getElementById("oracleATGbrand") !== null && window.self === window.top) {
        loadCSS();
        //remove body content, create iframe host. May be optimized by create the first iframe manually and detach/attach body content to iframe
        jQuery('body').empty()
            .append('<div id="tabs-container"><div id="tab-1" class="tab-content"></div></div>');

        //initialize the first iframe, corresponding to the url request. May be useless since we're loading every instances. Think about delete / switchable / set url requested the first tab or select the tab corresponding to url
        jQuery('#tab-1').append('<iframe src="' + window.location.href + '"></iframe>');

        //loading the stored data (instances urls) or empty list
        var localInstances = GM_getValue("test") || [];
        for(var i = 0; i < localInstances.length; i++) {
            var tabIndex = i+2;
            jQuery('#tabs-container').append('<div id="tab-' + tabIndex + '" class="tab-content"></div>');
            jQuery('#tab-' + tabIndex).append('<iframe src="' + localInstances[i] + '"></iframe>');
        }

        //For CORS purpose.
        window.addEventListener("message", function(event){
            var tab = event.data;
            if("reload" === tab) {
                window.location.reload();
            } else {
                $(".tab-content").not(tab).css("display", "none");
                $(tab).fadeIn();
            }
        }, false);
    }
    else {
        loadCSS();

        //allow quick access to switch instances buttons. Check if can be optimized
        jQuery(document).keypress(function(event){
            if(event.shiftKey && event.keyCode >= 48 && event.keyCode <= 57){
                //simulate click on instance button. May be optimized by using non anonymous function & call it directly.
                jQuery('.instance a[href=\\#tab-' + (event.keyCode - 48) + ']').click();
            }
        });

        //Create the "instances" layer on the top bar of iframe
        jQuery('#menuBar').append('<div id="bdaManager" class="menu"><p>Instances</p><div class="instance"><a href="#tab-1">1</a></div></div>');

        //loading the stored data (instances urls) or empty list
        var localInstances = GM_getValue("test") || [];
        for(var i = 0; i < localInstances.length; i++) {
            var tabIndex = i+2;
            jQuery('#bdaManager').append('<div class="instance"><a href="#tab-' + tabIndex + '">' + tabIndex + '</a></div>');
        }

        //add the last instance button which allows to add a new instance. May be optimized by chaining the previous call.
        jQuery('#bdaManager').append('<div class="instance"><a href="#tab-+">+</a></div>');
    }

    //may be optmized does it need to be set on every document ?
    $(document).ready(function() {
        $("#bdaManager a").click(function(event) {
            event.preventDefault();

            //FIXME the behaviour is erratic between keypress and click actions. Not used currently.
            $(this).parent().addClass("current");
            $(this).parent().siblings().removeClass("current");

            //fetch which tab is selected
            var tab = $(this).attr("href");
            //special case : add new instance
            if(tab === "#tab-+")
            {
                var url = prompt("enter url :").trim();
                if(url.length !== 0) {
                    var localInstances = GM_getValue("test") || [];

                    //if no instance yet or the url requested instance does not exist yet, quick add it
                    if (localInstances.length === 0 || localInstances.indexOf(window.location.href) === -1) {
                        localInstances.push(window.location.href);
                    }

                    //add the given url
                    localInstances.push(url);

                    //store new value
                    GM_setValue("test", localInstances);

                    //dispatch event to root document
                    window.parent.postMessage("reload", "*");

                }
            }
            //main case : select an instance iframe
            else
            {
                //dispatch event to root document
                window.parent.postMessage(tab, "*");
            }
        });
    });

    // Monitor execution time
    var time = Date.now() - start;
    console.log("BDAM takes : " + time + "ms");
})();