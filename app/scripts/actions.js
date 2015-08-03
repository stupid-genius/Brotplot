'use strict';
var t;
var width;
var height;
var xCenter;
var yCenter;
var iPix;
var afActive = [];
var aiX = [];
var aiY = [];
var context;
var surface;

var fMag = .01;
var xOff;
var yOff;
var applyHanning = false;
var beginColorCycle;
var colorFunc = 0;
var bRendering = false;

function setResolution(){
	width = $(document).innerWidth() - $('#ERightPanel').width() - 50;
	height = $(document).innerHeight() - $('#EMainDisplay').position().top - 157;	// top+gallery = 157
	if(width*(3/4)<height){
		height = Math.round(width*(3/4));
	}
	else{
		width = Math.round(height*(4/3));
	}
	//$('#ERightPanel').height(height/2);
	xCenter = Math.round(width/2);
	yCenter = Math.round(height/2);
	iPix = height*width;
}
function initDisplay(){
	//bRendering = false;
	$('#EDRange').is(':checked') ? beginColorCycle = false : beginColorCycle = true;
	colorMan.reset();
	for(var i=0;i<iPix; ++i){
		afActive[i] = true;
		aiX[i] = 0;
		aiY[i] = 0;
		surface.data[i*4] = 0;
		surface.data[i*4+1] = 0;
		surface.data[i*4+2] = 0;
		surface.data[i*4+3] = 255;
	}
	$('#EXCenter').val((xCenter-xOff)*fMag);
	$('#EYCenter').val((yOff-yCenter)*fMag);
	$('#EMag').text(1/fMag + 'X');
}
function setCenter(e){
	if(e.which == 13) // ENTER
	{
		event.preventDefault();
		xOff = xCenter-$('#EXCenter').val()/fMag;
		yOff = yCenter+$('#EYCenter').val()/fMag;
		initDisplay();
	}
}
function setCursorText(e){
	$('#ECurX').text((e.pageX-$('#EMainDisplay').offset().left-xCenter)*fMag);
	$('#ECurY').text(-(e.pageY-$('#EMainDisplay').offset().top-yCenter)*fMag);
}

function zoomOut(){
	var f = $('#EFactor').val();
	fMag *= f;
	xOff = xCenter-(xCenter-xOff)/f;
	yOff = yCenter-(yCenter-yOff)/f;
	initDisplay();
}
function zoomIn(){
	var f = $('#EFactor').val();
	fMag /= f;
	xOff = xCenter-(xCenter-xOff)*f;
	yOff = yCenter-(yCenter-yOff)*f;
	initDisplay();
}

function saveCoord(){
	var newPlot = xOff+','+yOff+','+fMag;
	var name = $('#EXCenter').val()+','+$('#EYCenter').val()+','+$('#EMag').text();
	var list;
	try{
		localStorage.setItem(name, newPlot);
		if(localStorage.plots==undefined || localStorage.plots=='')
			list = name;
		else
			list = localStorage.plots+';'+name;
		localStorage.plots = list;
		loadCoord();
	}
	catch(e){
		alert('Can not save plot.  localStorage limit reached.');
	}
}
function loadCoord(){
	$('#ECoordList').empty();
	if(localStorage.plots){
		var plots = localStorage.plots.split(/;/);
		for(var i in plots){
			$('#ECoordList').append('<li class="ui-widget-content">'+plots[i]+'</li>');
		}
	}
	else{
		$('#ECoordList').append('<div class="ui-widget">You haven\'t saved any plots yet.</div>');
	}
}
function gotoCoord(){
	var name = $('.ui-selected').text();
	if(name==undefined || name==null){
		alert('Please select a plot to load.');
		return;
	}
	var plot = localStorage.getItem(name);
	var a = plot.split(/,/);
	xOff = +a[0];
	yOff = +a[1];
	fMag = +a[2];
	initDisplay();
}
function removeCoord(){
	var plot = $('.ui-selected').text();
	if(plot === undefined || plot === null){
		alert('Please select a plot to delete.');
		return;
	}
	localStorage.removeItem(plot);
	var list = localStorage.plots.split(/;/);
	var newList = '';
	for(var i in list){
		if(list[i]==plot){
			continue;
		}
		newList+=';'+list[i];
	}
	newList = newList.replace(/;/, '');
	localStorage.plots = newList;
	loadCoord();
}

function saveImage(){
	var data = $('#EMainDisplay')[0].toDataURL();
	var name = new Date().getTime();
	var list;
	try{
		localStorage.setItem(name, data);
		if(localStorage.shots==undefined || localStorage.shots == ''){
			list = name;
		}
		else{
			list = localStorage.shots+';'+name;
		}
		localStorage.shots = list;
		loadImages();
	}
	catch(e){
		alert('Can not save image.  localStorage limit reached.');
	}
}
function loadImages(){
	$('#EImages').empty();
	if(localStorage.shots){
		var list = localStorage.shots.split(/;/);
		for(var i in list){
			$('#EImages').append('<div class="scroll-content-item ui-widget-header"><img class="thumb" id="'+list[i]+'" src="'+localStorage.getItem(list[i])+'"/></div>');
		}
	}
	else{
		$('#EImages').text('You haven\'t added any images yet.  Click \'Save image\' to add an image.');
	}

	$('.thumb').click(function(){
		var img = $(this).clone();
		img.width(width);
		img.height(height);
		$('#dialog-modal').html(img);
		$('#dialog-modal').dialog('open');
	});
}
function removeImage(imageID){
	localStorage.removeItem(imageID);
	var list = localStorage.shots.split(/;/);
	var newList = '';
	for(var i in list){
		if(list[i] == imageID){
			continue;
		}
		newList += ';'+list[i];
	}
	newList = newList.replace(/;/, '');
	localStorage.shots = newList;
}

function setColorFunc(){
	colorFunc = $('input[name=rbg1]').index($('input[name=rbg1]:checked'));
}
