;
//Get the element through class 通过class获取元素
function getClass(cls){
    var ret = [];
    var els = document.getElementsByTagName("*");
    for (var i = 0; i < els.length; i++){
        //Determine whether the class name of cls exists in els[i];.indexOf("cls") determines the existence of a subscript in cls, if the subscript >=0;
		//判断els[i]中是否存在cls这个className;.indexOf("cls")判断cls存在的下标，如果下标>=0则存在;
        if(els[i].className === cls || els[i].className.indexOf("cls")>=0 || els[i].className.indexOf(" cls")>=0 || els[i].className.indexOf(" cls ")>0){
            ret.push(els[i]);
        }
    }
    return ret;
}
function getStyle(obj,attr){//Solve the JS compatibility problem and get the correct property value 解决JS兼容问题获取正确的属性值
	return obj.currentStyle?obj.currentStyle[attr]:getComputedStyle(obj,false)[attr];
}
function startMove(obj,json,fun){
	clearInterval(obj.timer);
	obj.timer = setInterval(function(){
		var isStop = true;
		for(var attr in json){
			var iCur = 0;
			//Determines whether the movement is a transparency value 判断运动的是不是透明度值
			if(attr=="opacity"){
				iCur = parseInt(parseFloat(getStyle(obj,attr))*100);
			}else{
				iCur = parseInt(getStyle(obj,attr));
			}
			var ispeed = (json[attr]-iCur)/8;
			//If the movement speed is greater than 0, it will be rounded down, and if it is less than 0, it will be rounded up; 运动速度如果大于0则向下取整，如果小于0想上取整；
			ispeed = ispeed>0?Math.ceil(ispeed):Math.floor(ispeed);
			//Determine if all movements are complete 判断所有运动是否全部完成
			if(iCur!=json[attr]){
				isStop = false;
			}
			//The movement begins 运动开始
			if(attr=="opacity"){
				obj.style.filter = "alpha:(opacity:"+(json[attr]+ispeed)+")";
				obj.style.opacity = (json[attr]+ispeed)/100;
			}else{
				obj.style[attr] = iCur+ispeed+"px";
			}
		}
		//Determine if everything is done 判断是否全部完成
		if(isStop){
			clearInterval(obj.timer);
			if(fun){
				fun();
			}
		}
	},30);
}