/******************************
*	Brotplot 2.0
*	written by Allen Ng
*	Stupid Genius Software
******************************/
/*
This file is part of Brotplot.

Brotplot is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Brotplot is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with Brotplot.  If not, see <http://www.gnu.org/licenses/>.
*/
/*
	TO DO:
	custom color control
	webworkers
	fix coordinate display
	fix FF right-click menu
	fix Hanning smoothing
	wallpaper mode
	use animation timer
	add url params processing for plot
	re-work UI
*/
// jshint devel:true
'use strict';
$(document).ready(function(){
	initDisplay();

	loadImages();
	t = setInterval(frame, 1);
	//frame();
});
