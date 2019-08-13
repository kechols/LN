function enableSelectBoxes(){
	// Eevent handler to close selectbox when clicking outside
	
	$(document).mouseup(function(e) 
	{
		var container = $("div.selectBox.hlct");

		// if the target of the click isn't the container nor a descendant of the container hide the selections
		if (!container.is(e.target) && container.has(e.target).length === 0) 
		{
			var selections = $("div.selectOptions.selecty");
			selections.hide();
		}
	});
	

	$('div.selectBox').each(function(){
		$(this).children('span.selected').html($(this).children('div.selectOptions').children('span.selectOption:first').html());
		$(this).attr('value',$(this).children('div.selectOptions').children('span.selectOption:first').attr('value'));

		$(this).children('span.selected,span.selectArrow').click(function(){
			if($(this).parent().children('div.selectOptions').css('display') == 'none'){
				$(this).parent().children('div.selectOptions').css('display','block');
			}
			else
			{
				$(this).parent().children('div.selectOptions').css('display','none');
			}
		});

		$(this).find('span.selectOption').click(function(){						
			var group = $(this).attr("group");
			var countrycode  = $(this).siblings(".selectOptionGroup").attr("countrycode");
			// AU specific code to disable Jurisdiction options for NZ
			if ($(this).attr("group") == 2){
				$(".juris.prefilter div.selecty").addClass("disabled");
			}
			else {
				$(".juris.prefilter div.selecty").removeClass("disabled");
			}
			var imageHtml = $('<span>').append($('span.selectOptionGroup[value=' + group + '] > img').clone()).html();
			$(this).parent().parent().css('display','none');
			$(this).closest('div.selectBox').attr('value', $(this).attr('value'));
			$(this).parent().parent().siblings('span.selected').html(imageHtml + countrycode + $(this).html());
			$("#filter_type").val(group);
			$("#filter_value").val($(this).attr("value"));
		});

		$(this).find('span.selectOptionGroup').click(function(){
			var group = $(this).attr("value");
			$(this).parent().children("span[group='" + group + "']").each(function(){
				if($(this).css("display") == "block") {
					$(this).css("display", "none");
				}
				else {
					$(this).css("display", "block");
				}
			});
			
			// kechols - only have one group open
			// chilren css
			$("span[group]").not("[group='" + group + "']").css("display", "none");
			// arrow css
			$("span.selectOptionGroup").not("[value='" + group + "']").children("span").removeClass("la-TriangleUpAfter").addClass("la-TriangleDownAfter")
			// kechols - toggle up/down arrow
			var triangle_span = $(this).children("span");
			if (triangle_span.hasClass("la-TriangleDownAfter")){
				triangle_span.removeClass("la-TriangleDownAfter").addClass("la-TriangleUpAfter");
			}
			else {
				triangle_span.removeClass("la-TriangleUpAfter").addClass("la-TriangleDownAfter");
			}
		});
	});
}
		
