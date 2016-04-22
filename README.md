### xpager.js ###
用于封装[常规]页面 JavaScript 代码逻辑, 负责页面生命周期管理, 统一管理事件, 当前版本依赖 jQuery/Function.prototype.bind.

### 组件接口文档 ###
* inherits - 创建自定义 XPager 类, `XPager.inherits(properties, [classProperties])`
* init - 如果定义了 `init` 函数, 当 XPager 实例化时该函数将被立即执行, 其参数为实例化 XPager 时, 传入的参数.
* el - 所有 XPager 组件都拥有一个 DOM 元素(el 属性).
* $ - jQuery 或 Zepto, 每个 XPager 都将拥有 $ 函数，可以在视图元素查询作用域内运行, 等价于运行: $(selector, this.el).
* $el - DOM 元素 => jQuery (DOM 元素) 对象.
* render - 默认为空函数, 重写该方法可以实现渲染相关视图模板, 推荐该方法总是 `return this`, 开启链式调用.
* remove - 从 DOM 中移除视图, 等价于 `$(view.el).remove()`.
* delegateEvents - 采用 jQuery 的 delegate 函数来为视图内的 DOM 事件提供回调函数声明. 事件对象格式: {'event selector' : 'callback'}, 省略 selector 则事件被绑定到视图的根元素（this.el）.

### 初始化组件 ###
`new XPager([options])`，选项:
* data {object|array} - 如果 XPager 组件进行初始化时需要数据, 可以通过外部传递 data, 组件内部可以通过 `this.data` 方式获取.
* el {string} - 每一个 XPager 组件都拥有一个 DOM 元素(el 属性), `this.el` 根据 tagName, attributes, className, 以及 id 属性创建, 默认为一个空 div.
* id {string} - 设置 XPager 组件 DOM 元素的 id.
* attributes {object} - 设置 XPager 组件 DOM 元素的 attr.
* className {string} - 设置 XPager 组件 DOM 元素的 class.
* tagName {string} - 设置 XPager 组件 DOM 元素的 tag.

### 例子 ###
```js
var DemoPager = XPager.inherits({

    events: {
      'click .click': 'clickHandler',
      'click #clickId': 'clickHandler1'
    },

    render: function() {
      this.$el.append('<button id="clickId">DBClick</button>');
    },

    clickHandler: function(e) {
      console.log('=====> clickHandler');
    },

    clickHandler1: function(e) {
      console.log('=====> clickHandler1');
    }

  });

  var demoPager = new DemoPager({
    el: '.container'
  });
  demoPager.render();
```
