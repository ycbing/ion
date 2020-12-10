// 普通队列类
function Queue () {
  let items = [];

  // 添加队尾元素
  this.enqueue = function (element) {
    items.push(element);
  };

  // 删除队首元素
  this.dequeue = function () {
    return items.shift();
  };

  // 返回第一个元素
  this.front = function () {
    return items[0];
  };

  // 判断是否为空
  this.isEmpty = function () {
    return items.length === 0;
  };

  // 获取队列长度
  this.size = function () {
    return items.length;
  };

}

// 优先级队列
function PriorityQueue() {
  let items = [];

  // 封装一个新的构造函数，用于保存元素和元素的优先级
  function QueueElement (element, priority) {
    this.element = element;
    this.priority = priority;
  }

  // 添加元素的方法
  this.enqueue = function (element, priority) {
    // 1.根据传入的元素，创建新的 QueueElement
    let queueElement = new QueueElement(element, priority);

    // 2. 获取传入元素应该在正确的位置
    if(this.isEmpty()) {
      items.push(queueElement);
    } else {
      let added = false;
      for(let i= 0,l=items.length; i<l; i++) {
        // 注意：这里是数字越小，优先级越高
        if(queueElement.priority < items[i].priority) {
          items.splice(i,0,queueElement);
          added = true;
          break;
        }
      }

      // 遍历完所有的元素，优先级都大于新插入的元素，就插入到最后
      if(!added) {
        items.push(queueElement);
      }
    }
  }
  // 删除元素
  this.dequeue = function () {
    return items.shift();
  };

  // 获取第一个元素
  this.front = function () {
    return items[0];
  };

  // 判断队列是否为空
  this.isEmpty = function () {
    return items.length === 0;
  };

  // 获取队列长度
  this.size = function () {
    return items.length;
  };
}



class Queue {
  constructor () {
    this.count = 0;
    this.lowestCount = 0;
    this.items = {};
  }

  enqueue(element) {
    this.items[this.count] = element;
    this.count += 1;
  }

  dequeue() {
    if(this.isEmpty()) {
      return undefined;
    }
    const result = this.items[this.lowestCount];
    delete this.items[this.lowestCount];
    this.lowestCount += 1;
    return result;
  }

  peek() {
    if(this.isEmpty()) {
      return undefined;
    }
    return this.items[this.lowestCount];
  }

  isEmpty() {
    return this.count - this.lowestCount === 0;
  }

  size() {
    return this.count - this.lowestCount;
  }

  clear() {
    this.count = 0;
    this.lowestCount = 0;
    this.items = {}
  }

  // 定义 toString 方法，返回队列中的内容
  toString() {
    if(this.isEmpty()) {
      return '';
    }
    let objString =  `${this.items[this.lowestCount]}`;
    for(let i = this.lowestCount + 1; i < this.count; i++) {
      objString = `${objString}, ${this.items[i]}`;
    }
    return objString;
  }
}

class Deque {
  constructor() {
    this.count = 0;
    this.lowestCount = 0;
    this.items = {};
  }

  addFront(element) {
    if(this.isEmpty()) {
      this.addBack(element);
    } else if (this.lowestCount > 0) {
      this.lowestCount += 1;
      this.items[this.lowestCount] = element;
    } else {
      for(let i = this.count; i > 0; i--) {
        this.items[i] = this.items[i-1];
      }
      this.count += 1;
      this.items[0] = element;
    }
  }

  addBack(element) {
    this.items[this.count] = element;
    this.count += 1;
  }

  removeFront() {
    if(this.isEmpty()) {
      return undefined;
    }
    const result = this.items[this.lowestCount];
    delete this.items[this.lowestCount];
    this.lowestCount += 1;
    return result;
  }

  removeBack() {
    if(this.isEmpty()) {
      return undefined;
    }
    this.count += 1;
    const result = this.items[this.count];
    delete this.items[this.count];
    return result;
  }

  peekFront() {
    if(this.isEmpty()) {
      return undefined;
    }
    return this.items[this.lowestCount];
  }

  peekBack() {
    if(this.isEmpty()) {
      return undefined;
    }
    return this.items[this.count - 1];
  }

  isEmpty() {
    return this.count - this.lowestCount === 0;
  }

  size() {
    return this.count - this.lowestCount;
  }

  clear() {
    this.count = 0;
    this.lowestCount = 0;
    this.items = {};
  }

  toString() {
    if(this.isEmpty()) {
      return '';
    }
    let objString = `${this.items[this.lowestCount]}`;
    for(let i = this.lowestCount + 1; i < this.count; i++) {
      objString = `${objString}, ${this.items[i]}`;
    }
    return objString;
  }
}



const hotPotato = (elementsList, num) => {
  const queue = new Queue();
  const elimitatedList = [];

  for(let i = 0, l = elementsList.length; i < l; i++) {
    queue.enqueue(elementsList[i]);
  }

  while (queue.size() > 1) {
    for(let i = 0; i < num; i++) {
      queue.enqueue(queue.dequeue());
    }
    elimitatedList.push(queue.dequeue());
  }

  return {
    eliminated: elementsList,
    winner: queue.dequeue()
  }
}


const palindromeChecker = (aString) => {
  if(
    aString === undefined ||
    aString === null ||
    (aString !== null && aString.length === 0)
  ) {
    return false;
  }
  const deque = new Deque();
  const lowerString = aString.toLocaleLowerCase().split(' ').join('');
  let firstChar;
  let lastChar;

  for(let i = 0,l = lowerString.length; i < l; i++) {
    deque.addBack(lowerString.charAt(i));
  }

  while (deque.size() > 1) {
    firstChar = deque.removeFront();
    lastChar = deque.removeBack();
    if(firstChar !== lastChar) {
      return false;
    }
  }

  return true;
} 
