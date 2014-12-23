var plan;

document.addEventListener("DOMContentLoaded", function(event) { 
	var canvas = document.getElementById("editor_canvas"); 
	var ctx = canvas.getContext('2d');

	plan = new Plan(ctx,canvas);
	plan.loadImage(document.getElementById('plan_edit_src').getAttribute('src'));
	//or however you get a handle to the IMG

	plan.polygonHexColor = '#000000';

	var colorObj = hexToRgb(plan.polygonHexColor);

	var colorString = 'rgba('+colorObj.r+','+colorObj.g+','+colorObj.b+',0.5)';
	plan.polygonFillColor = colorString;

	//Обрабатываем клики
	/**
	 * Description
	 * @method onclick
	 * @param {} event
	 * @return 
	 */
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

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
} 
