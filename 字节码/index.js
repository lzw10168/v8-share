// 进行了一个简单的循环求和操作，并输出结果。接着，我们增加了一个稍微复杂一些的阶乘计算，
// 并再次进行了同样的循环求和操作。通过这样的设计，我们期望 V8 引擎在第二次循环求和时能够对代码进行优化。

// 运行以上代码，你会看到在输出中有两次求和结果，分别是优化前和优化后的结果。
// 如果 V8 引擎成功对热代码进行了优化，那么优化后的求和操作应该比优化前的求和操作更快。


function hotCodeOptimizationDemo() {
  let sum = 0;

  // 热代码优化前的循环
  console.time('Sum (before optimization)');
  for (let i = 0; i < 10000; i++) {
    sum += i;
  }
  console.timeEnd('Sum (before optimization)');
  console.log('Sum (before optimization):', sum);

  sum = 0;

  // 热代码优化后的循环
  console.time('Sum (after optimization)');
  for (let i = 0; i < 10000; i++) {
    sum += i;
  }
  console.timeEnd('Sum (after optimization)');
  console.log('Sum (after optimization):', sum);
}

// 执行示例代码
// hotCodeOptimizationDemo();


// -----------------------------因参数类型改变而导致热代码优化失效的情况： -----------------------------



function hotCodeOptimizationDemo1(param) {
  let result = 0;

  console.time('Execution Time');
  for (let i = 0; i < 1000000; i++) {
    result += param;
  }
  console.timeEnd('Execution Time');

}

function exector1() {
  // 第一次调用
console.log('--- 第一次调用 ---');
hotCodeOptimizationDemo1(5);

// 第二次调用
console.log('--- 第二次调用 ---');
hotCodeOptimizationDemo1(5);

// 第三次调用，改变参数类型, 注释掉之后再看看
console.log('--- 第三次调用 ---');
hotCodeOptimizationDemo1('5');

console.log('--- 第四次调用 ---');
hotCodeOptimizationDemo1(5);

console.log('--- 第五次调用 ---');
hotCodeOptimizationDemo1(5);

console.log('--- 第六次调用 ---');
hotCodeOptimizationDemo1(5);
}

// exector1()




// -----------------------------对象隐藏类 -----------------------------

/**
 * 优化
 * 1. 分别创建了两个对象 obj1 和 obj2 并打印它们的内容
 * 2. 第一次调用 optimizeHiddenClassDemo 函数时，V8 引擎会根据对象的属性创建一个隐藏类，并将这两个对象归为同一个隐藏类。这样，引擎可以对这些对象进行优化
 * 3. 第二次调用函数时，由于对象的属性结构没有发生变化，V8 引擎会继续使用之前创建的隐藏类，从而避免重复的隐藏类创建和优化过程，提高了执行效率
 */
 function optimizeHiddenClassDemo() {
  function MyClass(a, b) {
    this.a = a;
    this.b = b;
  }

  console.time('Execution Time');

  let obj1 = new MyClass(1, 2);
  let obj2 = new MyClass(3, 4);

  console.log('obj1:', obj1);
  console.log('obj2:', obj2);

  console.timeEnd('Execution Time');
}

function exector2() {
  console.log('--- 第一次调用 ---');
optimizeHiddenClassDemo();

console.log('--- 第二次调用 ---');
optimizeHiddenClassDemo();
}

// exector2()

/**
 * 反例
 * 1. 创建了一个对象 obj1，
 * 2. 为 obj1 添加了一个新属性 c。
 * 3. 由于 obj1 的属性结构发生了改变，V8 引擎无法继续使用之前的隐藏类进行优化。
 */

function MyClass(a, b) {
  this.f = a;
  this.s = b;
  this.o = a;
  this.t = b;
}
function MyClass1(a, b) {
  this.a = a;
  this.b = b;
  this.c = a;
  this.d = b;
}
 function optimizeHiddenClassFailureDemo() {

  console.time('Execution Time');
  let obj1
  for(let i = 0; i < 1000000; i++) {
    obj1 = new MyClass(1, 2);
  }
  console.log('obj1: ', obj1);
  console.timeEnd('Execution Time');
}
 function optimizeHiddenClassFailureDemo1() {

  console.time('Execution Time');
  let obj1
  for(let i = 0; i < 1000000; i++) {
    obj1 = new MyClass(1, 2);
  }
  console.log('obj1: ', obj1);
  console.timeEnd('Execution Time');
}
 function optimizeHiddenClassFailureDemo2() {

  console.time('Execution Time');
  let obj1
  for(let i = 0; i < 1000000; i++) {
    obj1 = new MyClass1(1, 2);
  }
  console.log('obj1: ', obj1);
  console.timeEnd('Execution Time');
}

function exector3() {
  console.log('--- 第一次调用 ---');
  optimizeHiddenClassFailureDemo();

  console.log('--- 第二次调用, 虚拟类优化 ---');
  optimizeHiddenClassFailureDemo();

  console.log('--- 第三次调用, 被标记热代码, 时间进一步减小 ---');
  optimizeHiddenClassFailureDemo();

  console.log('--- 第四次调用, 非热代码, 但是同一个隐藏类 ---');
  optimizeHiddenClassFailureDemo1();


  console.log('--- 第五次调用, 改变隐藏类 ---');
  optimizeHiddenClassFailureDemo2();

  console.log('--- 第六次调用, 隐藏类优化 ---');
  optimizeHiddenClassFailureDemo2();

  console.log('--- 第七次调用, 被标记热代码, 时间进一步减小 ---');
  optimizeHiddenClassFailureDemo2();


}
exector3()
