'use strict';

const Card = require('./card.js');

class Deck {
  constructor (title) {
    this.id       = Date.now() + Math.random() * (100000 - 1) + 1;
    this.cards    = [];
    this.title    = title;
    this.synced   = 0;
    this.position = 0;
    this.length   = 0;
  }

  addCard(c) {
    this.cards.push(c);
    this.length++;
  }

  getPrevCard() {
    if (this.position === 0) {
      this.position = this.cards.length;
    }

    return this.cards[--this.position];
  }

  getNextCard() {
    if (this.position === this.cards.length - 1) {
      this.position = -1;
    }

    return this.cards[++this.position];
  }

  getCard(idx) {
    return this.cards[idx];
  }

  getCards() {
    return this.cards;
  }

  getTitle() {
    return this.title;
  }

  shuffle() {
    let rand, temp, i;

    for (i = this.cards.length; i; i--) {
      rand = Math.floor(Math.random() * i);
      temp = this.cards[i - 1];
      this.cards[i - 1] = this.cards[rand];
      this.cards[rand] = temp;
    }

    this.position = -1;
  }

  load(db, id) {
    return new Promise((resolve, reject) => {
      db.getDeck(id).then(deck => {
        this.id = deck.id;
        this.synced = deck.synced;
        this.title = deck.title;

        db.getCardsForDeck(this.id).then(cards => {
          cards.forEach(item => {
            const card  = new Card(item);
            card.id     = item.id;
            card.synced = 1;
            this.addCard(card);
          });

          resolve(this);
        });
      }).catch(err => {
        reject(err + 'Failed to load Deck ' + id + '.');
      });
    });
  }

  save(db) {
    db.setDeck({
      id:     this.id,
      synced: 0,
      title:  this.title
    });

    this.cards.forEach(card => {
      card.save(db);
    });
  }
}

module.exports = Deck;
