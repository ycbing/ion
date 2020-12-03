// 栈类
function Stack () {
  // 栈中的属性
  let items = [];

  // 栈相关的方法
  // 压栈操作
  this.push = function (element) {
    items.push(element);
  };

  // 出栈操作
  this.pop = function () {
    return items.pop();
  };

  // 获取栈顶元素操作
  this.peek = function () {
    return items[items.length -1];
  };

  // 判断栈中的元素是否为空
  this.isEmpty = function () {
    return items.length === 0;
  };

  // 获取栈的长度
  this.size = function () {
    return items.length;
  };

};

class Stack {
  items=[];

  push (element) {
    this.items.push(element);
  };

  pop () {
    return this.items.pop();
  };

  peek () {
    return this.items[this.items.length - 1];
  };

  isEmpty () {
    return this.items.length === 0;
  };

  size () {
    return this.items.length;
  };
  
}
