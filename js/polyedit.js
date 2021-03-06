//Общий план
/**
 * Конструктор объекта План, в качестве параметра принимает элемент,
 * являющийся контейнером для рабочей области
 * @method Plan
 * @param {} context Контекст в котором будет происходить работа
 * @return 
 */
 var Plan = function(_element){
 	//Принимаем входящие параметры
 	this.wrapper = _element;

 	//Создаём набор свойств
 	this.polygons = Array();
 	var _plan = this;
 	this.hoverLine = {
		start:false,
		end:false
	};
	this.hoverIndex = false;

 	//Создаём тулбар
 	this.toolbar = document.createElement("DIV");
 	addClass(this.toolbar,'pe_toolbar');
 	this.wrapper.appendChild(this.toolbar);
 	//Создаём выезжающую часть тулбара
 	this.toolbar_container = document.createElement("DIV");
 	addClass(this.toolbar_container,'pe_toolbar_container');
 	this.toolbar.appendChild(this.toolbar_container);
 	//Добавляем кнопку "Добавить полигон"
 	this.addButton = document.createElement("DIV");
 	addClass(this.addButton,'pe_toolbar_add');
 	addClass(this.addButton,'button');
 	this.toolbar_container.appendChild(this.addButton);

 	this.addButton.addEventListener('click',function(){
 		_plan.addPolygon();
 	});

 	//Добавляем кнопку "Удалить полигон"
 	this.removeButton = document.createElement("DIV");
 	addClass(this.removeButton,'pe_toolbar_remove');
 	addClass(this.removeButton,'pe_button');
 	this.toolbar_container.appendChild(this.removeButton);

 	this.removeButton.addEventListener('click',function(){
 		var cPoly = _plan.getActivePoly();
 		_plan.removePolygon(cPoly);
 	});

 	//Добавляем список полигонов
 	this.listButton = document.createElement("DIV");
 	addClass(this.listButton,'pe_toolbar_list');
 	addClass(this.listButton,'button');
 	this.toolbar_container.appendChild(this.listButton);

 	this.currentPolygon = document.createElement("DIV");
 	this.currentPolygon.innerHTML='Polygon Name';
 	addClass(this.currentPolygon,'pe_current_polygon');
 	this.listButton.appendChild(this.currentPolygon);

 	this.dropListContainer = document.createElement("DIV");
 	addClass(this.dropListContainer,'pe_drop_list_container');
 	this.listButton.appendChild(this.dropListContainer);

 	//Добавляем color picker
 	var jsColorSrc = document.createElement('SCRIPT');
 	document.getElementsByTagName('head')[0].appendChild(jsColorSrc);
 	jsColorSrc.src='./js/jscolor.js';//TODO: Добавить нормальную загрузку

 	jsColorSrc.onload = function(){
 		var colorPicker = document.createElement('INPUT');
 		addClass(colorPicker,'color');
 		_plan.toolbar_container.appendChild(colorPicker);
 		colorPicker.onchange = function(){
 			var color = '#'+this.value;
 			var _poly = _plan.getActivePoly();
 			_poly.fillColor = color;
 			_plan.update();
 		}
 	}
 	//Добавляем ползунок прозрачности
 	this.transparencyButton = document.createElement("DIV");
 	addClass(this.transparencyButton,'pe_toolbar_transparency');
 	addClass(this.transparencyButton,'button');
 	this.toolbar_container.appendChild(this.transparencyButton);

 	this.transparencySlider = document.createElement("DIV");
 	addClass(this.transparencySlider,'pe_toolbar_transparency_slider');
 	this.transparencyButton.appendChild(this.transparencySlider);

 	this.transparencyWay = document.createElement("DIV");
 	addClass(this.transparencyWay,'pe_way');
 	this.transparencySlider.appendChild(this.transparencyWay);

 	this.transparencySliderPick = document.createElement("DIV");
 	addClass(this.transparencySliderPick,'pe_pick');
 	this.transparencySlider.appendChild(this.transparencySliderPick);

 	//Обрабатываем клик по ползунку слайдера
 	var _pick = this.transparencySliderPick;
 	this.transparencySliderPick.addEventListener('mousedown',function(_e){
 		_pick.holdLMB = true;
 	});

 	var _slider = this.transparencySlider;

 	//Обработчик перемещения мыши по слайдеру
 	this.transparencySlider.addEventListener('mousemove',function(e){

 		var height = 0;
 		if(_plan.transparencySliderHeight){
			height = _plan.transparencySliderHeight;
		}else{
			height = _slider.getBoundingClientRect().height;
		}

		var _poly = _plan.getActivePoly();
		_plan.transparencySliderPick.style.top=_poly.transparency*height+"px";

		//Изменяем занчение прозрачности только если нажата клавиша мыши
 		if(_plan.transparencySliderPick.holdLMB){
 			var y;

 			if (e.pageY) { 
 				y = e.pageY;
 			}else { 
 				y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop; 
 			} 

 			var top = y - _slider.getBoundingClientRect().top;

 			if(top<0)
 				top = 0;

 			if(top>height)
 				top=height;

 			var polygon = _plan.getActivePoly();
 			polygon.transparency = top/height;
 			_plan.update();
 			_plan.transparencySliderPick.style.top = top+"px";
 		}
 	});

 	//Обрабатываем клик по слайдеру в произвольной точке
 	this.transparencyWay.addEventListener('click',function(e){
 		var height = 0;
 		if(_plan.transparencySliderHeight){
			height = _plan.transparencySliderHeight;
		}else{
			height = _slider.getBoundingClientRect().height;
		}

		var _poly = _plan.getActivePoly();
		_plan.transparencySliderPick.style.top=_poly.transparency*height+"px";

		var y;

		if (e.pageY) { 
			y = e.pageY;
		}else { 
			y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop; 
		} 

		var top = y - _slider.getBoundingClientRect().top;

		if(top<0)
			top = 0;

		if(top>height)
			top=height;

		var polygon = _plan.getActivePoly();
		polygon.transparency = top/height;
		_plan.update();
		_plan.transparencySliderPick.style.top = top+"px";
 	});

 	//Глобавльный обработчик для события отпускания мыши
 	document.addEventListener('mouseup',function(_e){
 		_pick.holdLMB = false;
 	});
 	
 	//Создаём канвас
 	this.canvas = document.createElement("CANVAS");
 	this.wrapper.appendChild(this.canvas);
 	this.context = this.canvas.getContext('2d');

 	this.width = false;
 	this.height = false;
 	this.bascground = false;
 	this.imageObj = false;
 	this.context.imageSmoothingEnabled= true;

 	//Добавляем обработчики событий
 	this.canvas.addEventListener('click',function(event){

		//Проверяем, попадает ли угол полигона под клик
		if(plan.checkClick(event.offsetX,event.offsetY)){
			plan.checkClick(event.offsetX,event.offsetY).click();
			_plan.update();
		}else{
			//Если нет, то проверяем, не попадает ли в зону действия курсора грань полигона
			if(_plan.hoverLine.start&&_plan.hoverLine.end){
				plan.drowPoint(event.offsetX,event.offsetY,_plan.hoverIndex);
			}else{
				plan.drowPoint(event.offsetX,event.offsetY);
			}
			
		}
	});

 	//Обрабатываем нажатие на клавиши клавиатуры при активном канвасе
	this.canvas.addEventListener( "keypress", function(e){
		
		switch(e.keyCode){
			case 127: 		//Обрабатываем нажатие на клавишу Delete

				for (var j = _plan.polygons.length - 1; j >= 0; j--) {
	 				var polygon = _plan.polygons[j];
					for(var i=0;i<polygon.points.length;i++){
						var point = polygon.points[i];

						if(point.isActive)
							polygon.removePoint(i);

						_plan.update();
					}
				}
				break;
		}
		
	}, true);

	//Обрабатываем перемещение по канвасу курсора мыши
	this.canvas.addEventListener('mousemove', function(event){
			//Проверяем на какой точке находимся
			plan.checkHover(event.offsetX,event.offsetY);
	});

	this.addPolyButton = document.getElementById('addPoly');
	this.polySelector = document.getElementById('polygons');
	this.polyUp = document.getElementById('polyUp');
	this.polyDown = document.getElementById('polyDown');
	


	this.polyUp.addEventListener("click",function(){
		var currentPoly = _plan.getActivePoly();
		for (var i = _plan.polySelector.options.length - 1; i >= 0; i--) {
			if((_plan.polySelector.options[i].value==currentPoly._id)&&(i>0)){
				var cOption = _plan.polySelector.options[i];
				var pOption = _plan.polySelector.options[i-1];
				_plan.polySelector.insertBefore(cOption,pOption);
				
				break;
			}
		};

		for (var i = _plan.polygons.length - 1; i >= 0; i--) {
			if((_plan.polygons[i]._id==currentPoly._id)&&(i>0)){
				var cOption = _plan.polygons[i];
				var pOption = _plan.polygons[i-1];
				_plan.polygons[i]=pOption;
				_plan.polygons[i-1]=cOption;
				break;
			}
		};

		_plan.update();  
	});

	this.polyDown.addEventListener("click",function(){
		var currentPoly = _plan.getActivePoly();
		for (var i = _plan.polySelector.options.length - 1; i >= 0; i--) {
			if((_plan.polySelector.options[i].value==currentPoly._id)&&(i<_plan.polySelector.options.length)){
				var cOption = _plan.polySelector.options[i];
				var nOption = _plan.polySelector.options[i+1];
				_plan.polySelector.insertBefore(nOption,cOption);
				
				break;
			}
		};

		for (var i = _plan.polygons.length - 1; i >= 0; i--) {
			if((_plan.polygons[i]._id==currentPoly._id)&&(i<_plan.polySelector.options.length)){
				var cOption = _plan.polygons[i];
				var pOption = _plan.polygons[i+1];
				_plan.polygons[i]=pOption;
				_plan.polygons[i+1]=cOption;
				break;
			}
		};
		_plan.update();
	});

	this.colorSelector = document.getElementById('polyColor');
	this.colorSelector.addEventListener('change',function(){
		var poly = _plan.getActivePoly();
		poly.fillColor = this.value;
		_plan.update();
	});

	this.transparencySelector = document.getElementById('polyTransparency');
	this.transparencySelector.addEventListener("change",function(){

		this.value = parseFloat(this.value);

		if(this.value>1){
			this.value=1;
		}

		if(this.value<0){
			this.value=0;
		}

		var poly = _plan.getActivePoly();
		poly.transparency = this.value;
		_plan.update();
	});

	this.polySelector.addEventListener("change",function(e){
		var poly = _plan.getById(this.value);
		if(poly){
			_plan.setActive(poly);
		}
	});

	this.addPolyButton.addEventListener("click",function(e){
		e.preventDefault();

		var newPoly = new Polygon(_plan.context);
		var option = document.createElement("OPTION");
		option.value = newPoly._id;
		var text = document.createTextNode(newPoly._name);
		option.appendChild(text);
		_plan.polySelector.appendChild(option);
		_plan.polySelector.value=option.value;
		_plan.polygons.push(newPoly);
		_plan.setActive(newPoly);
	});

	

	
}

//Задаём начальные состояния параметров класса
Plan.prototype.polygons = Array();

/**
 * Получить нужный полигон по его _id
 * @param  int _id Уникальный идентификатор полигона
 * @return Polygon|false     искомый полигон или false в случе если не найден
 */
Plan.prototype.getById = function(_id){
	for (var i = this.polygons.length - 1; i >= 0; i--) {
		if(this.polygons[i]._id==_id)
			return this.polygons[i];
	};
	return false;
}

/**
 * @deprecated Начиная с добавления отдельных полигонов
 * @param  int _index Индекс точки
 */
Plan.prototype.removePoint = function(_index){
	this.points.splice(_index,1);
	this.update();
}

/**
 * Делает указанный полигон активным (реадктируемым)
 * @param Polygon _poly объект который необходимо сделать активным полигоном
 */
Plan.prototype.setActive = function(_poly){
	//Снимаем флаг активности со всех полигонов
	for (var i = this.polygons.length - 1; i >= 0; i--) {
		removeClass(this.polygons[i].selector,'active');
		this.polygons[i].isActive=false;
	};
	//Задаём инструментам тулбара значения активного полигона
	this.colorSelector.value = _poly.fillColor;
	this.transparencySelector.value = _poly.transparency;
	_poly.isActive = true;
	addClass(_poly.selector,'active');
	this.currentPolygon.innerHTML = _poly._name;

	//Смещаем ползунок прозрачности
 	var height = this.transparencySliderHeight;
 	if(height){
 		this.transparencySliderPick.style.top=_poly.transparency*height;
 	}
	
}

/**
 * Получить активный полигон
 * @return Polygon|false активный полигон либо false
 */
Plan.prototype.getActivePoly = function(){
	for (var i = this.polygons.length - 1; i >= 0; i--) {
		if(this.polygons[i].isActive)
			return this.polygons[i];
	};
	return false;
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

 	var poly = this.getActivePoly();

 	var _point = new Point(this.context,_X,_Y);
 	_point.setActive(!_point.isActive);
 	if(_index){
 		poly.points.splice(_index,0,_point);
 	}else{
 		poly.points.push(_point);
 	}

 	this.update();
 }

/**
 * Заполняет полигон, обозначенный точками
 * @deprecated После добавления класса полигонов теряет смысл
 * @method fillPolygon
 * @param {} _color
 * @return 
 */
 Plan.prototype.fillPolygon = function(_color){
 	for (var j = this.polygons.length - 1; j >= 0; j--) {

 		var polygon = this.polygons[j];

 		var colorObj = hexToRgb(polygon.fillColor);
 		var colorString = 'rgba('+colorObj.r+','+colorObj.g+','+colorObj.b+',1)';
 		var fillColorString = 'rgba('+colorObj.r+','+colorObj.g+','+colorObj.b+','+polygon.transparency+')';
 		this.context.strokeStyle=colorString;
 		this.context.fillStyle = fillColorString;

 		this.context.beginPath();

 		for(var i = 0;i<polygon.points.length;i++){
 			var point = polygon.points[i];
 			var last = polygon.points.length-1;

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
 	
 	
 }

/**
 * Вычисляет расстояние между точкой и линией, необходима для определения события hover для линии и возможности деления линии
 * @param  {int} _x          Координата точки X
 * @param  {int} _y          Координата точки Y
 * @param  {Pos} _line_start Координаты начала линии
 * @param  {Pos} _line_end   Координаты конца линии
 * @return {float|false}     Кратчайшее расстояние от точки до линии либо false, если расстояние от точки до одного из концов больше чем длина линии.
 */
 Plan.prototype.pointToLineDistance = function(_x,_y,_line_start,_line_end){

 	var distance = Math.abs(((_line_start.y-_line_end.y)*_x)+((_line_end.x-_line_start.x)*_y)+(_line_start.x*_line_end.y-_line_end.x*_line_start.y))/(Math.sqrt((Math.pow((_line_end.x-_line_start.x),2))+(Math.pow((_line_end.y-_line_start.y),2))));

 	var distToStart = Math.sqrt(Math.pow((_x-_line_start.x),2)+Math.pow((_y-_line_start.y),2));
 	var distToEnd = Math.sqrt(Math.pow((_x-_line_end.x),2)+Math.pow((_y-_line_end.y),2));
 	var lineLength = Math.sqrt(Math.pow((_line_start.x-_line_end.x),2)+Math.pow((_line_start.y-_line_end.y),2))-3;

 	if((distToStart<lineLength)&&(distToEnd<lineLength)){
 		return distance;
 	}else{
 		return false;
 	}
}

/**
 * Проверка на попадание в точку
 * @method checkHover
 * @param {int} _x
 * @param {int} _y
 * @return CallExpression
 */
 Plan.prototype.checkHover = function(_x,_y){
 	this.canvas.focus();

 	var point = this.checkPoints(_x,_y);
	//var point = this.checkPoints(_x,_y);

	if(point&&point.isHover&&!point.isActive)
		this.canvas.style.cursor = "pointer";

	this.hoverLine.start = false;
	this.hoverLine.end = false;
	this.hoverIndex = false;

	for (var j = this.polygons.length - 1; j >= 0; j--) {

		var polygon = this.polygons[j];

		for(var i = 0;i<polygon.points.length;i++){
			var point = polygon.points[i];

			if(polygon.points.length>1){
				var nextIndex = i+1;

				if(nextIndex>=polygon.points.length)
					nextIndex=0;

				var nextPoint = polygon.points[nextIndex];

				var dist = this.pointToLineDistance(_x,_y,point,nextPoint);

				if((dist!==false)&&(Math.abs(dist)<3)){
					this.hoverLine.start = point;
					this.hoverIndex = nextIndex;
					this.hoverLine.end = nextPoint;
					this.canvas.style.cursor = "url(data:application/cur;base64,AAACAAEAICAAAAAAAACoEAAAFgAAACgAAAAgAAAAQAAAAAEAIAAAAAAAgBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD+AAAA/gAAAP4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/v////7////+AAAA/gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD+/////v////4AAAD+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/v////7////+AAAA/gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/gAAAAAAAAAAAAAAAAAAAAAAAAD+/////v////4AAAD+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD+AAAA/gAAAAAAAAAAAAAA/v////7////+AAAA/gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP7////+AAAA/gAAAAAAAAD+/////v////4AAAD+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/v////7////+AAAA/v////7////+AAAA/gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD+/////v////7////+/////v////4AAAD+AAAA/gAAAP4AAAD+AAAA/gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP7////+/////v////7////+/////v////7////+/////gAAAP4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/v////7////+/////v////7////+/////v////4AAAD+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD+/////v////7////+/////v////7////+AAAA/gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP7////+/////v////7////+/////gAAAP4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/v////7////+/////v////4AAAD+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD+/////v////7////+AAAA/gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP7////+/////gAAAP4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/v////4AAAD+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD+AAAA/gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//////////////////////////////////////////////////////////////////////4////8P////D////h///94f///MP///xD///8B////AB///wA///8Af///AP///wH3//8D9///B/f//w+A//8f9///P/f//3/3//8=), auto";
				}
			}
		};
	}
	this.update();
	return point;
}

/**
 * Обработка события click по точке
 * @method checkClick
 * @param {int} _x
 * @param {int} _y
 * @return {Point}
 */
 Plan.prototype.checkClick = function(_x,_y){

 	var point = this.checkPoints(_x,_y);

 	if(point&&point.isActive);
 	this.canvas.style.cursor = "move";
 	return point;
 }

/**
 * Поиск точек, подходящих под заданные координаты
 * @method checkPoints
 * @param {int} _x
 * @param {int} _y
 * @return {Point} подходящая точка
 */
 Plan.prototype.checkPoints = function(_x,_y){
 	var res = false;
 	var hover = false;
 	var active = false;

 	for (var j = this.polygons.length - 1; j >= 0; j--) {

 		var polygon = this.polygons[j];

 		for(var i = 0;i<polygon.points.length;i++){
 			var point = polygon.points[i];

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
 	};



 	if(hover)
 		this.canvas.style.cursor = "pointer";
 	else
 		this.canvas.style.cursor = "default";

 	if(active)
 		this.canvas.style.cursor = "move";
 	else
 		this.canvas.style.cursor = "default";

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

 	var polygon = this.getActivePoly();
 	if(polygon){
 		for(var i = 0;i<polygon.points.length;i++){
			var point = polygon.points[i];
			point.draw();
		}
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

/**
 * Метод генерирует json строку пригодную для сохранения
 * @return {[type]} [description]
 */
 Plan.prototype.toJSON = function(){
 	var res = Array();
 	for (var i = this.polygons.length - 1; i >= 0; i--) {
 		res.push(this.polygons[i])
 	};
 	var jsonString = JSON.stringify(res);
 	return jsonString;
 }

/**
 * Метод загружает данные полигонов из JSON строки
 * @param  {string} _js JSON строка с данными о полигонах
 * @return {bool}     на данный момент функция всегда возвращает true
 */
 Plan.prototype.loadFromJSON = function(_js){
 	var obj = JSON.parse(_js);

 	for (var i = obj.length - 1; i >= 0; i--) {

 		var newPoly = new Polygon(this.context,obj[i]);
		var option = document.createElement("OPTION");
		option.value = newPoly._id;
		var text = document.createTextNode(newPoly._name);
		option.appendChild(text);
		this.polySelector.appendChild(option);
		this.polySelector.value=option.value;
		this.polygons.push(newPoly);
		this.setActive(newPoly);


 	};
 	this.update();
 	return true;
 }

/**
 * Метод создаёт новый полигон и добавляет его в список
 * @return {Polygon} Добавленный полигон
 */
Plan.prototype.addPolygon = function(){
	var newPoly = new Polygon(this.context);
	newPoly.selector = document.createElement("DIV");
	var text = document.createTextNode(newPoly._name);
	newPoly.selector.appendChild(text);

	var _plan = this;

	newPoly.selector.addEventListener('click',function(){
		_plan.setActive(newPoly);
	});

	this.dropListContainer.appendChild(newPoly.selector);
	this.polygons.push(newPoly);
	this.setActive(newPoly);

	return newPoly;
}

/**
 * Метод для удаления полигона
 * @param  {Polygon} _poly Удаляемый полигон
 * @return {bool}       true если полигон удалён, false в случае если полигон не найден
 */
Plan.prototype.removePolygon=function(_poly){
	for (var i = this.polygons.length - 1; i >= 0; i--) {
		if(this.polygons[i]._id==_poly._id){
			this.dropListContainer.removeChild(this.polygons[i].selector);
			this.polygons.splice(i,1);
			if(this.polygons[i-1]){
				this.setActive(this.polygons[i-1]);
			}else{
				this.setActive(this.polygons[i]);
			}
			
			this.update();
			return true;
		}
	};
	return false;
}

/**
 * Точка на плане
 * @method Point
 * @param {Context2d} текущий context
 * @param {int} _X координата по горизонтали
 * @param {int} _Y координата по вертикали
 * @return {Point} созданная точка
 */
 var Point = function(context,_X,_Y){

	this.x = _X;
	this.y = _Y;

 	this.radius = 3;	//Радиус вершины в режиме редиктирования
 	
 	this.context = context;

 	this.color = '#00AA00';
 	this.colorNorm = '#00AA00';//Цвет в обычном состоянии
 	this.colorHover = '#88FF88';//Цвет при наведении
 	this.colorActive = '#FFFFFF';//Цвет в активном состоянии
 	//Флаги состояния
 	this.isActive = false;
 	this.isHover = false;
 	//Отрисовка
 	this.context.beginPath();
 	this.context.arc(_X, _Y, this.radius, 0, 2 * Math.PI, false);
 	this.context.fillStyle = this.color;
 	this.context.fill();
 	this.context.lineWidth = 1;
 	this.context.strokeStyle = '#003300';//цвет обводки
 	this.context.stroke();

 	return this;
 }



/**
 * Метод отрисовывает точку - вершину многоугольника полигона 
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
 * Класс объекта Полигон, хранит в ебе методы отрисовки полигона и набор точек
 * @method Polygon
 * @param {Context2d} _context Текущий контекст
 * @param {Object} [_data] Загружаемые в полигон данные
 * @return {Polygon} Объект Полигон
 */
 var Polygon = function(_context,_data){

 	this.context = _context;
 	this.points = Array();

 	//Если переданы данные полигона,
 	//то создаём полигон и заполняем его данными,
 	//в противном случае просто создаём полигон
 	if(_data&&_data!=undefined){
 		this._id = _data._id;
 		this.fillColor = _data.fillColor;
 		this.strokeColor = _data.strokeColor;
 		this.transparency = _data.transparency;
 		this._name = _data._name;

 		for (var i = _data.points.length - 1; i >= 0; i--) {
 			this.points.push(new Point(this.context,_data.points[i].x,_data.points[i].y));
 		};
 	}else{
 		this._id = new Date().getTime();
	 	this.fillColor = "#888888";
	 	this.strokeColor = "#666666";
	 	this.transparency = "0.5";
	 	this._name = Polygon.prototype.defaultName+Polygon.prototype.lastNumber;
 	}
 	this.isActive = true;
 	
 	Polygon.prototype.lastNumber++;
 	return this;
 }

 Polygon.prototype.lastNumber = 1;
 Polygon.prototype.selector = {};
 Polygon.prototype.defaultName = 'Polygon';

 Polygon.prototype.removePoint = function(_index){
	this.points.splice(_index,1);
	//this.update();
}