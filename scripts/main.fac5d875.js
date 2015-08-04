"use strict";function setResolution(){width=$(document).innerWidth()-$("#ERightPanel").width()-50,height=$(document).innerHeight()-$("#EMainDisplay").position().top-157,height>.75*width?height=Math.round(.75*width):width=Math.round(height*(4/3)),xCenter=Math.round(width/2),yCenter=Math.round(height/2),iPix=height*width}function initDisplay(){beginColorCycle=$("#EDRange").is(":checked")?!1:!0,colorMan.reset();for(var a=0;iPix>a;++a)afActive[a]=!0,aiX[a]=0,aiY[a]=0,surface.data[4*a]=0,surface.data[4*a+1]=0,surface.data[4*a+2]=0,surface.data[4*a+3]=255;$("#EXCenter").val((xCenter-xOff)*fMag),$("#EYCenter").val((yOff-yCenter)*fMag),$("#EMag").text(1/fMag+"X")}function setCenter(a){13==a.which&&(event.preventDefault(),xOff=xCenter-$("#EXCenter").val()/fMag,yOff=yCenter+$("#EYCenter").val()/fMag,initDisplay())}function setCursorText(a){$("#ECurX").text((a.pageX-$("#EMainDisplay").offset().left-xCenter)*fMag),$("#ECurY").text(-(a.pageY-$("#EMainDisplay").offset().top-yCenter)*fMag)}function zoomOut(){var a=$("#EFactor").val();fMag*=a,xOff=xCenter-(xCenter-xOff)/a,yOff=yCenter-(yCenter-yOff)/a,initDisplay()}function zoomIn(){var a=$("#EFactor").val();fMag/=a,xOff=xCenter-(xCenter-xOff)*a,yOff=yCenter-(yCenter-yOff)*a,initDisplay()}function saveCoord(){var a,b=xOff+","+yOff+","+fMag,c=$("#EXCenter").val()+","+$("#EYCenter").val()+","+$("#EMag").text();try{localStorage.setItem(c,b),a=void 0==localStorage.plots||""==localStorage.plots?c:localStorage.plots+";"+c,localStorage.plots=a,loadCoord()}catch(d){alert("Can not save plot.  localStorage limit reached.")}}function loadCoord(){if($("#ECoordList").empty(),localStorage.plots){var a=localStorage.plots.split(/;/);for(var b in a)$("#ECoordList").append('<li class="ui-widget-content">'+a[b]+"</li>")}else $("#ECoordList").append('<div class="ui-widget">You haven\'t saved any plots yet.</div>')}function gotoCoord(){var a=$(".ui-selected").text();if(void 0==a||null==a)return void alert("Please select a plot to load.");var b=localStorage.getItem(a),c=b.split(/,/);xOff=+c[0],yOff=+c[1],fMag=+c[2],initDisplay()}function removeCoord(){var a=$(".ui-selected").text();if(void 0===a||null===a)return void alert("Please select a plot to delete.");localStorage.removeItem(a);var b=localStorage.plots.split(/;/),c="";for(var d in b)b[d]!=a&&(c+=";"+b[d]);c=c.replace(/;/,""),localStorage.plots=c,loadCoord()}function saveImage(){var a,b=$("#EMainDisplay")[0].toDataURL(),c=(new Date).getTime();try{localStorage.setItem(c,b),a=void 0==localStorage.shots||""==localStorage.shots?c:localStorage.shots+";"+c,localStorage.shots=a,loadImages()}catch(d){alert("Can not save image.  localStorage limit reached.")}}function loadImages(){if($("#EImages").empty(),localStorage.shots){var a=localStorage.shots.split(/;/);for(var b in a)$("#EImages").append('<div class="scroll-content-item ui-widget-header"><img class="thumb" id="'+a[b]+'" src="'+localStorage.getItem(a[b])+'"/></div>')}else $("#EImages").text("You haven't added any images yet.  Click 'Save image' to add an image.");$(".thumb").click(function(){var a=$(this).clone();a.width(width),a.height(height),$("#dialog-modal").html(a),$("#dialog-modal").dialog("open")})}function removeImage(a){localStorage.removeItem(a);var b=localStorage.shots.split(/;/),c="";for(var d in b)b[d]!=a&&(c+=";"+b[d]);c=c.replace(/;/,""),localStorage.shots=c}function setColorFunc(){colorFunc=$("input[name=rbg1]").index($("input[name=rbg1]:checked"))}function delBrot(a){var b,c,d=a;this.bActive,this.reset=function(){b=[];for(var a=0;d>a;++a)b.push(0);c=!0,this.bActive=!0},this.comp=function(a){return b[a]},this.inc=function(a){switch(a){case 0:case 1:if(!this.bActive)return;b[0]<255?b[0]++:b[1]<255?b[1]++:b[2]<255?b[2]++:0==a?this.bActive=!1:(b[0]=0,b[1]=0,b[2]=0);break;case 2:if(!this.bActive)return;c?b[0]<255?b[0]++:b[1]<255?b[1]++:b[2]<255?b[2]++:c=!1:b[2]>0?b[2]--:b[1]>0?b[1]--:b[0]>0?b[0]--:c=!0}}}function frame(){if(colorMan.bActive){var a;beginColorCycle&&colorMan.inc(colorFunc);for(var b=colorMan.comp(0),c=colorMan.comp(1),d=colorMan.comp(2),e=0;iPix>e;++e)if(afActive[e]){var f=aiX[e],g=aiY[e];if(aiX[e]=f*f-g*g+(e%width-xOff)*fMag,aiY[e]=2*f*g+(Math.floor(e/width)-yOff)*fMag,aiX[e]>=2||aiY[e]>=2)afActive[e]=!1,beginColorCycle=!0;else if(beginColorCycle&&(a=4*e,surface.data[a]=b,surface.data[a+1]=c,surface.data[a+2]=d,applyHanning&&e>=width&&iPix-width>e&&e%width>0&&width-1>e%width)){for(var h=4*(e-width-1),i=0;36>i;++i){var j=h+i%12+Math.floor(i/12)*width*4,k=(surface.data[j]+surface.data[j-4]+surface.data[j+4])/3;surface.data[j]=k}for(var i=0;36>i;++i){var j=h+i%12+Math.floor(i/12)*width*4,k=(surface.data[j]+surface.data[j-4*width]+surface.data[j+4*width])/3;surface.data[j]=k}}}context.putImageData(surface,0,0),bRendering=!1}}var t,width,height,xCenter,yCenter,iPix,afActive=[],aiX=[],aiY=[],context,surface,fMag=.01,xOff,yOff,applyHanning=!1,beginColorCycle,colorFunc=0,bRendering=!1;$(document).ready(function(){$("#EImageGallery").hide(),$("#ERightPanelLower").hide(),setResolution(),xOff=xCenter,yOff=yCenter,$("#EMainDisplay").attr("width",width),$("#EMainDisplay").attr("height",height),context=$("#EMainDisplay")[0].getContext("2d"),surface=context.createImageData(width,height),document.oncontextmenu=function(){return!1},$("#EMainDisplay").mousedown(function(a){var b=a.pageX-$("#EMainDisplay").offset().left,c=a.pageY-$("#EMainDisplay").offset().top;switch(a.which){case 1:xOff+=xCenter-b,yOff+=yCenter-c;break;case 3:var d=$("#EFactor").val();a.shiftKey&&(d=1/d),fMag/=d,xOff=xCenter-(b-xOff)*d,yOff=yCenter-(c-yOff)*d}initDisplay()}),$("#EMainDisplay").mouseout(function(){$("#ECurX").text(""),$("#ECurY").text("")}),$("#EXCenter").keypress(setCenter),$("#EYCenter").keypress(setCenter),$("#ECurEnable").change(function(){$("#ECurEnable").is(":checked")?$("#EMainDisplay").mousemove(setCursorText):$("#EMainDisplay").unbind("mousemove")}),$("#EDRange").change(initDisplay),$("#EHanning").change(function(){applyHanning=!applyHanning}),$("#EColorDef").change(setColorFunc),$("#EColorCyc").change(setColorFunc),$("#EColorOsc").change(setColorFunc),$("#EZOut").button({text:!1,icons:{primary:"ui-icon-minus"}}).click(zoomOut),$("#EZIn").button({text:!1,icons:{primary:"ui-icon-plus"}}).click(zoomIn),$("#EPlot").button({text:!1,icons:{primary:"ui-icon-refresh"}}).click(function(){initDisplay()}),$("#EPlay").button({text:!1,icons:{primary:"ui-icon-pause"}}).click(function(){var a;"Play"===$(this).text()?(t=setInterval("frame()",1),a={label:"Pause",icons:{primary:"ui-icon-pause"}}):(window.clearInterval(t),t=!1,a={label:"Play",icons:{primary:"ui-icon-play"}}),$(this).button("option",a)}),$("#ESave").button().click(saveCoord),$("#ELoad").button().click(gotoCoord),$("#EDelete").button().click(removeCoord),$("#ESShot").button().click(saveImage),$("#dialog-modal").dialog({autoOpen:!1,width:width+35,height:height+143,modal:!0,buttons:{Delete:function(){removeImage($("#dialog-modal > img").attr("id")),loadImages(),$(this).dialog("close")}},focus:function(){document.oncontextmenu=function(){return!0}},beforeClose:function(){document.oncontextmenu=function(){return!1}}}),$("#ECoordList").selectable(),$(function(){function a(){var a=e.width()-d.width(),b=a/e.width(),c=d.width()-b*d.width();f.find(".ui-slider-handle").css({width:c,"margin-left":-c/2}),g.width("").width(f.width()-c)}function b(){var a=d.width()-e.width(),b="auto"===e.css("margin-left")?0:parseInt(e.css("margin-left")),c=Math.round(b/a*100);f.slider("value",c)}function c(){var a=e.width()+parseInt(e.css("margin-left"),10),b=d.width()-a;b>0&&e.css("margin-left",parseInt(e.css("margin-left"),10)+b)}$("#EControls").accordion({autoHeight:!1,change:function(){var a=$("#EControls").accordion("option","active");3==a?$("#EImageGallery").is(":visible")||$("#EImageGallery").show("drop",null,500):$("#EImageGallery").is(":visible")&&$("#EImageGallery").hide("drop",null,500),1==a?$("#ERightPanelLower").is(":visible")||(loadCoord(),$("#ERightPanelLower").show("drop",{direction:"right"},500)):$("#ERightPanelLower").is(":visible")&&$("#ERightPanelLower").hide("drop",{direction:"right"},500)}});var d=$(".scroll-pane"),e=$(".scroll-content"),f=$(".scroll-bar").slider({slide:function(a,b){e.width()>d.width()?e.css("margin-left",Math.round(b.value/100*(d.width()-e.width()))+"px"):e.css("margin-left",0)}}),g=f.find(".ui-slider-handle").mousedown(function(){f.width(g.width())}).mouseup(function(){f.width("100%")}).append('<span class="ui-icon ui-icon-grip-dotted-vertical"></span>').wrap('<div class="ui-handle-helper-parent"></div>').parent();d.css("overflow","hidden"),$(window).resize(function(){b(),a(),c()}),setTimeout(a,10)})});var colorMan=new delBrot(3);$(document).ready(function(){initDisplay(),loadImages(),t=setInterval(frame,1)});