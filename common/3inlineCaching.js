/**
 * 1. 在 V8 引擎中，内联缓存会根据函数调用时的对象类型来优化函数调用...
 * 在调用对象的属性时，V8 引擎会根据对象的类型生成一份内联缓存，用于存储对象的属性名和属性值的对应关系。
 * 当再次调用对象的属性时，V8 引擎会先检查之前是否已经生成了内联缓存，如果有，则直接使用缓存中的属性值。
 * 从而避免了重新查找属性名和属性值的过程，提高了函数调用的性能。
 * 
 * 2. 在重新生成内联缓存之前，通常需要先清除之前的缓存。
 */

// 定义一个简单的对象
const obj = {
  name: 'John',
  age: 30,
  gender: 'male'
};

// 定义一个函数，用于获取对象的属性值
function getProperty(obj, prop) {
  return obj[prop];
}

// 测试函数调用的性能
// 在第一次调用 getProperty(obj, 'name') 时，V8 引擎会根据 obj 的类型（即 Object 类型）生成一份内联缓存，用于存储 obj 的属性名和属性值的对应关系
console.log('--- 第一次调用 ---');
console.time('Execution Time');
for (let i = 0; i < 10000000; i++) {
  getProperty(obj, 'name');
}
console.timeEnd('Execution Time');


// 会比较快, 直接用缓存
console.log('--- 第二次调用 ---');
console.time('Execution Time2');
for (let i = 0; i < 10000000; i++) {
  getProperty(obj, 'name');
}
console.timeEnd('Execution Time2');


// 换个属性名, 重新走一遍缓存流程
// 在重新生成内联缓存之前，通常需要先清除之前的缓存。
// 这是因为内联缓存是基于先前的调用结果构建的，
// 之前的调用结果已经过时或者不再适用于当前的上下文, 所以需要重新生成内联缓存。
console.log('--- 第三次调用 ---');
console.time('Execution Time三');
for (let i = 0; i < 10000000; i++) {
  getProperty(obj, 'gender');
}
console.timeEnd('Execution Time三');


