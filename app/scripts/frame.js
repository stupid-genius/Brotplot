'use strict';
function delBrot(d)
{
	var dimension = d;
	var aiComponents;
	var bForward;
	this.bActive;

	this.reset = function()
	{
		aiComponents = [];
		for(var i=0;i<dimension;++i)
			aiComponents.push(0);
		bForward = true;
		this.bActive = true;
	};
	this.comp = function(dim)
	{
		return aiComponents[dim];
	};
	this.inc = function(mode)
	{
		switch(mode)
		{
		case 0:
		case 1:
			if(!this.bActive)
				return;
			if(aiComponents[0]<255)
				aiComponents[0]++;
			else
			{
				if(aiComponents[1]<255)
					aiComponents[1]++;
				else
				{
					if(aiComponents[2]<255)
						aiComponents[2]++
					else
					{
						if(mode==0)
							this.bActive = false;
						else
						{
							aiComponents[0]=0;
							aiComponents[1]=0;
							aiComponents[2]=0;
						}
					}
				}
			}
			break;
		case 2:
			if(!this.bActive)
					return;
			if(bForward)
				if(aiComponents[0]<255)
					aiComponents[0]++;
				else
				{
					if(aiComponents[1]<255)
						aiComponents[1]++;
					else
					{
						if(aiComponents[2]<255)
							aiComponents[2]++
						else
						{
							bForward = false;
						}
					}
				}
			else
				if(aiComponents[2]>0)
					aiComponents[2]--;
				else
				{
					if(aiComponents[1]>0)
						aiComponents[1]--;
					else
					{
						if(aiComponents[0]>0)
							aiComponents[0]--;
						else
							bForward = true;
					}
				}
			break;
		}
	};
}

var colorMan = new delBrot(3);

function frame()
{
	if(!colorMan.bActive)
		return;
	//bRendering = true;

	var p;
	if(beginColorCycle)
		colorMan.inc(colorFunc);
	var r = colorMan.comp(0);
	var g = colorMan.comp(1);
	var b = colorMan.comp(2);

	for(var i=0; i<iPix; ++i)
	{
		if(!afActive[i])
			continue;
		var x = aiX[i];
		var y = aiY[i];
		aiX[i]=x*x-y*y+(((i%width)-xOff)*fMag);
		aiY[i]=2*x*y+((Math.floor(i/width)-yOff)*fMag);

		if(aiX[i] >= 2 || aiY[i] >= 2)
		{
			afActive[i] = false;
			beginColorCycle = true;
			continue;
		}
		if(!beginColorCycle)
			continue;
		p = i*4;
		surface.data[p] = r;
		surface.data[p+1] = g;
		surface.data[p+2] = b;
		if(applyHanning)
		{
			if(i>=width && i<iPix-width && i%width>0 && i%width<width-1)
			{
				var region = (i-width-1)*4;
				for(var iL=0; iL<36; ++iL)
				{
					var local = region+(iL%12)+(Math.floor(iL/12)*width*4);
					var avg = (surface.data[local]+surface.data[local-4]+surface.data[local+4])/3;
					surface.data[local]=avg;
				}
				for(var iL=0; iL<36; ++iL)
				{
					var local = region+(iL%12)+(Math.floor(iL/12)*width*4);
					var avg = (surface.data[local]+surface.data[local-(width*4)]+surface.data[local+(width*4)])/3;
					surface.data[local]=avg;
				}
			}
		}
	}
	context.putImageData(surface, 0, 0);

	bRendering = false;
}
