
function grabData(dict,mode,board)
{
	var dict = JSON.stringify(dict)
	$.ajax({
		type: 'POST',
	  	dataType: "json",
	  	async: true,
	  	url: '/getdata',
		data: {'data':dict},
	  	success: function(stuff){
			console.log(stuff)			
			if ($("#plots_" + board).length > 0 || $("#plots" + board).length > 0 ) {
				if(mode==1) {
					plot_all_one(stuff['data'],board)
				} else {
					plot_all(stuff['data'])
				}
			}
			else {
			console.log("what the hell do I do with this=" + board)
			console.log(stuff)
			}
		}
	});
	
}

function plot_all(data)
{
	var foo = data;
	var stuff_to_omit = ['Time','id','label']
	
	var options = {
    series: {
      lines: { show: true, fill: false, lineWidth:2 },
      points: { show: true, fill: false, radius:4 },
    },
  	xaxis: {
    	mode: "time",
    	timeformat: "%m/%d %H:%M",
		ticks:5
  	},
  	legend: {
    
    	position: "nw"
    }
  	};

	for (name in foo[0])
	{
		if (stuff_to_omit.indexOf(name) == -1)
		{
			if ($("#flot_"+name).length >0)
			{
				flotfoo = []
				flotfoo.push({'data':flotformat(foo,'Time',name),'label':name});
				$.plot($("#flot_"+name), flotfoo, options);
			}	
		}
	}
	
	if ($("#flot_Power").length >0) {
		flotfoo.push({'data':flotformatPower(foo,'Time'),'label':name + " Power"});
	}
	
}

function plot_all_one(data,board)
{
	var foo = data;
	var stuff_to_omit = ['Time','id','label']
	
	var options = {
    series: {
      lines: { show: true, fill: false, lineWidth:2 },
      points: { show: true, fill: false, radius:3 },
    },
  	xaxis: {
    	mode: "time",
    	timeformat: "%m/%d %H:%M",
		ticks:5
  	},
	yaxis: {
    	min:1.0,
		max:2.0,
  	},
  	legend: {
    
    	position: "nw"
    }
  	};
	
	flotfoo = []   
	for (name in foo[0])
	{
		if (stuff_to_omit.indexOf(name) == -1)
		{
			console.log("name=" + name + "board="+board)
			if ($("#flot_"+name).length >0)
			{
				flotfoo.push({'data':flotformatBMS(foo,'Time',name,0),'label':name + " Cell 0"});
				flotfoo.push({'data':flotformatBMS(foo,'Time',name,1),'label':name + " Cell 1"});
				flotfoo.push({'data':flotformatBMS(foo,'Time',name,2),'label':name + " Cell 2"});
				flotfoo.push({'data':flotformatBMS(foo,'Time',name,3),'label':name + " Cell 3"});
			}	
		}
	}
	$.plot($("#flot_all_" + board), flotfoo, options);
}

function grabSensors1(dict,mode)
{
	var dict = JSON.stringify(dict)
	$.ajax({
			type: 'POST',
		  	dataType: "json",
		  	async: true,
		  	url: '/getsensor1',
			data: {'data':dict},
		  	success: function(stuff){
				
				if ($("#sens1").length > 0 ) {
					render_sensors1(stuff['data'])
				}
				else {
				console.log("what the hell do I do with this")
				console.log(stuff)
				}
			}
	});
		
}

function render_sensors1(data)
{
	var foo = data;
	var  stuff_to_omit = ['id','_id']
		
	for (name in foo[0])
		{
			if (stuff_to_omit.indexOf(name) == -1)
			{
				if (name=="Time") {
					var myDate = new Date( Math.round(foo[0][name]*1000))
					$("#s1_"+name).text(myDate.toLocaleString())
				}
				else if ($("#s1_"+name).length >0)
				{
					$("#sd_"+name+"_0_v").text(Math.round(foo[0][name]["Cells"][0])/1000)
					$("#sd_"+name+"_1_v").text(Math.round(foo[0][name]["Cells"][1])/1000)
					$("#sd_"+name+"_2_v").text(Math.round(foo[0][name]["Cells"][2])/1000)
					$("#sd_"+name+"_3_v").text(Math.round(foo[0][name]["Cells"][3])/1000)
					$("#sd_"+name+"_0_r").text(((Math.round(foo[0][name]["Resisters"])&1) ? 1:0))
					$("#sd_"+name+"_1_r").text(((Math.round(foo[0][name]["Resisters"])&2) ? 1:0))
					$("#sd_"+name+"_2_r").text(((Math.round(foo[0][name]["Resisters"])&4) ? 1:0))
					$("#sd_"+name+"_3_r").text(((Math.round(foo[0][name]["Resisters"])&8) ? 1:0))
					$("#sd_"+name+"_status").text(foo[0][name]["Status"])
				}			
			}
	}

}
	
	
function grabSensors2(dict,mode)
{
	var dict = JSON.stringify(dict)
	$.ajax({
			type: 'POST',
		  	dataType: "json",
		  	async: true,
		  	url: '/getsensor2',
			data: {'data':dict},
		  	success: function(stuff){
				
				if ($("#sens2").length > 0 ) {
					render_sensors2(stuff['data'])
				}
				else {
				console.log("what the hell do I do with this")
				console.log(stuff)
				}
			}
	});
		
}

function render_sensors2(data)
{
	var foo = data;
	var  stuff_to_omit = ['id','_id']
		
	for (name in foo[0])
		{
			if (stuff_to_omit.indexOf(name) == -1)
			{
				if ($("#s2_"+name).length >0)
				{
					if(name=="Time") {
						var myDate = new Date( Math.round(foo[0][name]*1000))
						$("#s2_"+name).text(myDate.toLocaleString())
					} else {
						$("#s2_"+name).text(foo[0][name])
					}
				}
				
			}
	}

}

function flotformatPower(source,xlab) {
		
	var start = source[0][xlab]
	var end = source[source.length - 1][xlab]
	var diff = Math.abs(start - end)
	var avdiff = diff/source.length
	var i, l,
    	dest = [],
    	row;

	for(i = 0, l = source.length; i < l; i++) 
	{ 
    	row = source[i];
		if (i > 0)
		{
			if (Math.abs(source[i][xlab] - source[i-1][xlab]) > avdiff*10) 
			{
				//dest.push("null")
			}
		}
		dest.push([(row[xlab]-4*60*60)*1000, row["Current"]*row["Voltage"]]);
	}
	return dest;
}

function flotformatBMS(source,xlab,ylab,cell) {
	
	console.log("xlab=" + xlab + " ylab=" + ylab)
		
	var start = source[0][xlab]
	var end = source[source.length - 1][xlab]
	var diff = Math.abs(start - end)
	var avdiff = diff/source.length
	var i, l,
    	dest = [],
    	row;

	for(i = 0, l = source.length; i < l; i++) 
	{ 
    	row = source[i];
		if (i > 0)
		{
			if (Math.abs(source[i][xlab] - source[i-1][xlab]) > avdiff*10) 
			{
				//dest.push("null")
			}
		}
		console.log("T=" + (row[xlab]-4*60*60)*1000 +" v(" + cell + ")=" + row[ylab]["Cells"][cell])
		dest.push([(row[xlab]-4*60*60)*1000, row[ylab]["Cells"][cell]/1000]);
	}
	return dest;
}



function flotformat(source,xlab,ylab) {
	var start = source[0][xlab]
	var end = source[source.length - 1][xlab]
	var diff = Math.abs(start - end)
	var avdiff = diff/source.length
	var i, l,
    	dest = [],
    	row;

	for(i = 0, l = source.length; i < l; i++) 
	{ 
    	row = source[i];
		if (i > 0)
		{
			if (Math.abs(source[i][xlab] - source[i-1][xlab]) > avdiff*10) 
			{
				//dest.push("null")
			}
		}
		dest.push([(row[xlab]-4*60*60)*1000, row[ylab]]);
	}
	return dest;
}

$(window).resize(function(){plot_all(foo)})
	