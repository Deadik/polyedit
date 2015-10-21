/**
 * Вспомогательная функция для добавления класса элементу
 * @param domElement o Элемент требующий добавления класса
 * @param string c Название класса
 */
function addClass(o, c){
    var re = new RegExp("(^|\\s)" + c + "(\\s|$)", "g")
    if (re.test(o.className)) return
    o.className = (o.className + " " + c).replace(/\s+/g, " ").replace(/(^ | $)/g, "")
}
 
/**
 * Вспомогательная функция для удаления класса элементу
 * @param domElement o Элемент требующий удаления класса
 * @param string c Название класса
 */
function removeClass(o, c){
    var re = new RegExp("(^|\\s)" + c + "(\\s|$)", "g")
    o.className = o.className.replace(re, "$1").replace(/\s+/g, " ").replace(/(^ | $)/g, "")
}
