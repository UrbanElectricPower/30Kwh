
	//Globals
	var options = {
	    yaxis: { },
	    xaxis: { mode: "time" },
		points: {
			show: true ,
			radius: .5},
		lines: { show: true},
		selection: { mode: "x" }
		
	};
	
	function grabData(dict,mode)
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
				if ($("#plots").length > 0 ) {
					if(mode==1) {
						plot_all_one(stuff['data'])
					} else {
						plot_all(stuff['data'])
					}
				}
				else {
				console.log("what the hell do I do with this")
				console.log(stuff)
				}
			}
		});
		
	}
	
	function grabSensors(dict,mode)
	{
		var dict = JSON.stringify(dict)
		$.ajax({
			type: 'POST',
		  	dataType: "json",
		  	async: true,
		  	url: '/getsensor',
			data: {'data':dict},
		  	success: function(stuff){
				
				if ($("#sens").length > 0 ) {
					render_sensors(stuff['data'])
					console.log(stuff)
				}
				else {
				console.log("what the hell do I do with this")
				console.log(stuff)
				}
			}
		});
		
	}
	
	
	function manageControl(dict,url)
	{
		$.ajax({
			type: 'POST',
		  	dataType: "json",
		  	async: true,
		  	url: url,
			data: dict,
		  	success: function(stuff){
				
				if ($("#cont").length > 0 ) {
					render_controls(stuff['data'])
				}
				else {
				console.log("what the hell do I do with this")
				console.log(stuff)
				}
			}
		});
		
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
			dest.push([row[xlab], row[ylab]]);
    	}
    	return dest;
	}
	
	foo = []
	
	function render_sensors(data)
	{
		var foo = data;
		var  stuff_to_omit = ['id']
		
		for (name in foo[0])
		{
			if (stuff_to_omit.indexOf(name) == -1)
			{
				if ($("#s_"+name).length >0)
				{
					$("#s_"+name).text(Math.round(foo[0][name]))
				}
				
			}
		}

	}
	
	function render_controls(data)
	{
		var foo = data;
		var  stuff_to_omit = ['id']
		
		for (name in foo[0])
		{
			if (stuff_to_omit.indexOf(name) == -1)
			{
				console.log("name="+name + " value="+foo[0][name])
				
				if ($("#c_"+name).length >0)
				{
					console.log("name="+name + " value="+foo[0][name])
					
					$("#c_"+ name).val(foo[0][name])
				}
				
			}
		}

	}
	
	function plot_all(data)
	{
		label_list=[];
		label_list["soc"]="State of Charge (0-100) -- Last Reading: " + write_date(new Date)
		label_list["meter"]="Metered Power (kW) -- Last Reading: " + write_date(new Date)
		label_list["load"]="Building Load (kW) -- Last Reading: " + write_date(new Date)
		label_list["power"]="Battery Power -- Last Reading: " + write_date(new Date)
		
		var options = {
	    series: {
	      lines: { show: true, fill: false, lineWidth:8 },
	      points: { show: true, fill: false, radius:5 },
	    },
	  	xaxis: {
	    	mode: "time",
	    	timeformat: "%m/%d %H:%M",
			ticks:13
	  	},
	  	legend: {
	    
	    	position: "nw"
	    }
	  	};
		
		var foo = data;
		var stuff_to_omit = ['time','id']
		
		
		for (name in foo[0])
		{
			if (stuff_to_omit.indexOf(name) == -1)
			{
				if ($("#flot_"+name).length >0)
				{
					flotfoo = []
					var label=name
					if(label_list[name].length>0) label=label_list[name]		   
					flotfoo.push({'data':flotformat(foo,'time',name),'label':label});
					$.plot($("#flot_"+name), flotfoo,options);
				}
				
			}
		}

	}
	
	function plot_all_one(data)
	{
		
		label_list=[];
		label_list["soc"]="State of Charge (0-100) -- Last Reading: " + write_date(new Date)
		label_list["meter"]="Metered Power (kW) -- Last Reading: " + write_date(new Date)
		label_list["load"]="Building Load (kW) -- Last Reading: " + write_date(new Date)
		label_list["power"]="Battery Power -- Last Reading: " + write_date(new Date)
		
		var options = {
	    series: {
	      lines: { show: true, fill: false, lineWidth:8 },
	      points: { show: true, fill: false, radius:5 },
	    },
	  	xaxis: {
	    	mode: "time",
	    	timeformat: "%m/%d %H:%M",
			ticks:13
	  	},
	  	legend: {
	    
	    	position: "nw"
	    }
	  	};
		
		var foo = data;
		var stuff_to_omit = ['time','id']
		
		flotfoo = []   
		for (name in foo[0])
		{
			if (stuff_to_omit.indexOf(name) == -1)
			{
				if ($("#flot_"+name).length >0)
				{
					var label=name
					if(label_list[name].length>0) label=label_list[name]
					flotfoo.push({'data':flotformat(foo,'time',name),'label':label});
				}
				
			}
		}
		$.plot($("#flot_all"), flotfoo,options);
		

	}
	
	function plot_all_range(event,ranges)
	{
		options['xaxis']['min'] = ranges.xaxis.from;
		options['xaxis']['max'] = ranges.xaxis.to;
		plot_all(foo)
	}
	
	function write_date(date) {
	
		var day  = date.getDate(); // get the day that date relates to
		day = day < 10 ? '0' + day : day; // add a 0 if less that 10
		
		var month = date.getMonth() + 1; // returns month as 0 - 11
		
		var year = date.getFullYear(); // 4 digit year (eg. 2011)
		
		var hour = date.getHours(); // get hours
		hour = hour<10?'0'+hour:hour; // pad with a 0
		
		var minute = date.getMinutes(); // and minutes
		minute = minute<10?'0'+minute:minute; // pad with 0
		
		var second = date.getSeconds(); // get seconds
		second = second<10?'0'+second:second; // pad with 0
	
		return month + "/" + day + "/" + year + " " + hour + ":" + minute + ":" + second
	}	
	
	
	
	
	$(window).resize(function(){plot_all(foo)})
	