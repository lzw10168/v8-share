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




