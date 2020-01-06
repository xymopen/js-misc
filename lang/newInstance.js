// 防止关键字作函数名导致错误
function newInstance( constructor /* , argv1, argv2 */ ) {
	// 首先创建一个以构造函数的 prototype 属性为原型的对象
	var newObject = Object.create( constructor.prototype );
	// 把从第一个开始传进函数的参数作为构造函数的参数
	var argv = Array.prorotype.slice.call( arguments, 1 );
	
	// 函数的 .call() 和 .apply() 可以修改函数的 this 的值
	// 函数的 this 值被设置为 .call() 或 .apply() 的第一个参数
	// .call() 会把第二个到最后一个参数输入给函数
	// .apply() 认为第二个参数是一个数组，并将数组中
	// 的所有元素作为参数输入给函数
	var result = constructor.apply( newObject, argv );
	
	// 如果构造函数返回了一个对象，就返回这个对象，否则返回新构造的 newObject
	return ( typeof result === "object" && result !== null ) result : newObject;
}