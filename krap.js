
var krapAttr = {
    width: 'width',
    height: 'height',
    id: 'id',
    class: 'class',
    undefined: 'undefined'
};
var errorMessages = {
    inf: 'id is not found',
    stw: 'How did it come here. Some thing went seriously wrong.',
    cou: 'Create object first and use it'
};
var fnSvgElement = {
    newElement: 'undefined',
    createNewElement: function (element) {
        this.newElement = document.createElementNS("http://www.w3.org/2000/svg", element);
        return this;
    },
    addAttribute: function (key, value) {
        if (this.newElement !== 'undefined')
            this.newElement.setAttribute(key, value);
        else {
            throw 'createNewElement then add attribute';
        }
        return this;
    },
    addText: function (text) {
        if (this.newElement !== 'undefined') {
            this.newElement.appendChild(document.createTextNode(text));
        } else {
            throw 'createNewElement then add text';
        }
        return this;
    },
    toDomString: function () {
        return this.newElement;
    }
};
var newObj ={
	bar:function(){
		var b = Object.assign({},krapBar);
		return b;
	}
}

var mEvent = {
	
	up:function(e){
		console.log('up');
	},
	down:function(event,d){
		d='down';
		console.log('down');
	}
}


var krapUtil = {
    calcTot: function (data) {
        var tot = data.reduce(function (previousValue, currentValue) {
            return previousValue + currentValue;
        });
        return tot;
    },
    getPosition: function (el) {
        var rect = el.getBoundingClientRect(),
                scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
                scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        return {x: rect.top + scrollTop, y: rect.left + scrollLeft};
    },
	getSubArray:function(arr,start,end){
		return arr.slice(start,end+1);
	}
};

var krapStats = {
    calcRangeOnSorted: function (arr) {
        var len = arr.length;
        var range = (arr[len-1] - arr[0]) / (len-1);
        return range;
    },
    calcRangeOnNonSortedData: function (arr) {
        arr.sort(function(a,b){
            return a-b;
        });
        console.log(arr);
        var len = arr.length;
        var range = (arr[len-1] - arr[0]) / (len-1);
        return Math.round(range);
    }
};

var set = {
    text: function (x, y, text, style,tclass,font,fontSize) {
        var t_node = fnSvgElement.createNewElement('text')
                .addAttribute('x', x)
                .addAttribute('y', y)
                .addText(text)
                .addAttribute('class',tclass)
                .addAttribute('font-family',font)
                .addAttribute('font-size',fontSize)
                .toDomString();
        return t_node;
    },
    tick: function(x1,x2,y2,stroke_size,stroke_color){
        var tick = fnSvgElement.createNewElement('line')
                .addAttribute('x1', x1)
                .addAttribute('y1', y2)
                .addAttribute('x2', x2)
                .addAttribute('y2', y2)
                .addAttribute('class', 'tick')
                .addAttribute('stroke-width', stroke_size)
                .addAttribute('stroke', stroke_color)
                .addAttribute('fill', stroke_color)
                .toDomString();
        return tick;        
    },
    bar: function(x,y,barWidth,barHeight,barClass){
        var bar = fnSvgElement.createNewElement('rect')
                .addAttribute('x', x)
                .addAttribute('y', y)
                .addAttribute('width', barWidth)
                .addAttribute('height', barHeight)
                .addAttribute('class', barClass)
                .toDomString();
            return bar;
    }
    
};


function generateArcSector(svg, cX, cY, radius, datum, colour, iniA, endA, sweep) {
    cX = parseInt(cX);
    cY = parseInt(cY);
    radius = parseInt(radius);
    iniA = parseInt(iniA);
    var x1 = cX + radius * Math.cos((iniA) * Math.PI / 180);
    var y1 = cY + radius * Math.sin((iniA) * Math.PI / 180);

    var x2 = cX + radius * Math.cos((endA) * Math.PI / 180);
    var y2 = cY + radius * Math.sin((endA) * Math.PI / 180);

    var path = 'M' + cX + ',' + cY + ' L' + x1 + ',' + y1 + ' A' + radius + ',' + radius + ' 0 ' + sweep + ',1 ' + x2 + ',' + y2 + ' z';
    console.log(path);
    var pathNode = fnSvgElement.createNewElement('path')
            .addAttribute('d', path)
            .addAttribute('stroke-width', '0.1')
            .addAttribute('class', 'conic')
            .addAttribute('stroke', 'black')
            .addAttribute('data-name', 'test')
            .addAttribute('fill', colour)
            .toDomString();
    svg.appendChild(pathNode);
}
var sketch = {
};

krapException = {
    generalCheck: function (actual, expected) {
        if (actual === expected) {
            return !0;
        } else {
            return !1;
        }
    },
    checkId: function (id) {
        if (this.generalCheck(id, null)) {
            throw Error(errorMessages.inf);
        } else {
            return !0;
        }
    },
    checkObject: function (obj) {
        if (this.generalCheck(obj, krapAttr.undefined)) {
            throw Error(errorMessages.cou);
        } else {
            return !0;
        }
    }

};

var krapPie = {
    svgObject: 'undefined',
    properties: {
        width: '',
        height: '',
        data: [],
        colours: []
    },
    create: function (eleId) {
        var div = document.getElementById(eleId);
        if (krapException.checkId(div)) {
            this.svgObject = fnSvgElement.createNewElement('svg')
                    .addAttribute('width', this.properties.width)
                    .addAttribute('height', this.properties.height)
                    .toDomString();
            div.appendChild(this.svgObject);
            return this;
        } else {
            throw Error(errorMessages.stw);
        }
    },
    generate: function () {
        var ht = parseInt(this.properties.height);
        var wt = parseInt(this.properties.width);
        var tot = krapUtil.calcTot(this.properties.data);
        var radius = (ht + wt) / 4 - (0.3 * ((ht + wt) / 4));
        console.log('radius' + ' ' + ((ht + wt) / 2) + ' ' + (0.3 * ((ht + wt) / 2)) + ' ' + radius);
        var len = this.properties.data.length;
        var cl = this.properties.colours.length;
        var iniA = 0;
        var endA = 0;
        var cord = krapUtil.getPosition(this.svgObject);
        console.log(cord);
        var cx = parseInt(cord.x) + (wt / 2);
        var cy = parseInt(cord.y) + (ht / 2);
        var sweep = 0;
        gobj = fnSvgElement.createNewElement('g')
                .addAttribute('transform', 'translate(-8,-8)')
                .toDomString();

        for (var i = 0; i < len; i++) {
            endA = iniA + ((360 * this.properties.data[i]) / tot);
            console.log(cx + ' ' + cy + ' ' + this.properties.data + ' ' + len + ' ' + iniA + ' ' + endA + ' ' + tot + ' ' + radius);

            if (this.properties.data[i] > (tot / 2))
            {
                sweep = 1;
            }
            generateArcSector(gobj, cx, cy, radius, this.properties.data[i], this.properties.colours[i % cl], iniA, endA, sweep);
            iniA = endA;

        }
        this.svgObject.appendChild(gobj);
    },
    attribute: function (attr, value) {
        krapException.checkObject(this.svgObject);
        this.properties[attr] = value;
        this.svgObject.setAttribute(attr, value);
        return this;
    },
    data: function (dt) {
        krapException.checkObject(this.svgObject);
        this.properties.data = dt;
        this.generate();
        return this;
    }
};

var svg = {
    svgObj: 'undefined',
    generate: function (height, width) {
        this.svgObj = fnSvgElement.createNewElement('svg')
                .addAttribute('width', width)
                .addAttribute('height', height)
                .toDomString();
        return this.svgObj;
    }
};


var axis = {
    props: {
        'SX': 0,
        'SY': 0,
        'OX': 0,
        'OY': 0,
        'EX': 0,
        'EY': 0,
        'LOX': 0,
        'LOY': 0,
        'svg': '',
        'xdataRotation': 90,
        'xCords': [],
        'yCords': [],
        'yTickLabels': [],
        'baseUnit' : 0
    },
    generateXAxis: function () {
        var xPath = pathG.move(this.props.SX, this.props.SY) + ' ' + pathG.lineTo(this.props.OX, this.props.OY);
        pathObj = fnSvgElement.createNewElement('path')
                .addAttribute('d', xPath)
                .addAttribute('stroke-width', '1')
                .addAttribute('class', 'xAxis')
                .addAttribute('stroke', 'black')
                .addAttribute('fill', 'none')
                .toDomString();
        this.props.svg.appendChild(pathObj);

    },
    generateYAxis: function () {
        var yPath = pathG.move(this.props.OX, this.props.OY) + ' ' + pathG.lineTo(this.props.EX, this.props.EY);
        pathObj = fnSvgElement.createNewElement('path')
                .addAttribute('d', yPath)
                .addAttribute('stroke-width', '1')
                .addAttribute('class', 'yAxis')
                .addAttribute('stroke', 'black')
                .addAttribute('fill', 'none')
                .toDomString();
        this.props.svg.appendChild(pathObj);
    },
    calculateAxis: function (width, height) {
        var startX = this.props.SX = (0.1) * width;
        var startY = this.props.SY = (0.05) * height;
        var oX = this.props.OX = startX;
        var oY = this.props.OY = height - (0.1 * height);
        var endX = this.props.EX = width - (0.06 * width);
        var endY = this.props.EY = oY;
        var lengthOfYAxis = this.props.LOY = oY - startY;
        var lengthOfXAxis = this.props.LOX = endX - oX;
        console.log(width);
    },
    addYAxisTicks: function () {
        var x = this.props.SX;
        var y = [];
        var y_text = [];
        var oy = this.props.OY;
        var len = this.props.yTickLabels.length 

        if( len === 0)
        {
            var ycords = this.props.yCords;
            var length = ycords.length;
            var range = krapStats.calcRangeOnNonSortedData(ycords);
            var i = 0;
            var max = ycords[length - 1];
            var iniT = ycords[0];
            var scaleF = 0;
            if (max % range === 0)
                scaleF = (max / range);
            else
                scaleF = (max / range) + 1;
            var a_diff = this.props.LOY / (scaleF+1);
            console.log(range+' '+a_diff+' '+scaleF);
            
            var ny = oy;
            y.push(ny);
            y_text.push(iniT-range);
            for (var i = 0; i <=scaleF; i++) {
                ny = ny - a_diff;
                y.push(ny);
                y_text.push((range)*i+iniT);
            }
            
        } else {
            var yt = this.props.yTickLabels;
            var loy = this.props.LOY;
            for (var data in yt)
            {
                y_text.push(data);
                var y_point = yt[data];
                var ny = oy - (y_point * loy);
                y.push(ny);
            }

        }
       for(var i in y){
           this.props.svg.appendChild(set.tick(x-5,x-1,y[i],1,'black'));
           var text = y_text[i];
           var tlen = 3*text.toString().length;
           this.props.svg.appendChild(set.text(x-(tlen+15),y[i],text,'', 'ylabel','verdana','8'));
       }
       console.log(y_text+' '+'text'+' '+y);
       this.props.yTickLabels=y_text;
       this.props.aDiff = a_diff/range;
       this.props.baseUnit = y_text[0];
    },
    generateSimpleAxis: function (svgObj, xcords, ycords, yticks, xdataR, height, width) {
        this.props.svg = svgObj;
        this.props.xCords = xcords;
        this.props.yCords = ycords;
        this.props.yTickLabels = yticks;
        this.props.xdataRotation = xdataR;
        this.calculateAxis(width, height);
        this.generateXAxis();
        this.generateYAxis();
        this.addYAxisTicks();

    },
    generateMesh: function () {

    }
};

var pathG = {
    move: function (x, y) {
        return 'M' + x + ',' + y;
    },
    lineTo: function (x, y) {
        return 'L' + x + ',' + y;
    },
    completePath: function () {
        return 'z';
    }
};

var chart = {
    pie: function (id, props) {
        for (var i in props) {
            krapPie.properties[i] = props[i];

        }
        krapPie.create(id);
        krapPie.generate();
    },
    bar: function (id, props) {
        var bar = newObj.bar();
		
		for (var i in props) {
            bar.props[i] = props[i];
        }
        bar.generate(id);


    },
    line: function () {

    }
};

var krapBar = {
    props: {
        'width': 400,
        'height': 400,
        'data': {},
        'xCords': [],
        'yCords': [],
        'yCordsSorted': [],
        'divId': 'undefined',
        'datumsPerScreen': 4,
        'colours': {},
        'barColours': 'blue',
        'yTickLabels': {},
        'svgObj': 'undefined',
        'axisType': 'generateSimpleAxis',
        'aProps': {},
		'down' : false,
		'prevPos': 0,
		'start':0,
		'end':0,
		'length':0,
		'groupBar':'undefined'
    },
	removeBars:function(){
		var group = document.getElementsByClassName('bargroup')[0];
		
	},
    dragSvg : function(event){
        //console.log(event);
		if(this.props.down == true){
			console.log(event);
			var presentPos = event.screenX;
			if(this.props.prevPos!=0){
				var diff = (presentPos-this.props.prevPos);
				
				if(diff<-2&&this.props.end<this.props.length){
					console.log('left');
					this.props.start= this.props.start+1;
					this.props.end = this.props.end+1;
					console.log('test'+this.props.groupBar)
					this.props.svgObj.removeChild(this.props.groupBar);
					this.generateBars(this.props.start,this.props.end);
										console.log('groups is '+this.props.svgObj)

				}
				if(diff>2&&this.props.start>=0){
					console.log('right');
					this.props.start= this.props.start-1;
					this.props.end = this.props.end-1;
					console.log('test'+this.props.groupBar)
					this.props.svgObj.removeChild(this.props.groupBar);
					this.generateBars(this.props.start,this.props.end);
										console.log('groups is '+this.props.svgObj)

				}
			}
			this.props.prevPos= presentPos
		}
    },
	mousedown : function(event){
		
		this.props.down=true;
		console.log(this.props.down);
	},
	mouseup : function(event){
		this.props.down=false;
	console.log(this.props.down);
	},
	test:function(event){
		console.log(event);
	},
    generateBars : function(start,end){
		console.log('start and end'+start+' '+end+' '+this.props.aProps.baseUnit)
        var L = this.props.aProps.yTickLabels.length;
        var max = this.props.aProps.yTickLabels[L-1];
        var LOY = this.props.aProps.LOY;
        var LOX = this.props.aProps.LOX;
        var oX =  this.props.aProps.OX;
        var oY =  this.props.aProps.OY;
        var bps = end-start+1;
        var svg = this.props.svgObj;
        var barWidth =  LOX/(2*bps);
        var distBtwBar = LOX/(2*bps);
        var x = oX+distBtwBar;
        var y = oY;
        console.log(max+'max'+' '+this.props.aProps.yTickLabels[L-1]+' '+this.props.aProps.yTickLabels[0]);
		var group = fnSvgElement.createNewElement('g')
					.addAttribute('class','bargroup')
					.toDomString();
					console.log('group is' +group);
					
        for(var i=start;i<=end;i++){
            var barHeight = ((parseInt(this.props.yCords[i-1])-this.props.aProps.baseUnit)*this.props.aProps.aDiff);
            barPosition = oY-barHeight;
            var bar = set.bar(x,barPosition,barWidth,barHeight,'chartBar');
                x=x+barWidth+distBtwBar;
                console.log(x+' '+oY+' '+barHeight);
            group.appendChild(bar);
        }
		this.props.groupBar = group;
		svg.appendChild(group);
        console.log(barWidth+' '+distBtwBar);
        
        
    },
    generate: function (id, properties) {
        this.props.divId = id;
        for (var i in properties) {
            this.props[i] = properties[i];
        }
        var data = this.props['data'];
        var xCords = [];
        var yCords = [];
        for (var i in data) {
            xCords.push(i);
            yCords.push(data[i]);
        }
        this.props.xCords = xCords;
        this.props.yCords = yCords;
		this.props.length = yCords.length;
        this.props.yCordsSorted = Object.assign([],yCords);
        this.props.svgObj = svg.generate(this.props.height, this.props.width);
        window['axis'][this.props.axisType](this.props.svgObj, xCords, this.props.yCordsSorted,[],0, this.props.height, this.props.width);    
        document.getElementById(id).appendChild(this.props.svgObj);
        this.props.aProps = axis.props;
        this.generateBars(1,this.props.datumsPerScreen);
		this.props.start=1;
		this.props.end=this.props.datumsPerScreen;
		  //this.props.svgObj.addEventListener('drag',this.test.bind(this));
        this.props.svgObj.addEventListener('mousemove',this.dragSvg.bind(this));
		this.props.svgObj.addEventListener('mousedown',this.mousedown.bind(this));
        this.props.svgObj.addEventListener('mouseup',this.mouseup.bind(this));
    }
}; 