(function() {

  var pager;

  QUnit.module('XPager', {

    beforeEach: function(assert) {
      $('#qunit-fixture').append(
        '<div id="testElement"><h1>Test</h1></div>'
      );

      pager = new XPager({
        id: 'test-pager',
        className: 'test-pager',
        other: 'non-special-option'
      });
    },

    afterEach: function() {
      $('#testElement').remove();
      $('#test-pager').remove();
    }

  });

  QUnit.test('constructor', function(assert) {
    assert.expect(3);
    assert.equal(pager.el.id, 'test-pager');
    assert.equal(pager.el.className, 'test-pager');
    assert.equal(pager.el.other, void 0);
  });

  QUnit.test('$', function(assert) {
    assert.expect(2);
    var myPager = new XPager;
    myPager.setElement('<p><a><b>test</b></a></p>');
    var result = myPager.$('a b');

    assert.strictEqual(result[0].innerHTML, 'test');
    assert.ok(result.length === +result.length);
  });

  QUnit.test('$el', function(assert) {
    assert.expect(3);
    var myPager = new XPager;
    myPager.setElement('<p><a><b>test</b></a></p>');
    assert.strictEqual(myPager.el.nodeType, 1);

    assert.ok(myPager.$el instanceof $);
    assert.strictEqual(myPager.$el[0], myPager.el);
  });

  QUnit.test('init', function(assert) {
    assert.expect(1);
    var Pager = XPager.inherits({
      init: function() {
        this.one = 1;
      }
    });

    assert.strictEqual(new Pager().one, 1);
  });

  QUnit.test('render', function(assert) {
    assert.expect(1);
    var myPager = new XPager;
    assert.equal(myPager.render(), myPager, '#render returns the pager instance');
  });

  QUnit.test('delegateEvents', function(assert) {
    assert.expect(6);
    var counter1 = 0,
      counter2 = 0;

    var myPager = new XPager({
      el: '#testElement'
    });
    myPager.increment = function() {
      counter1++;
    };
    myPager.$el.on('click', function() {
      counter2++;
    });

    var events = {
      'click h1': 'increment'
    };

    myPager.delegateEvents(events);
    myPager.$('h1').trigger('click');
    assert.equal(counter1, 1);
    assert.equal(counter2, 1);

    myPager.$('h1').trigger('click');
    assert.equal(counter1, 2);
    assert.equal(counter2, 2);

    myPager.delegateEvents(events);
    myPager.$('h1').trigger('click');
    assert.equal(counter1, 3);
    assert.equal(counter2, 3);
  });

  QUnit.test('delegate', function(assert) {
    assert.expect(3);
    var myPager = new XPager({
      el: '#testElement'
    });
    myPager.delegate('click', 'h1', function() {
      assert.ok(true);
    });
    myPager.delegate('click', function() {
      assert.ok(true);
    });
    myPager.$('h1').trigger('click');

    assert.equal(myPager.delegate(), myPager, '#delegate returns the pager instance');
  });

  QUnit.test('delegateEvents allows functions for callbacks', function(assert) {
    assert.expect(3);
    var myPager = new XPager({
      el: '<p></p>'
    });
    myPager.counter = 0;

    var events = {
      click: function() {
        this.counter++;
      }
    };

    myPager.delegateEvents(events);
    myPager.$el.trigger('click');
    assert.equal(myPager.counter, 1);

    myPager.$el.trigger('click');
    assert.equal(myPager.counter, 2);

    myPager.delegateEvents(events);
    myPager.$el.trigger('click');
    assert.equal(myPager.counter, 3);
  });

  QUnit.test('delegateEvents ignore undefined methods', function(assert) {
    assert.expect(0);
    var myPager = new XPager({
      el: '<p></p>'
    });
    myPager.delegateEvents({
      'click': 'undefinedMethod'
    });
    myPager.$el.trigger('click');
  });

  QUnit.test('undelegateEvents', function(assert) {
    assert.expect(7);
    var counter1 = 0,
      counter2 = 0;

    var myPager = new XPager({
      el: '#testElement'
    });
    myPager.increment = function() {
      counter1++;
    };
    myPager.$el.on('click', function() {
      counter2++;
    });

    var events = {
      'click h1': 'increment'
    };

    myPager.delegateEvents(events);
    myPager.$('h1').trigger('click');
    assert.equal(counter1, 1);
    assert.equal(counter2, 1);

    myPager.undelegateEvents();
    myPager.$('h1').trigger('click');
    assert.equal(counter1, 1);
    assert.equal(counter2, 2);

    myPager.delegateEvents(events);
    myPager.$('h1').trigger('click');
    assert.equal(counter1, 2);
    assert.equal(counter2, 3);

    assert.equal(myPager.undelegateEvents(), myPager, '#undelegateEvents returns the pager instance');
  });

  QUnit.test('undelegate', function(assert) {
    assert.expect(1);
    var myPager = new XPager({
      el: '#testElement'
    });
    myPager.delegate('click', function() {
      assert.ok(false);
    });
    myPager.delegate('click', 'h1', function() {
      assert.ok(false);
    });

    myPager.undelegate('click');

    myPager.$('h1').trigger('click');
    myPager.$el.trigger('click');

    assert.equal(myPager.undelegate(), myPager, '#undelegate returns the pager instance');
  });

  QUnit.test('undelegate with passed handler', function(assert) {
    assert.expect(1);
    var myPager = new XPager({
      el: '#testElement'
    });
    var listener = function() {
      assert.ok(false);
    };
    myPager.delegate('click', listener);
    myPager.delegate('click', function() {
      assert.ok(true);
    });
    myPager.undelegate('click', listener);
    myPager.$el.trigger('click');
  });

  QUnit.test('undelegate with selector', function(assert) {
    assert.expect(2);
    var myPager = new XPager({
      el: '#testElement'
    });
    myPager.delegate('click', function() {
      assert.ok(true);
    });
    myPager.delegate('click', 'h1', function() {
      assert.ok(false);
    });
    myPager.undelegate('click', 'h1');
    myPager.$('h1').trigger('click');
    myPager.$el.trigger('click');
  });

  QUnit.test('undelegate with handler and selector', function(assert) {
    assert.expect(2);
    var myPager = new XPager({
      el: '#testElement'
    });
    myPager.delegate('click', function() {
      assert.ok(true);
    });
    var handler = function() {
      assert.ok(false);
    };
    myPager.delegate('click', 'h1', handler);
    myPager.undelegate('click', 'h1', handler);
    myPager.$('h1').trigger('click');
    myPager.$el.trigger('click');
  });

  QUnit.test('tagName can be provided as a string', function(assert) {
    assert.expect(1);
    var Pager = XPager.inherits({
      tagName: 'span'
    });

    assert.equal(new Pager().el.tagName, 'SPAN');
  });

  QUnit.test('_ensureElement with DOM node el', function(assert) {
    assert.expect(1);
    var Pager = XPager.inherits({
      el: document.body
    });

    assert.equal(new Pager().el, document.body);
  });

  QUnit.test('_ensureElement with string el', function(assert) {
    assert.expect(3);
    var Pager = XPager.inherits({
      el: 'body'
    });
    assert.strictEqual(new Pager().el, document.body);

    Pager = XPager.inherits({
      el: '#testElement > h1'
    });
    assert.strictEqual(new Pager().el, $('#testElement > h1').get(0));

    Pager = XPager.inherits({
      el: '#nonexistent'
    });
    assert.ok(!new Pager().el);
  });

  QUnit.test('with className and id functions', function(assert) {
    assert.expect(2);
    var Pager = XPager.inherits({
      className: function() {
        return 'className';
      },
      id: function() {
        return 'id';
      }
    });

    assert.strictEqual(new Pager().el.className, 'className');
    assert.strictEqual(new Pager().el.id, 'id');
  });

  QUnit.test('with attributes', function(assert) {
    assert.expect(2);
    var Pager = XPager.inherits({
      attributes: {
        'id': 'id',
        'class': 'class'
      }
    });

    assert.strictEqual(new Pager().el.className, 'class');
    assert.strictEqual(new Pager().el.id, 'id');
  });

  QUnit.test('should default to className/id properties', function(assert) {
    assert.expect(4);
    var Pager = XPager.inherits({
      className: 'backboneClass',
      id: 'backboneId',
      attributes: {
        'class': 'attributeClass',
        'id': 'attributeId'
      }
    });

    var myPager = new Pager;
    assert.strictEqual(myPager.el.className, 'backboneClass');
    assert.strictEqual(myPager.el.id, 'backboneId');
    assert.strictEqual(myPager.$el.attr('class'), 'backboneClass');
    assert.strictEqual(myPager.$el.attr('id'), 'backboneId');
  });

  QUnit.test('custom events', function(assert) {
    assert.expect(2);
    var Pager = XPager.inherits({
      el: $('body'),
      events: {
        fake$event: function() {
          assert.ok(true);
        }
      }
    });

    var myPager = new Pager;
    $('body').trigger('fake$event').trigger('fake$event');

    $('body').off('fake$event');
    $('body').trigger('fake$event');
  });

  QUnit.test('#1048 - setElement uses provided object.', function(assert) {
    assert.expect(2);
    var $el = $('body');

    var myPager = new XPager({
      el: $el
    });
    assert.ok(myPager.$el === $el);

    myPager.setElement($el = $($el));
    assert.ok(myPager.$el === $el);
  });

  QUnit.test('#986 - Undelegate before changing element.', function(assert) {
    assert.expect(1);
    var button1 = $('<button></button>');
    var button2 = $('<button></button>');

    var Pager = XPager.inherits({
      events: {
        click: function(e) {
          assert.ok(myPager.el === e.target);
        }
      }
    });

    var myPager = new Pager({
      el: button1
    });
    myPager.setElement(button2);

    button1.trigger('click');
    button2.trigger('click');
  });

  QUnit.test('#1172 - Clone attributes object', function(assert) {
    assert.expect(2);
    var Pager = XPager.inherits({
      attributes: {
        foo: 'bar'
      }
    });

    var pager1 = new Pager({
      id: 'foo'
    });
    assert.strictEqual(pager1.el.id, 'foo');

    var pager2 = new Pager();
    assert.ok(!pager2.el.id);
  });

  QUnit.test('remove', function(assert) {
    assert.expect(2);
    var myPager = new XPager;
    document.body.appendChild(pager.el);

    myPager.delegate('click', function() {
      assert.ok(false);
    });

    assert.equal(myPager.remove(), myPager, '#remove returns the pager instance');
    myPager.$el.trigger('click');

    // In IE8 and below, parentNode still exists but is not document.body.
    assert.notEqual(myPager.el.parentNode, document.body);
  });

  QUnit.test('setElement', function(assert) {
    assert.expect(3);
    var myPager = new XPager({
      events: {
        click: function() {
          assert.ok(false);
        }
      }
    });
    myPager.events = {
      click: function() {
        assert.ok(true);
      }
    };
    var oldEl = myPager.el;
    var $oldEl = myPager.$el;

    myPager.setElement(document.createElement('div'));

    $oldEl.click();
    myPager.$el.click();

    assert.notEqual(oldEl, myPager.el);
    assert.notEqual($oldEl, myPager.$el);
  });

})();
