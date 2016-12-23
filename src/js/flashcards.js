'use strict';

const Card = require('./card.js');

class Flashcard {
  constructor (title) {
    this.cards = [];
    this.title = title;
    this.position = -1;
    this.length = 0;
  }

  addCard(c) {
    this.cards.push(c);
    this.length++;
  }

  getNextCard() {
    if (this.position === this.cards.length) {
      this.position = -1;
    }
    return this.cards[this.position++];
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

  load(id) {
    return new Promise((resolve, reject) => {
      const promises = [];

      firebase.database().ref(id).once('value').then((snapshot) => {
        const data = snapshot.val();
        this.id = id;
        this.title = data.title;

        for (const prop in data.cards) {
          promises.push(new Promise((resolve, reject) => {
            const newCard = new Card();
            const cardId = id + "/cards/" + prop;
            newCard.load(cardId).then(() => {
              this.cards.push(newCard);
              resolve();
            }, reason => {
              reject(reason);
            });
          }));
        };

        Promise.all(promises).then(values => {
          console.log('Flashcards finished loading flashcards.');
          resolve();
        }, reason => {
          console.log('Error: Loading Flashcards');
          reject(reason);
        });
      });
    });
  }

  save(parent) {
    const database = firebase.database();

    if (typeof this.id === 'undefined') {
      const flashcardRef = database.ref(parent);
      const newFlashcard = flashcardRef.push();
      newFlashcard.set({
        title: this.title
      });
      this.id = newFlashcard.key;
    } else {
      // update flashcards
      database.ref(parent + '/' + this.id).set({
        title: this.title
      });
    }

    this.cards.forEach((item) => {
      item.save(parent + '/' + this.id);
    });
  }
}

module.exports = Flashcard;
