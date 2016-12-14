var assert = require('chai').assert;
var Card = require('../src/js/card.js');
var Flashcard = require('../src/js/flashcard.js');

describe('Flashcards', function () {
	var initialNumberOfCards = 100;
	var f = new Flashcard('test');

	for(i = 0; i < initialNumberOfCards; i++) {
		f.addCard(new Card({
			title: 'Sample title' + i,
			front: 'Sample Front ' + i,
			back: 'Sample Back ' + i
		}));
	}

	describe('init', function () {
    it('should have a title "test"', function () {
      assert.equal(f.title, 'test');
    });
	});

	describe('addCard', function () {
		it('should have a ' + initialNumberOfCards + ' cards', function () {
			assert.equal(f.length, initialNumberOfCards);
		});

		it('should iterate the length when a new card is added.', function () {
			const length = f.length;

			f.addCard(new Card({
				title: 'Sample title ' + f.length + 1,
				front: 'Sample front ' + f.length + 1,
				back: 'Sample back ' + f.length + 1
			}));

			assert.equal(f.length, length + 1);
		});
	});

	describe('getNextCard', function () {
		it('should get the next card in the deck', function () {
			const compareCard = f.cards[f.position];
			const nextCard = f.getNextCard();
			assert.equal(compareCard, nextCard);
		});

		it('should iterate the position', function () {
			const oldPosition = f.position;
			f.getNextCard();
			assert.equal(oldPosition + 1, f.position);
		});

		it('should start from the beginning if we run out of cards', function () {
			f.position = f.length;
			f.getNextCard();
			assert.equal(f.position, 0);
		});
	});

	describe('getCard', function () {
		it('should return the card at the index', function () {
			assert.equal(f.cards[0], f.getCard(0));
		});
	});

	describe('getCards', function () {
		it('should return all the cards', function () {
			assert.equal(f.cards, f.getCards());
		});
	});

	describe('getTitle', function () {
		it('should get the title of the flashcards', function () {
			assert.equal(f.title, f.getTitle());
		});
	});

	describe('shuffle', function () {
		it('should change the order of the cards', function () {
			const cards = f.cards.slice(0);
			f.shuffle();
			assert.notEqual(cards, f.getCards());
		});

		it('should reset the position', function () {
			f.shuffle();
			f.getNextCard();
			assert.equal(f.position, 0);
		});
	});
});