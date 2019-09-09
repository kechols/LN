// from https://gist.github.com/BrockA/2625891
function waitForKeyElements (selectorTxt,actionFunction,bWaitOnce,iframeSelector)
{
    var targetNodes, btargetsFound;
    if (typeof iframeSelector == "undefined")
        targetNodes     = $(selectorTxt);
    else
        targetNodes     = $(iframeSelector).contents().find (selectorTxt);
    if (targetNodes  &&  targetNodes.length > 0) {
        targetNodes.each ( function () {
            var jThis        = $(this);
            var alreadyFound = jThis.data ('alreadyFound')  ||  false;
            if (!alreadyFound) {
                actionFunction (jThis);
                jThis.data ('alreadyFound', true);
            }
        } );
        btargetsFound   = true;
    }
    else {
        btargetsFound   = false;
    }

    var controlObj      = waitForKeyElements.controlObj  ||  {};
    var controlKey      = selectorTxt.replace (/[^\w]/g, "_");
    var timeControl     = controlObj [controlKey];

    if (btargetsFound  &&  bWaitOnce  &&  timeControl) {
        clearInterval (timeControl);
        delete controlObj [controlKey];
    }
    else {
        if ( ! timeControl) {
            timeControl = setInterval ( function () {
                waitForKeyElements (    selectorTxt,
                                    actionFunction,
                                    bWaitOnce,
                                    iframeSelector
                                   );
            },500);
            controlObj [controlKey] = timeControl;
        }
    }
    waitForKeyElements.controlObj   = controlObj;
}
