/**
 * xpager 0.0.1
 * 封装页面 JavaScript 代码逻辑, 负责页面生命周期管理, 统一管理事件
 * 
 * https://github.com/XScripter/xpager#readme
 * 
 * Copyright 2016, 前道
 * The XScripter.com
 * http://www.xscripter.com/
 * 
 * Licensed under MIT
 * 
 * Released on: April 22, 2016
 */
(function(global, factory) {

  if (typeof module === 'object' && typeof module.exports === 'object') {
    var $;
    try { $ = require('jquery'); } catch (e) {}

    module.exports = global.document ?
      factory(global, $) :
      function(w) {
        if (!w.document) {
          throw new Error('XPager 需要运行在浏览器环境中');
        }
        return factory(w, $);
      };
  } else {
    global.XPager = factory(global, global.jQuery || global.Zepto || global.ender || global.$);
  }

}(typeof window !== 'undefined' ? window : this, function(window, $) {
  /*jshint -W030 */
  var XPager = function(options) {
  
    var i, key, pageSettings = {},
      settingKeys = ['data', 'options', 'el', 'id', 'attributes', 'className', 'tagName'];
  
    this.pid = 'xpager' + new Date().getTime();
  
    for(i = 0; i < settingKeys.length; i++) {
      key = settingKeys[i];
      if (options[key] !== void 0) {
        pageSettings[key] = options[key];
      }
    }
  
    $.extend(this, pageSettings);
    this._ensureElement();
    this.init.apply(this, arguments);
  };
  
  var previousXPager = window.XPager;
  XPager.VERSION = '0.0.1';
  
  XPager.noConflict = function() {
    window.XPager = previousXPager;
    return this;
  };
  
  XPager.inherits = function(protoProps, staticProps) {
    var Parent = this;
    var Child;
  
    protoProps  = protoProps  || {};
    staticProps = staticProps || {};
  
    if (protoProps.hasOwnProperty('constructor') && typeof protoProps.constructor === 'function') {
      Child = protoProps.constructor;
    } else {
      Child = function() {
        Parent.apply(this, arguments);
      };
    }
  
    $.extend(Child, Parent, staticProps);
  
    function Surrogate() {}
    Surrogate.prototype = Parent.prototype;
    Child.prototype = new Surrogate();
  
    $.extend(Child.prototype, protoProps);
  
    Child.prototype.constructor = Child;
  
  
    return Child;
  };
  
  XPager.prototype = {
  
    tagName: 'div',
  
    $: function(selector) {
      return this.$el.find(selector);
    },
  
    init: function() {},
  
    render: function() {
      return this;
    },
  
    remove: function() {
      this._removeElement();
      return this;
    },
  
    _removeElement: function() {
      this.$el.remove();
    },
  
    setElement: function(element) {
      this.undelegateEvents();
      this._setElement(element);
      this.delegateEvents();
      return this;
    },
  
    _setElement: function(el) {
      this.$el = $(el);
      this.el = this.$el[0];
    },
  
    delegateEvents: function(events) {
      events || (events = this.events);
      if (!events) {
        return this;
      }
      this.undelegateEvents();
      for (var key in events) {
        var method = events[key];
        if (!$.isFunction(method)) {
          method = this[method];
        }
        if (!method) {
          continue;
        }
        var match = key.match(/^(\S+)\s*(.*)$/);
        this.delegate(match[1], match[2], method.bind(this));
      }
      return this;
    },
  
    delegate: function(eventName, selector, listener) {
      this.$el.on(eventName + '.delegateEvents' + this.pid, selector, listener);
      return this;
    },
  
    undelegateEvents: function() {
      if (this.$el) {
        this.$el.off('.delegateEvents' + this.pid);
      }
      return this;
    },
  
    undelegate: function(eventName, selector, listener) {
      this.$el.off(eventName + '.delegateEvents' + this.pid, selector, listener);
      return this;
    },
  
    _createElement: function(tagName) {
      return document.createElement(tagName);
    },
  
    _ensureElement: function() {
      if (!this.el) {
        var attrs = $.extend({}, this.attributes);
        if (this.id) {
          attrs.id = this.id;
        }
        if (this.className) {
          attrs['class'] = this.className;
        }
        this.setElement(this._createElement(this.tagName));
        this._setAttributes(attrs);
      } else {
        this.setElement(this.el);
      }
    },
  
    _setAttributes: function(attributes) {
      this.$el.attr(attributes);
    }
  
  };
  

  return XPager;

}));