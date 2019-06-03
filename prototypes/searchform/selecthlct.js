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
			var imageHtml = $('<span>').append($('span.selectOptionGroup[value=' + $(this).attr("group") + '] > img').clone()).html();
			$(this).parent().parent().css('display','none');
			$(this).closest('div.selectBox').attr('value',$(this).attr('value'));
			$(this).parent().parent().siblings('span.selected').html(imageHtml + $(this).html());
			$("#filter_type").val($(this).attr("group"));
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
			
			// kechols fix to only have one group opem
			$("span[group]").not("[group='" + group + "']").css("display", "none");
		});
	});
}
		
