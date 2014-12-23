//Общий план
/**
 * Конструктор объекта План
 * @method Plan
 * @param {} context Контекст в котором будет происходить работа
 * @return 
 */
var Plan = function(context,el){
	this.el=el;
	this.width = false;
	this.height = false;
	this.context = context;
	this.bascground = false;
	this.imageObj = false;
	this.context.imageSmoothingEnabled= true;
	this.polygonFillColor = "rgba(255, 0, 0, 0.5)";
	this.el.style.cursor = "default";
	this.points = Array();
	this.hoverLine = {
		start:false,
		end:false
	};
	this.hoverIndex = false;

	var _plan = this;

	document.addEventListener( "keypress", function(e){
		
		switch(e.keyCode){
			case 127:
			for(var i=0;i<_plan.points.length;i++){
				var point = _plan.points[i];

				if(point.isActive)
					_plan.removePoint(i);
			}
			break;
		}
		
	}, true);

	document.addEventListener('mousemove', function(event){
		switch(event.target.id){
			case 'editor_canvas':
			//Проверяем на какой точке находимся
			plan.checkHover(event.offsetX,event.offsetY);
			break;
			default:
			break;
		}
	}, false);

	document.getElementById('editor_canvas').onclick=function(event){

		//Проверяем, попадает ли угол полигона под клик
		if(plan.checkClick(event.offsetX,event.offsetY)){
			plan.checkClick(event.offsetX,event.offsetY).click();
		}else{
			if(_plan.hoverLine.start&&_plan.hoverLine.end){
				plan.drowPoint(event.offsetX,event.offsetY,_plan.hoverIndex);
			}else{
				plan.drowPoint(event.offsetX,event.offsetY);
			}
			
		}
		

		//Проверяем, попадает ли фигура под клик (подумать)

		//Рисуем точку
		
	};
}

Plan.prototype.polygons = Array();

Plan.prototype.removePoint = function(_index){
	this.points.splice(_index,1);
	this.update();
}

/**
 * Добавляет точку в массив точек
 * @method drowPoint
 * @param {} _X
 * @param {} _Y
 * @return 
 */
Plan.prototype.drowPoint = function(_X,_Y,_index){

	_index = _index||false;

	var _point = new Point(this.context,_X,_Y);
	if(_index){
		this.points.splice(_index,0,_point);
	}else{
		this.points.push(_point);
	}
	
	this.update();
}

/**
 * Заполняет полигон, обозначенный точками
 * @method fillPolygon
 * @param {} _color
 * @return 
 */
Plan.prototype.fillPolygon = function(_color){
	this.context.fillStyle = this.polygonFillColor;

	var colorObj = hexToRgb(plan.polygonHexColor);
	var colorString = 'rgba('+colorObj.r+','+colorObj.g+','+colorObj.b+',1)';

	this.context.strokeStyle=colorString;

	this.context.beginPath();

	for(var i = 0;i<this.points.length;i++){
		var point = this.points[i];
		var last = this.points.length-1;

		switch(i){
			case 0:
			this.context.moveTo(point.x, point.y);
			break;
			case last:
			this.context.lineTo(point.x, point.y);
			this.context.closePath();
			break;
			default:
			this.context.lineTo(point.x, point.y);
			break;
		}
	}
	this.context.closePath();
	this.context.fill();
	this.context.stroke();
}

Plan.prototype.pointToLineDistance = function(_x,_y,_line_start,_line_end){

	var distance = Math.abs(((_line_start.y-_line_end.y)*_x)+((_line_end.x-_line_start.x)*_y)+(_line_start.x*_line_end.y-_line_end.x*_line_start.y))/(Math.sqrt((Math.pow((_line_end.x-_line_start.x),2))+(Math.pow((_line_end.y-_line_start.y),2))));

	var distToStart = Math.sqrt(Math.pow((_x-_line_start.x),2)+Math.pow((_y-_line_start.y),2));
	var distToEnd = Math.sqrt(Math.pow((_x-_line_end.x),2)+Math.pow((_y-_line_end.y),2));
	var lineLength = Math.sqrt(Math.pow((_line_start.x-_line_end.x),2)+Math.pow((_line_start.y-_line_end.y),2));

	if((distToStart<lineLength)&&(distToEnd<lineLength)){
		return distance;
	}else{
		return false;
	}

	//return distance;

}

/**
 * Проверка на попадание в точку
 * @method checkHover
 * @param {} _x
 * @param {} _y
 * @return CallExpression
 */
Plan.prototype.checkHover = function(_x,_y){
	this.el.focus();
	var point = this.checkPoints(_x,_y);

	if(point&&point.isHover&&!point.isActive)
		this.el.style.cursor = "pointer";

	this.hoverLine.start = false;
	this.hoverLine.end = false;
	this.hoverIndex = false;

	for(var i = 0;i<this.points.length;i++){
		var point = this.points[i];

		if(this.points.length>1){
			var nextIndex = i+1;

			if(nextIndex>=this.points.length)
				nextIndex=0;

			var nextPoint = this.points[nextIndex];

			var dist = this.pointToLineDistance(_x,_y,point,nextPoint);

			if((dist!==false)&&(Math.abs(dist)<3)){
				this.hoverLine.start = point;
				this.hoverIndex = nextIndex;
				this.hoverLine.end = nextPoint;
				this.el.style.cursor = "url(data:application/cur;base64,AAACAAEAICAAAAAAAACoEAAAFgAAACgAAAAgAAAAQAAAAAEAIAAAAAAAgBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD+AAAA/gAAAP4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/v////7////+AAAA/gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD+/////v////4AAAD+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/v////7////+AAAA/gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/gAAAAAAAAAAAAAAAAAAAAAAAAD+/////v////4AAAD+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD+AAAA/gAAAAAAAAAAAAAA/v////7////+AAAA/gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP7////+AAAA/gAAAAAAAAD+/////v////4AAAD+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/v////7////+AAAA/v////7////+AAAA/gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD+/////v////7////+/////v////4AAAD+AAAA/gAAAP4AAAD+AAAA/gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP7////+/////v////7////+/////v////7////+/////gAAAP4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/v////7////+/////v////7////+/////v////4AAAD+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD+/////v////7////+/////v////7////+AAAA/gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP7////+/////v////7////+/////gAAAP4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/v////7////+/////v////4AAAD+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD+/////v////7////+AAAA/gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP7////+/////gAAAP4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/v////4AAAD+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD+AAAA/gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//////////////////////////////////////////////////////////////////////4////8P////D////h///94f///MP///xD///8B////AB///wA///8Af///AP///wH3//8D9///B/f//w+A//8f9///P/f//3/3//8=), auto";
			}
		}
	};
	this.update();
	return point;
}

/**
 * Description
 * @method checkClick
 * @param {} _x
 * @param {} _y
 * @return CallExpression
 */
Plan.prototype.checkClick = function(_x,_y){
	
	var point = this.checkPoints(_x,_y);

	if(point&&point.isActive);
		this.el.style.cursor = "move";
	return point;
}

/**
 * Поиск точек, подходящих под заданные координаты
 * @method checkPoints
 * @param {} _x
 * @param {} _y
 * @return res
 */
Plan.prototype.checkPoints = function(_x,_y){
	var res = false;
	var hover = false;
	var active = false;
	for(var i = 0;i<this.points.length;i++){
		var point = this.points[i];


		

		if(point.isActive){
			active = true;
			point.x= _x;
			point.y= _y;
			this.update();
		}

		if(point.check(_x,_y)){
			hover = true;
			res = point;
		}

	};

	if(hover)
		this.el.style.cursor = "pointer";
	else
		this.el.style.cursor = "default";

	if(active)
		this.el.style.cursor = "move";
	else
		this.el.style.cursor = "default";

	return res;
}

/**
 * Загрузка изображения
 * @method loadImage
 * @return 
 */
Plan.prototype.loadImage = function(_src){
	if(!this.imageObj){
		var imageObj = new Image();

		var t = this;

		/**
		 * Description
		 * @method onload
		 * @return 
		 */
		imageObj.onload = function() {
			console.log(imageObj);
			t.context.canvas.width  = imageObj.width;
			t.context.canvas.height = imageObj.height;
			t.imageObj = imageObj;
			t.drawImage();
			
		};

		imageObj.src=_src;//$('#plan_edit_src').attr('src');
	}else{
		this.drawImage();
	}


}

/**
 * отрисовка загруженного изображения
 * @method drawImage
 * @return 
 */
Plan.prototype.drawImage = function(){
	this.context.drawImage(this.imageObj,0,0);
}

/**
 * Обновление холста
 * @method update
 * @return 
 */
Plan.prototype.update = function(){

	this.context.rect(0,0,this.context.canvas.width,this.context.canvas.height);
	this.context.fillStyle="white";
	this.context.fill();

	this.loadImage();

	this.fillPolygon();

	if(this.hoverLine.start&&this.hoverLine.end){
		this.context.beginPath();
		this.context.moveTo(this.hoverLine.start.x,this.hoverLine.start.y);
		this.context.lineTo(this.hoverLine.end.x,this.hoverLine.end.y);
		this.context.closePath();
		this.context.strokeStyle="#FF0000";
		this.context.stroke();
	}
	

	for(var i = 0;i<this.points.length;i++){
		var point = this.points[i];
		point.draw();
	}
}

/**
 * Генерация тега area по заданныйм точкам
 * @method generateMapArea
 * @return area
 */
Plan.prototype.generateMapArea = function(){
	var area = document.createElement('AREA');
	area.setAttribute('shape','poly');

	var coords = '';

	for(var i = 0;i<this.points.length;i++){
		var point = this.points[i];
		coords += point.x+',';
		coords += point.y+',';
	}

	area.setAttribute('coords',coords);
	return area;
}

Plan.prototype.generateCoords = function(){

	var coords = '';

	for(var i = 0;i<this.points.length;i++){
		var point = this.points[i];
		coords += point.x+',';
		coords += point.y+',';
	}

	return coords;
}

Plan.prototype.getHexColor = function(){
	return this.polygonHexColor;
}

//Точка на плане
/**
 * Description
 * @method Point
 * @param {} context
 * @param {} _X
 * @param {} _Y
 * @return 
 */
var Point = function(context,_X,_Y,parent){

	this.radius = 3;
	this.x = _X;
	this.y = _Y;
	this.context = context;
	this.parent = parent;

	this.color = '#00AA00';
	this.colorNorm = '#00AA00';
	this.colorHover = '#88FF88';
	this.colorActive = '#FFFFFF';
	this.isActive = false;
	this.isHover = false;

	this.context.beginPath();
	this.context.arc(_X, _Y, this.radius, 0, 2 * Math.PI, false);
	this.context.fillStyle = this.color;
	this.context.fill();
	this.context.lineWidth = 1;
	this.context.strokeStyle = '#003300';
	this.context.stroke();

	this.setActive(!this.isActive);
}

/**
 * Description
 * @method draw
 * @return 
 */
Point.prototype.draw = function(){
	this.context.beginPath();
	this.context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
	this.context.fillStyle = this.color;
	this.context.fill();
	this.context.lineWidth = 1;
	this.context.strokeStyle = '#003300';
	this.context.stroke();
}

/**
 * Description
 * @method check
 * @param {} _x
 * @param {} _y
 * @return BinaryExpression
 */
Point.prototype.check = function(_x,_y){
	var distance = Math.sqrt(Math.pow((_x-this.x),2)+Math.pow((_y-this.y),2));
	
	if(!this.isActive)
		this.setHover(distance<=this.radius);
	return (distance<=this.radius);
}

/**
 * Description
 * @method click
 * @return 
 */
Point.prototype.click = function(){
	this.setActive(!this.isActive);
}

/**
 * Description
 * @method setHover
 * @param {} _state
 * @return 
 */
Point.prototype.setHover = function(_state){
	if(_state){
		this.color = this.colorHover;
	}else{
		this.color = this.colorNorm;
	}
	this.isHover = _state;
	this.draw();
}

/**
 * Description
 * @method setActive
 * @param {} _state
 * @return 
 */
Point.prototype.setActive = function(_state){
	if(_state){
		this.color = this.colorActive;
	}else{
		this.color = this.colorNorm;
	}
	this.isActive = _state;
	this.draw();
}

/**
 * Description
 * @method Polygon
 * @return 
 */
var Polygon = function(){

}