 ==UserScript==
 @name         Better Dynamo Administration Manager
 @namespace    BetterDynAdmin
 @include      dynadmin
 @version      0.1
 @homepageURL  httpsgithub.comonewingedfallen59BetterDynAdminManager
 @supportURL   httpsgithub.comonewingedfallen59BetterDynAdminManagerissues
 @description  Requires Jean-Charles Manoury Better Dyn Admin. Allow you to access easily any DynAdmin instance of an environment in a single tab )
 @author       Benjamin DESCAMPS
 @updateUrl httpsraw.githubusercontent.comonewingedfallen59bdammasterbdam.js
 @downloadUrl httpsraw.githubusercontent.comonewingedfallen59bdammasterbdam.js

 @grant GM_addStyle
 @grant GM_getValue
 @grant GM_setValue
 @require httpscdnjs.cloudflare.comajaxlibsjquery2.2.3jquery.min.js
 ==UserScript==

function loadCSS() {
    if(window.self === window.top) {
        GM_addStyle(.tab-content{displaynone}#tab-1{displayblock}iframe{positionabsolute; top0px; left0px; bottom0px; right0px; width100%; height100%; bordernone; margin0; padding0; overflowhidden; z-index999999;});
    } else {
        GM_addStyle(#bdaManager{background-color #007bb8;}#bdaManager a {colorwhite;}.instance{float left;border 1px solid #dcdcdc;font-size medium;margin-right inherit;});
    }
}

(function() {
    'use strict';
    var start = Date.now();

    Check if dynadmin is loaded and if the current document is the root document (opposed to an iframe document)
    if(document.getElementById(oracleATGbrand) !== null && window.self === window.top) {
        loadCSS();
        remove body content, create iframe host. May be optimized by create the first iframe manually and detachattach body content to iframe
        jQuery('body').empty()
            .append('div id=tabs-containerdiv id=tab-1 class=tab-contentdivdiv');

        initialize the first iframe, corresponding to the url request. May be useless since we're loading every instances. Think about delete  switchable  set url requested the first tab or select the tab corresponding to url
        jQuery('#tab-1').append('iframe src=' + window.location.href + 'iframe');

        loading the stored data (instances urls) or empty list
        var localInstances = GM_getValue(test)  [];
        for(var i = 0; i  localInstances.length; i++) {
            var tabIndex = i+2;
            jQuery('#tabs-container').append('div id=tab-' + tabIndex + ' class=tab-contentdiv');
            jQuery('#tab-' + tabIndex).append('iframe src=' + localInstances[i] + 'iframe');
        }

        For CORS purpose.
        window.addEventListener(message, function(event){
            var tab = event.data;
            if(reload === tab) {
                window.location.reload();
            } else {
                $(.tab-content).not(tab).css(display, none);
                $(tab).fadeIn();
            }
        }, false);
    }
    else {
        loadCSS();

        allow quick access to switch instances buttons. Check if can be optimized
        jQuery(document).keypress(function(event){
            if(event.shiftKey && event.keyCode = 48 && event.keyCode = 57){
                simulate click on instance button. May be optimized by using non anonymous function & call it directly.
                jQuery('.instance a[href=#tab-' + (event.keyCode - 48) + ']').click();
            }
        });

        Create the instances layer on the top bar of iframe
        jQuery('#menuBar').append('div id=bdaManager class=menupInstancespdiv class=instancea href=#tab-11adivdiv');

        loading the stored data (instances urls) or empty list
        var localInstances = GM_getValue(test)  [];
        for(var i = 0; i  localInstances.length; i++) {
            var tabIndex = i+2;
            jQuery('#bdaManager').append('div class=instancea href=#tab-' + tabIndex + '' + tabIndex + 'adiv');
        }

        add the last instance button which allows to add a new instance. May be optimized by chaining the previous call.
        jQuery('#bdaManager').append('div class=instancea href=#tab-++adiv');
    }

    may be optmized does it need to be set on every document 
    $(document).ready(function() {
        $(#bdaManager a).click(function(event) {
            event.preventDefault();

            FIXME the behaviour is erratic between keypress and click actions. Not used currently.
            $(this).parent().addClass(current);
            $(this).parent().siblings().removeClass(current);

            fetch which tab is selected
            var tab = $(this).attr(href);
            special case  add new instance
            if(tab === #tab-+)
            {
                var url = prompt(enter url ).trim();
                if(url.length !== 0) {
                    var localInstances = GM_getValue(test)  [];

                    if no instance yet or the url requested instance does not exist yet, quick add it
                    if (localInstances.length === 0  localInstances.indexOf(window.location.href) === -1) {
                        localInstances.push(window.location.href);
                    }

                    add the given url
                    localInstances.push(url);

                    store new value
                    GM_setValue(test, localInstances);

                    dispatch event to root document
                    window.parent.postMessage(reload, );

                }
            }
            main case  select an instance iframe
            else
            {
                dispatch event to root document
                window.parent.postMessage(tab, );
            }
        });
    });

     Monitor execution time
    var time = Date.now() - start;
    console.log(BDAM takes   + time + ms);
})();