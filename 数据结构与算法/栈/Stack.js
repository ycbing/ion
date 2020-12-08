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
  constructor() {
    this.items=[];
  }

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

  clear () {
    this.items = [];
  }; 
}


class Stack {
  constructor() {
    this.count = 0;
    this.items = {};
  }

  push(element) {
    this.items[this.count] = element;
    this.count += 1;
  }

  pop() {
    if(this.isEmpty()) {
      return undefined;
    }
    this.count -= 1;
    const result = this.items[this.count];
    delete this.items[this.count];
    return result;
  }

  peek() {
    if(this.isEmpty()) {
      return undefined;
    }
    return this.items[this.count - 1];
  }

  isEmpty() {
    return this.count === 0;
  }

  size() {
    return this.count;
  }

  clear() {
    // 直接设置为最开始的值
    this.count = 0;
    this.items = {};

    // 通过 pop 方法
    while(!this.isEmpty()) {
      this.pop();
    }
  }

  // 打印栈内容，定义 toString 方法
  toString() {
    if(this.isEmpty()) {
      return '';
    }
    let objString = `${this.items[0]}`;
    for(let i = 1; i < this.count; i++) {
      objString = `${objString}, ${this.items[i]}`;
    } 
    return objString;
  }

}


class Stack {
  constructor() {
    this._count = 0;
    this._items = {};
  }

  // TODO

}


const _items = Symbol('stackItems');
class Stack {
  constructor() {
    this[_items] = [];
  }

  // TODO
}


const items = new WeakMap();
class Stack {
  constructor() {
    items.set(this, []);
  }

  push(element) {
    const stack = items.get(this);
    stack.push(element);
  }

  pop() {
    const stack = items.get(this);
    const res = stack.pop();
    return res;
  }

  // TODO

}


class Stack {
  #count = 0;
  #items = [];

  // TODO
}


function decimalToBinary(decNumber) {
  const remStack = new Stack();
  let number = decNumber;
  let rem;
  let binaryString = '';

  while (number > 0) {
    rem = Math.floor(number % 2);
    remStack.push(rem);
    number = Math.floor(number / 2);
  }

  while (!remStack.isEmpty()) {
    binaryString += remStack.pop().toString();
  }
  return binaryString;
}


function baseConverter(decNumber, base) {
  const remStack = new Stack();
  const digits = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let number = decNumber;
  let rem;
  let baseString = '';

  if(!(base >= 2 && base <= 36)) {
    return '';
  }

  while (number > 0) {
    rem = Math.floor(number % base);
    remStack.push(rem);
    number = Math.floor(number / base);
  }

  while (!remStack.isEmpty()) {
    baseString += digits[remStack.pop()];
  }
  return baseString;
}
