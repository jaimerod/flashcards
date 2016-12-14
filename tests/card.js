var assert = require('chai').assert;
var Card = require('../src/js/card.js');

describe('Card', function () {
  var c = new Card({
    title: 'Sample title',
    front: 'Sample Front',
    back: 'Sample Back'
  });

	describe('init', function () {
    it('should have a front and back', function () {
      assert.typeOf(c.front, 'string');
      assert.typeOf(c.back,  'string');
    });

    it('should set the title from the constructor', function () {
      assert.equal(c.title, 'Sample title');
    });

    it('should set the front from the constructor', function() {
      assert.equal(c.front, 'Sample Front');
    });

    it('should set the back from the constructor', function() {
      assert.equal(c.back, 'Sample Back');
    });
	});

	describe('flip', function () {
		it('should cycle the view between front and back', function () {
			c.flip();
			assert.equal(c.view, "back");
			c.flip();
			assert.equal(c.view, "front");
		});
	});

	describe('getView', function () {
		it('should get the view based on this.view', function () {
			const front = c.getView();
			c.flip();
			const back = c.getView();
			assert.equal(front, c.front);
			assert.equal(back, c.back);
		});
	});
});