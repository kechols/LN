// ==UserScript==
// @name         CA Search Form
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  New landing page search form
// @author       Kevin Echols
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js
// @require      https://raw.githubusercontent.com/kechols/LN/master/prototypes/searchform/selecty.js?vke5
// @resource     customcss https://raw.githubusercontent.com/kechols/LN/master/prototypes/searchform/styles.css?vke5
// @resource     selectycss https://raw.githubusercontent.com/kechols/LN/master/prototypes/searchform/selecty.css
// @resource     juriscss https://raw.githubusercontent.com/kechols/LN/master/prototypes/searchform/hummingbird-treeview.css
// @resource     jurishtml https://raw.githubusercontent.com/kechols/LN/master/prototypes/searchform/juris.html
// @match        https://advance.lexis.com/usresearchhome/*
// @match        https://advance.lexis.com/canadaresearchhome/*
// @match        https://advance.lexis.com/firsttime*
// @match        https://advance.lexis.com/search*
// @match        https://cert7-advance.lexis.com/usresearchhome/*
// @match        https://cert7-advance.lexis.com/firsttime*
// @match        https://cert7-advance.lexis.com/search*
// @match        https://cert7-advance.lexis.com/canadaresearchhome/*
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// ==/UserScript==

(function() {
    'use strict';

    var checksilent = true;

    waitForKeyElements(".content-switcher-list", switchHLCT, true);
    waitForKeyElements(".ct-landing-wrapper", runMain, true);

    function runMain() {

        var customCSS = GM_getResourceText ("customcss"),
            selectyCSS = GM_getResourceText ("selectycss"),
            jurisCSS = GM_getResourceText ("juriscss"),
            faCSS = GM_getResourceText ("fontawesome"),
            jurisHTML = GM_getResourceText ("jurishtml");

        GM_addStyle (customCSS);
        GM_addStyle (selectyCSS);
        GM_addStyle (jurisCSS);
        GM_addStyle (faCSS);


        //REMOVE UNUSED ELEMENTS
        // $(".highlanderpod, .getadoc, .searchbox .options").remove();
        // $(".ct-landing-wrapper").removeClass("pagewrapper");

        // kechols - remove country selector from search box
        $("span.continents").hide();

        // kechols - remove options like search everything next to searcbox
        $("section span.options").hide();

        // kechols - remove advance search links under within
        $("ul.advancesearch").hide();

        //Wrap search section in container (grid)
        $('.pod-wrapper.searchbox').wrap( "<div class='searchsection'><div></div></div>" );


        //INJECT HLCT, JURIS, ETC.
        var juris = '<div class="juris prefilter"><div class="selecty"><a class="selecty-selected" data-placeholder="All Jurisdictions/courts"><i>All Jurisdictions/courts</i></a></div></div>';
        var hlct = '<div class="hlct prefilter"><select id="hlct"><option value="urn:hlct:5" country-image="FlagCA24.png" country-text="Canada Flag">Cases</option><option value="urn:hlct:15" country-image="FlagCA24.png" country-text="Canada Flag">Statutes and Legislation</option><option value="urn:hlct:3" country-image="FlagCA24.png" country-text="Canada Flag">Secondary Materials</option><option value="urn:hlct:2" country-image="FlagCA24.png" country-text="Canada Flag">Administrative Materials<option value="urn:hlct:4">Briefs, Pleadings and Motions<option value="urn:hlct:1" country-image="FlagCA24.png" country-text="Canada Flag">Administrative Codes and Regulations<option value="urn:hlct:10" country-image="FlagCA24.png" country-text="Canada Flag">Forms<option value="urn:hlct:16" country-image="FlagCA24.png" country-text="Canada Flag">News<option value="urn:hlct:14" country-image="FlagCA24.png" country-text="Canada Flag">Legal News<option value="urn:hlct:8" country-image="FlagCA24.png" country-text="Canada Flag">Dockets<option value="urn:hlct:13" country-image="FlagCA24.png" country-text="Canada Flag">Jury Verdicts and Settlements<option value="urn:hlct:12" country-image="FlagCA24.png" country-text="Canada Flag">Jury Instructions<option value="urn:hlct:9" country-image="FlagCA24.png" country-text="Canada Flag">Expert Witness Materials<option value="urn:hlct:6" country-image="FlagCA24.png" country-text="Canada Flag">Company and Financial<option value="urn:hlct:7" country-image="FlagCA24.png" country-text="Canada Flag">Directories<option value="urn:hlct:18" country-image="FlagCA24.png" country-text="Canada Flag">Scientific<option value="urn:hlct:11" country-image="FlagCA24.png" country-text="Canada Flag">Intellectual Property</select></div>';
        $(juris).insertAfter($(".input"));
        $(hlct).insertAfter($(".input"));
        $(".input").css({"border": "1px solid #d2d4d5"});


        //INJECT MORE OPTIONS
        $('.searchsection > div')
            .append('<div class="divider moreopts"></div>')
            .append('<div style="border:0" class="prefilter moreopts"><label for="pat">practice areas</label><div class="prefilter moreopts pat"><select multiple id="pat"><option>All Practice Areas</option></select></div></div>')
            .append('<div style="border:0" class="prefilter moreopts"><label for="favs">recent and favorite filters</label><div class="prefilter moreopts favs"><select id="favs"><option>View Recent and Favorite Filters</option></select></div></div>')
            .append('<div class="moreoptions"><button type="button"></button></div>');

        //INJECT CLEAR FORM BUTTON
        $('#clearform').click(function() {
            $('.jurisfilter').click();
            $(".selecty-options li.selected").click();
            $("#datefilters > button.active").removeClass("active");
            $(".appliedfilters > button").click();
            $('button.clear-filters').click();
        });


        //FORM SUBMISSION ACTIONS
        $("#searchTerms")
            .val("")
            .attr("placeholder","Enter a source name, a citation, terms or shep: [citation] to Shepardize®.")
            .keyup(function(e) {
               var code = e.keyCode ? e.keyCode : e.which;
               if (code == 13) {  // Enter keycode
                   storeSearchOpts();
               }
             });

        $('#mainSearch').click(function(e) {
            storeSearchOpts();
        });


        //INIT HLCT BASED ON STORAGE
        $('#hlct option[value="'+GM_getValue("hlct")+'"]').attr("selected","selected");

        $(".juris .selecty").append(jurisHTML);

        $("#juris-tree input:checkbox").click(function() {
            var attr = $(this).attr('data-value');

            if (typeof attr !== typeof undefined && attr !== false) {  //Top level node

                /*
                if(attr ==="allfed") {
                    if(!$(this).is(":checked")) {
                        $(".selectNoneUS")[0].click();
                    } else {
                        $(".selectAllUS")[0].click();
                    }
                }
                */

                if($(this).is(":checked")) {
                    if(!$("input[data-id='"+attr+"']").is(":checked") || checksilent) {
                        $(".juris .selecty-selected").append("<span class='jurisfilter' data-id='"+attr+"'>"+$(this).data("id")+"<span class='icon la-CloseRemove'></span></span>").find("i").hide();
                        checksilent || $("input[data-id='"+attr+"']").click();
                    }
                } else {
                    $(".juris .selecty-selected").find("span[data-id='"+attr+"']").remove();
                    $("input[data-id='"+attr+"']").click();
                }

            } else { //Child node
                var parentNode;

                if($(this).closest("#treeview").length > 0) {
                    parentNode = $(this).closest("li:has(*[data-value])").find(" > label > input");
                } else {
                    parentNode = $(this).closest(".hummingbird-base > li").find("label").first().find("input");
                }

                attr = $(parentNode).attr('data-value');

                if($(this).is(":checked")) {
                    //check to see if parent has already been applied.  If not, apply it and click the actual filter.  If so, don't do anything.
                    if(!$("input[data-id='"+attr+"']").is(":checked")) {
                        $("input[data-id='"+attr+"']").click();
                        $(".juris .selecty-selected").append("<span class='jurisfilter' data-id='"+attr+"'>"+$(parentNode).data("id")+"<span class='icon la-CloseRemove'></span></span>").find("i").hide();
                    }
                } else {
                    //check to see if parent is still indeterminate.  If so, don't do anything.  If not, remove filter
                    parentNode.prop("indeterminate") || ($("input[data-id='"+attr+"']").click(), $(".juris .selecty-selected").find("span[data-id='"+attr+"']").remove())
                }
            }

            $(".juris .selecty-selected").find("span").length || $(".juris .selecty-selected").find("i").show();
        });

        waitForKeyElements(".jurisdiction-filters", loadjuris, true);
        waitForKeyElements(".ssat-filters", loadpat, true);
        waitForKeyElements(".recent-favorites-filters", loadfavs, true);

        var hlctfilter = new selecty(document.getElementById('hlct'));


        $('.pod-wrapper.browse')
            .wrap( "<div class='exploresection'></div>" )
            .prepend('<h2 class="sectionheader">Explore</h2>');


        //INITIALIZE FILTERS BASED ON PREVIOUS SELECTIONS - BROWSER STORAGE
        $('.moreoptions > button').click(function() {
            $(".searchsection > div").toggleClass("showopts");
            GM_setValue("moreopts",$(".searchsection > div").attr("class"));
        });

        $(document).on("click","*[data-action='addsource']",function() {
            var sourceID = $(this).closest("li").data("value");

            if(!$(this).hasClass("sourceadded")) {
                //Remove local
                $(".appliedfilters button[data-id='"+sourceID+"']").remove();
                sourceCheck();
            } else {
                $("a.selecty-selected").html("N/A <span>(searching source)</span>");
                $(".appliedfilters").append('<button type="button" data-id="'+sourceID+'">'+$(this).closest("li").data("text")+'<span class="icon la-CloseRemove"></span></button>').show();
            }
        });



        $(document).on("click",".jurisfilter",function(e) {
            e.stopPropagation();
            var removedNode = $("#juris-tree input:checkbox[data-value='"+$(this).data("id")+"']");
            if(!removedNode.prop("indeterminate")) { //Already checked, so just uncheck
                $(removedNode).click();
            } else {
                $(removedNode).click().click(); //oh boy, this is bad.
            }
        });

        $(document).on("click",".appliedfilters > button",function() {
            $(".deleteFilter[data-id*='"+$(this).data("id")+"']").click();
            $(this).remove();
            sourceCheck();
        });

        $(document).on("click",".prefilter > label, .prefilter .selecty-selected",function(e) {
            if($(this).closest(".juris").length) {
                $('#juris-tree').toggle();
            } else {
                e.preventDefault();
                $(this).parent(".prefilter").find(".selecty-selected")[0].click();
            }
        });

        $(document).mouseup(function(e) {
            var container = $("#juris-tree");
            if($(e.target).closest(".juris").length === 0)
            {
                container.hide();
            }
        });


        $('#datefilters > button').click(function() {
            var alreadyActive = $(this).hasClass("active");
            $('#datefilters > button').removeClass('active');

            if(alreadyActive) {
                $(".deleteFilter[data-id='date']").click();
            } else {
                $(this).addClass("active");
                setDate($(this).val());
            }
        });

    }


    function storeSearchOpts() {
        //STORE HLCT
        GM_setValue("hlct", $( "#hlct option:selected" ).val());

        //STORE DATE
        if($("#datefilters > button.active").length) {
            GM_setValue("date",$("#datefilters > button.active").val());
        } else {
            GM_deleteValue("date");
        }
    }

    function sourceCheck() {
        if(!$(".appliedfilters > button").length) {
            $(".appliedfilters").hide();
            $(".hlct .selecty-selected").html($(".hlct .selecty-options > li.selected").text());
            $(".favs .selecty-selected").html("Select Recent or Favorite");
            $(".pat .selecty-selected").html("All Practice Areas");
            $(".juris .selecty-selected").html("All Jurisdictions and Courts");
            $('#clearform')[0].click();
        }
    }


    function setDate(datestring) {
        $('#date option').filter(function() {
            return ($(this).text() == datestring);
        }).prop('selected', true).trigger('change');
        $("button.adddate").prop('disabled', false).trigger('click');
    }


    function loadjuris() {
        $(".jurisdiction-filters input:checkbox:checked").each(function() {
            $("#juris-tree input:checkbox[data-value='"+$(this).data("id")+"']").click();
        });
        //TODO - need to also add and remove based on what was done on search results
        checksilent = false;

        //$(".searchfilters").show();
    }


    function loadpat() {
        var patdropdown = $("#pat");
        $(".ssat-filters input:checkbox").each(function() {
            var newOption = $("<option>").attr('value',$(this).data("id")).text($(this).data("value"));
            $(this).is(":checked") && newOption.attr("selected","selected");
            patdropdown.append(newOption);
        });
        var patfilter = new selecty(document.getElementById('pat'));


        $('.prefilter.pat li').click(function(e) {
            $("*[data-id='"+$(this).data("value")+"']").click();
            $(".pat .selecty-selected")[0].click(); //To get focus back
        });

        //Click the recent and favorites tab to get those as well
        $("#recent-favorites").click();

        if($(".deleteFilter[data-id='date']").length) {
            var dateFilter = $(".deleteFilter[data-id='date']").text();
            //switch statement here?
        }

        GM_getValue("date") || $(".deleteFilter[data-id='date']").click()
        $('#datefilters > button[value="' + GM_getValue("date") + '"]').addClass("active");
    }

    function loadfavs() {
        var favdropdown = $("#favs");

        $("label[data-popupid='recentFavoriteRow']").each(function() {
            favdropdown.append($("<option>").attr('value',$(this).attr("for")).text($(this).text()));
        });
        var favfilter = new selecty(document.getElementById('favs'));

        $(".searchsection > div").addClass(GM_getValue("moreopts"));

        $(".deleteFilter[data-id*='~^'], .deleteFilter[data-id*='querytemplate']").length && setSourceMode()
    }


    function setSourceMode() {
        $("a.selecty-selected").html("N/A <span>(searching source)</span>");

        $(".deleteFilter[data-id*='~^'], .deleteFilter[data-id*='querytemplate']").each(function() {
             $(".appliedfilters").append('<button type="button" data-id="'+$(this).data("value")+'">'+$(this).find("span").text()+'<span class="icon la-CloseRemove"></span></button>').show();
        });
        $("#datefilters > button.active").removeClass("active");
        GM_deleteValue("date");

    }

    function switchHLCT() {
        $(".content-switcher-list").find("li[data-id='"+GM_getValue("hlct")+"']:not(.active) button").click();

        window.onload = function () {
            if (typeof history.pushState === "function") {
                history.pushState("jibberish", null, null);
                window.onpopstate = function () {
                    history.pushState('newjibberish', null, null);
                    window.location.replace($("#nav_currentproduct_button").attr("href"));
                    //$("#nav_currentproduct_button")[0].click();
                    // Handle the back (or forward) buttons here
                    // Will NOT handle refresh, use onbeforeunload for this.
                };
            }
        }



        /*
        $(document).on("click",".content-switcher-list li",function() {
            GM_setValue("hlct",$(this).data("id"));
        });

        $(document).on("mousedown","li.applied-filter > button",function(e) {
            (e.currentTarget.title.indexOf('Timeline') > -1) && GM_deleteValue("date")
            //(e.currentTarget.title.indexOf('Topics') > -1) && GM_setValue("PATClear","true")
            //(e.currentTarget.title.indexOf('Topics') > -1) && GM_setValue("PATClear","true")
        });
        */
    }

})();