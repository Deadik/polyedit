//Общий план
var Plan = function(context){
	this.width = false;
	this.height = false;
	this.context = context;
	this.bascground = false;
	this.imageObj = false;
}

Plan.prototype.points = Array();
Plan.prototype.polygons = Array();

Plan.prototype.drowPoint = function(_X,_Y){
	var _point = new Point(this.context,_X,_Y);
	this.points.push(_point);
	this.update();
}

Plan.prototype.fillPolygon = function(_color){
	this.context.fillStyle = "rgba(255, 0, 0, 0.5)";
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
}

Plan.prototype.checkHover = function(_x,_y){
	return this.checkPoints(_x,_y);
}

Plan.prototype.checkClick = function(_x,_y){
	return this.checkPoints(_x,_y);
}

Plan.prototype.checkPoints = function(_x,_y){
	var res = false;
	for(var i = 0;i<this.points.length;i++){
		var point = this.points[i];

		if(point.isActive){
			point.x= _x;
			point.y= _y;
			this.update();
		}

		if(point.check(_x,_y)){
			res = point;
		}
	};
	return res;
}

Plan.prototype.loadImage = function(){
	if(!this.imageObj){
		var imageObj = new Image();

		var t = this;

		imageObj.onload = function() {
			console.log(imageObj);
			t.context.canvas.width  = imageObj.width;
			t.context.canvas.height = imageObj.height;
			t.imageObj = imageObj;
			t.drawImage();
			
		};

		imageObj.src=document.getElementById('plan_edit_src').getAttribute('src');//$('#plan_edit_src').attr('src');
	}else{
		this.drawImage();
	}


}

Plan.prototype.drawImage = function(){
	this.context.drawImage(this.imageObj,0,0);
}

Plan.prototype.update = function(){

	this.context.rect(0,0,this.context.canvas.width,this.context.canvas.height);
	this.context.fillStyle="white";
	this.context.fill();

	this.loadImage();

	this.fillPolygon();

	for(var i = 0;i<this.points.length;i++){
		var point = this.points[i];
		point.draw();
	}
}

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
//Точка на плане
var Point = function(context,_X,_Y){

	this.radius = 2;
	this.x = _X;
	this.y = _Y;
	this.context = context;

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

Point.prototype.draw = function(){
	this.context.beginPath();
	this.context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
	this.context.fillStyle = this.color;
	this.context.fill();
	this.context.lineWidth = 1;
	this.context.strokeStyle = '#003300';
	this.context.stroke();
}

Point.prototype.check = function(_x,_y){
	var distance = Math.sqrt(Math.pow((_x-this.x),2)+Math.pow((_y-this.y),2));
	
	if(!this.isActive)
		this.setHover(distance<=this.radius);
	return (distance<=this.radius);
}

Point.prototype.click = function(){
	this.setActive(!this.isActive);
}

Point.prototype.setHover = function(_state){
	if(_state){
		this.color = this.colorHover;
		
	}else{
		this.color = this.colorNorm;
	}
	this.isHover = _state;
	this.draw();
}

Point.prototype.setActive = function(_state){
	if(_state)
		this.color = this.colorActive;
	else
		this.color = this.colorNorm;
	this.isActive = _state;
	this.draw();
}

var Polygon = function(){

}

var plan;

//$(document).ready(function(){
	//$('#plan_edit_src').mapster();
document.addEventListener("DOMContentLoaded", function(event) { 
	var canvas = document.getElementById("editor_canvas"); 
	var ctx = canvas.getContext('2d');

	plan = new Plan(ctx);
	plan.loadImage();
	//or however you get a handle to the IMG

	document.getElementById('get_area').onclick=function(event){
		var el = plan.generateMapArea();
		console.log(el);
	}

	//Обрабатываем клики
	document.getElementById('editor_canvas').onclick=function(event){

		//Проверяем, попадает ли угол полигона под клик
		if(plan.checkClick(event.offsetX,event.offsetY)){
			plan.checkClick(event.offsetX,event.offsetY).click();
		}else{
			plan.drowPoint(event.offsetX,event.offsetY);
		}
		

		//Проверяем, попадает ли фигура под клик (подумать)

		//Рисуем точку
		
	};
});

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