var plan;

var jsonString = '[{"_id":1445108724041,"_name":8,"points":[],"isActive":false,"fillColor":"#888888","strokeColor":"#666666","transparency":"0.5"},{"_id":1445108723850,"_name":7,"points":[],"isActive":false,"fillColor":"#888888","strokeColor":"#666666","transparency":"0.5"},{"_id":1445108723665,"_name":6,"points":[],"isActive":false,"fillColor":"#888888","strokeColor":"#666666","transparency":"0.5"},{"_id":1445108723497,"_name":5,"points":[{"radius":3,"x":76,"y":91,"context":{},"color":"#00AA00","colorNorm":"#00AA00","colorHover":"#88FF88","colorActive":"#FFFFFF","isActive":false,"isHover":false},{"radius":3,"x":149,"y":31,"context":{},"color":"#00AA00","colorNorm":"#00AA00","colorHover":"#88FF88","colorActive":"#FFFFFF","isActive":false,"isHover":false},{"radius":3,"x":164,"y":132,"context":{},"color":"#00AA00","colorNorm":"#00AA00","colorHover":"#88FF88","colorActive":"#FFFFFF","isActive":false,"isHover":false}],"isActive":false,"fillColor":"#888888","strokeColor":"#666666","transparency":"0.5"},{"_id":1445108723289,"_name":4,"points":[],"isActive":false,"fillColor":"#888888","strokeColor":"#666666","transparency":"0.5"},{"_id":1445108723081,"_name":3,"points":[{"radius":3,"x":444,"y":71,"context":{},"color":"#00AA00","colorNorm":"#00AA00","colorHover":"#88FF88","colorActive":"#FFFFFF","isActive":false,"isHover":false},{"radius":3,"x":460,"y":130,"context":{},"color":"#00AA00","colorNorm":"#00AA00","colorHover":"#88FF88","colorActive":"#FFFFFF","isActive":false,"isHover":false},{"radius":3,"x":670,"y":114,"context":{},"color":"#00AA00","colorNorm":"#00AA00","colorHover":"#88FF88","colorActive":"#FFFFFF","isActive":false,"isHover":false},{"radius":3,"x":527,"y":100,"context":{},"color":"#00AA00","colorNorm":"#00AA00","colorHover":"#88FF88","colorActive":"#FFFFFF","isActive":false,"isHover":false},{"radius":3,"x":614,"y":48,"context":{},"color":"#00AA00","colorNorm":"#00AA00","colorHover":"#88FF88","colorActive":"#FFFFFF","isActive":false,"isHover":false},{"radius":3,"x":508,"y":76,"context":{},"color":"#00AA00","colorNorm":"#00AA00","colorHover":"#88FF88","colorActive":"#FFFFFF","isActive":false,"isHover":false},{"radius":3,"x":606,"y":22,"context":{},"color":"#00AA00","colorNorm":"#00AA00","colorHover":"#88FF88","colorActive":"#FFFFFF","isActive":false,"isHover":false}],"isActive":false,"fillColor":"#888888","strokeColor":"#666666","transparency":"0.5"},{"_id":1445108722689,"_name":2,"points":[{"radius":3,"x":961,"y":4,"context":{},"color":"#00AA00","colorNorm":"#00AA00","colorHover":"#88FF88","colorActive":"#FFFFFF","isActive":false,"isHover":false},{"radius":3,"x":961,"y":156,"context":{},"color":"#00AA00","colorNorm":"#00AA00","colorHover":"#88FF88","colorActive":"#FFFFFF","isActive":false,"isHover":false},{"radius":3,"x":18,"y":157,"context":{},"color":"#00AA00","colorNorm":"#00AA00","colorHover":"#88FF88","colorActive":"#FFFFFF","isActive":false,"isHover":false},{"radius":3,"x":17,"y":2,"context":{},"color":"#00AA00","colorNorm":"#00AA00","colorHover":"#88FF88","colorActive":"#FFFFFF","isActive":false,"isHover":false}],"isActive":false,"fillColor":"#0000FF","strokeColor":"#666666","transparency":"0.9"},{"_id":1445108564699,"_name":1,"points":[{"radius":3,"x":200,"y":120,"context":{},"color":"#00AA00","colorNorm":"#00AA00","colorHover":"#88FF88","colorActive":"#FFFFFF","isActive":false,"isHover":false},{"radius":3,"x":270,"y":51,"context":{},"color":"#00AA00","colorNorm":"#00AA00","colorHover":"#88FF88","colorActive":"#FFFFFF","isActive":false,"isHover":false},{"radius":3,"x":404,"y":120,"context":{},"color":"#00AA00","colorNorm":"#00AA00","colorHover":"#88FF88","colorActive":"#FFFFFF","isActive":false,"isHover":false},{"radius":3,"x":271,"y":86,"context":{},"color":"#00AA00","colorNorm":"#00AA00","colorHover":"#88FF88","colorActive":"#FFFFFF","isActive":false,"isHover":false}],"isActive":true,"fillColor":"#888888","strokeColor":"#666666","transparency":"0.5"}]';

document.addEventListener("DOMContentLoaded", function(event) { 
	var canvas = document.getElementById("editor_canvas"); 
	var ctx = canvas.getContext('2d');

	plan = new Plan(ctx,canvas);
	plan.loadImage(document.getElementById('editor_canvas').getAttribute('data-src'));
	//or however you get a handle to the IMG

	plan.polygonHexColor = '#000000';

	var colorObj = hexToRgb(plan.polygonHexColor);

	var toJson = document.getElementById('toJSON');
	var fromJson = document.getElementById('fromJSON');

	


	toJson.addEventListener("click",function(){
		plan.toJSON();
	});

	fromJson.addEventListener("click",function(){
		plan.loadFromJSON(jsonString);
	});

	var colorString = 'rgba('+colorObj.r+','+colorObj.g+','+colorObj.b+',0.5)';
	plan.polygonFillColor = colorString;

	//plan.loadFromJSON(jsonString);

	//Обрабатываем клики
	/**
	 * Description
	 * @method onclick
	 * @param {} event
	 * @return 
	 */
	


});



function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
} 
