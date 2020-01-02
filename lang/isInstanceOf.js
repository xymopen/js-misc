// 防止关键字作函数名导致错误
function isInstanceOf( instance, constructor ) {
	var focus = instance,
		proto = constructor.prototype;
	
	// 遍历原型链
	// 原型链终点都是 null
	while( focus !== null ) {
		// 下一个原型
		focus = Object.getPrototypeOf( focus );
		
		// 如果这个原型就是构造函数的 .prototype 对象，
		// 就认为这个对象是从这个构造函数继承的
		if ( focus === proto ) {
			return true;
		}
	};
	
	// 遍历完原型链
	return false;
};