'use strict';
$(document).ready(function(){
	$('#EImageGallery').hide();
	$('#ERightPanelLower').hide();
	//$(window).resize(setResolution);
	setResolution();
	xOff = xCenter;
	yOff = yCenter;
	$('#EMainDisplay').attr('width', width);
	$('#EMainDisplay').attr('height', height);
	context = $('#EMainDisplay')[0].getContext('2d');
	surface = context.createImageData(width, height);

	// behaviors
	document.oncontextmenu = function(){return false;};
	$('#EMainDisplay').mousedown(function(e){
		var left = e.pageX-$('#EMainDisplay').offset().left;
		var top = e.pageY-$('#EMainDisplay').offset().top;

		switch(e.which){
		case 1:
			xOff += xCenter-left;
			yOff += yCenter-top;
			break;
		case 3:
			var f = $('#EFactor').val();
			if(e.shiftKey)
				f=1/f;
			fMag /= f;
			xOff = xCenter-(left-xOff)*f;
			yOff = yCenter-(top-yOff)*f;
			break;
		}
		initDisplay();
	});
	$('#EMainDisplay').mouseout(function(){
		$('#ECurX').text('');
		$('#ECurY').text('');
	});
	$('#EXCenter').keypress(setCenter);
	$('#EYCenter').keypress(setCenter);
	$('#ECurEnable').change(function(){
		$('#ECurEnable').is(':checked') ? $('#EMainDisplay').mousemove(setCursorText) : $('#EMainDisplay').unbind('mousemove');
	});
	$('#EDRange').change(initDisplay);
	$('#EHanning').change(function(){applyHanning=!applyHanning;});
	$('#EColorDef').change(setColorFunc);
	$('#EColorCyc').change(setColorFunc);
	$('#EColorOsc').change(setColorFunc);

	// buttons
	$('#EZOut').button({
		text: false,
		icons: {
			primary: 'ui-icon-minus'
		}
	}).click(zoomOut);
	$('#EZIn').button({
		text: false,
		icons: {
			primary: 'ui-icon-plus'
		}
	}).click(zoomIn);
	$('#EPlot').button({
		text: false,
		icons: {
			primary: 'ui-icon-refresh'
		}
	}).click(function(){
		initDisplay();
	});
	$('#EPlay').button({
		text: false,
		icons: {
			primary: 'ui-icon-pause'
		}
	}).click(function(){
		var options;
		if($(this).text() === 'Play'){	// start
			t = setInterval('frame()', 1);
			options = {
				label: 'Pause',
				icons: {
					primary: 'ui-icon-pause'
				}
			};
		}
		else{	// stop
			window.clearInterval(t);
			t=false;
			options = {
				label: 'Play',
				icons:
				{
					primary: 'ui-icon-play'
				}
			};
		}
		$(this).button('option',options);
	});
	$('#ESave').button().click(saveCoord);
	$('#ELoad').button().click(gotoCoord);
	$('#EDelete').button().click(removeCoord);
	$('#ESShot').button().click(saveImage);

	// modal dialog
	$('#dialog-modal').dialog({
		autoOpen: false,
		width: width+35,
		height: height+143,
		modal: true,
		buttons:{
			'Delete': function(){
				removeImage($('#dialog-modal > img').attr('id'));
				loadImages();
				$(this).dialog('close');
			}
		},
		focus: function(){
			document.oncontextmenu = function(){return true;};
		},
		beforeClose: function(){
			document.oncontextmenu = function(){return false;};
		}
	});

	$('#ECoordList').selectable();

  $(function(){
	// main accordion
	$('#EControls').accordion({
		//fillSpace: true,
		autoHeight: false,
		change: function(event, ui){
			var active = $('#EControls').accordion('option', 'active');
			if(active == 3){
				if(!$('#EImageGallery').is(':visible'))
					$('#EImageGallery').show('drop', null, 500);
			}
			else{
				if($('#EImageGallery').is(':visible')){
					$('#EImageGallery').hide('drop', null, 500);
				}
			}
			if(active == 1){
				if(!$('#ERightPanelLower').is(':visible')){
					loadCoord();
					$('#ERightPanelLower').show('drop', {direction: 'right'}, 500);
				}
			}
			else{
				if($('#ERightPanelLower').is(':visible')){
					$('#ERightPanelLower').hide('drop', {direction: 'right'}, 500);
				}
			}
		}
	});

	/*
	*	Begin scrollpane
	*/
	//scrollpane parts
	var scrollPane = $('.scroll-pane'),
		scrollContent = $('.scroll-content');

	//build slider
	var scrollbar = $('.scroll-bar').slider({
		slide: function(event, ui){
			if(scrollContent.width() > scrollPane.width())
				scrollContent.css('margin-left', Math.round(ui.value / 100 * ( scrollPane.width() - scrollContent.width() )) + 'px' );
			else
				scrollContent.css('margin-left', 0);
		}
	});

	//append icon to handle
	var handleHelper = scrollbar.find('.ui-slider-handle').mousedown(function(){
		scrollbar.width(handleHelper.width());
	})
	.mouseup(function(){
		scrollbar.width('100%');
	})
	.append('<span class="ui-icon ui-icon-grip-dotted-vertical"></span>')
	.wrap('<div class="ui-handle-helper-parent"></div>').parent();

	//change overflow to hidden now that slider handles the scrolling
	scrollPane.css('overflow', 'hidden');

	//size scrollbar and handle proportionally to scroll distance
	function sizeScrollbar(){
		var remainder = scrollContent.width() - scrollPane.width();
		var proportion = remainder / scrollContent.width();
		var handleSize = scrollPane.width() - (proportion * scrollPane.width());
		scrollbar.find('.ui-slider-handle').css({
			width: handleSize,
			'margin-left': -handleSize / 2
		});
		handleHelper.width('').width(scrollbar.width() - handleSize);
	}

	//reset slider value based on scroll content position
	function resetValue(){
		var remainder = scrollPane.width() - scrollContent.width();
		var leftVal = scrollContent.css('margin-left') === 'auto' ? 0 : parseInt(scrollContent.css('margin-left'));
		var percentage = Math.round(leftVal / remainder * 100);
		scrollbar.slider('value', percentage);
	}

	//if the slider is 100% and window gets larger, reveal content
	function reflowContent(){
		var showing = scrollContent.width() + parseInt(scrollContent.css('margin-left'), 10);
		var gap = scrollPane.width() - showing;
		if(gap > 0){
			scrollContent.css('margin-left', parseInt(scrollContent.css('margin-left'), 10 ) + gap);
		}
	}

	//change handle position on window resize
	$(window).resize(function(){
		resetValue();
		sizeScrollbar();
		reflowContent();
	});
	//init scrollbar size
	setTimeout(sizeScrollbar, 10);	//safari wants a timeout
		/*
		* End scrollpane
		*/
  });
});
