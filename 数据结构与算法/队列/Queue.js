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
