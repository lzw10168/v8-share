// -----------------------------对象隐藏类 -----------------------------
/**
 * 1. 对于动态类型语言来说，由于类型的不确定性，在方法调用过程中，语言引擎每次都需要进行动态查询，这就造成大量的性能消耗，从而降低程序运行的速度
 * 2. 大多数的Javascript 引擎会采用哈希表的方式来存取属性和寻找方法。
 * 3. 而为了加快对象属性和方法在内存中的查找速度，V8引擎引入了隐藏类(Hidden Class)的机制，起到给对象分组的作用。
 * 4. 在初始化对象的时候，V8引擎会创建一个隐藏类，随后在程序运行过程中每次增减属性，就会创建一个新的隐藏类或者查找之前已经创建好的隐藏类。
 * 5. 每个隐藏类都会记录对应属性在内存中的偏移量，从而在后续再次调用的时候能更快地定位到其位置。
 */



// 不同初始化顺序的对象，所生成的隐藏类是不一样的。因此，在实际开发过程中，应该尽量保证属性初始化的顺序一致，这样生成的隐藏类可以得到共享。
// 同时，尽量在构造函数里就初始化所有对象成员，减少隐藏类的产生。
function optimizeHiddenClassDemo () {
  console.time('Execution Time');

  function Person(name, age) {
    this.name = name;
    this.age = age;
  }
  // 初始化隐藏类C0 ,无属性
  // 创建隐藏类C1 ,有属性name
  // 创建隐藏类C2 ,有属性name,age
  var obj = new Person("obj", 32);
  var list = new Person("list", 20);
  
  // C2 派生出C3 ,有属性name,age,email
  obj.email = "obj@qq.com";
  // C3 派生出C4 ,有属性name,age,email,job
  obj.job = "teacher";
  
  // C2 派生出C5 ,有属性name,age,job
  list.job = "developer";
  // C5 派生出C6 ,有属性name,age,job,email
  list.email = "obj@qq.com";
  // 记录结束时间
  console.timeEnd('Execution Time');

}
function optimizeHiddenClassDemo2 () {
  console.time('Execution Time');

  function Person(name, age) {
    this.name = name;
    this.age = age;
  }
  // 初始化隐藏类C0 ,无属性
  // 创建隐藏类C1 ,有属性name
  // 创建隐藏类C2 ,有属性name,age
  var obj = new Person("obj", 32);
  var list = new Person("list", 20);
  
  // C2 派生出C3 ,有属性name,age,email
  obj.email = "obj@qq.com";
  // C3 派生出C4 ,有属性name,age,email,job
  obj.job = "teacher";
  
  // 直接使用C3,有属性name,age,job
  list.email = "developer";
  // 直接使用C4,有属性name,age,job,email
  list.job = "obj@qq.com";
  // 记录结束时间
  console.timeEnd('Execution Time');

}

// 执行示例代码
console.log('--- 第一次调用 ---');
// 未做隐藏类优化, 时间长
optimizeHiddenClassDemo()


console.log('--- 第二次调用 ---');
// 隐藏类优化, 时间短
optimizeHiddenClassDemo2()
