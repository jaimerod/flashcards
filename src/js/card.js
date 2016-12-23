'use strict';

class Card {
  constructor (obj) {
    this.view = "front";

    if (typeof obj !== 'undefined') {
      this.back = obj.back;
      this.front = obj.front;
      this.title = obj.title;
    }
  }

  flip() {
    if (this.view === "front") {
      this.view = "back";
    } else {
      this.view = "front";
    }
  }

  getView() {
    return this[this.view];
  }

  save(parent) {
    const database = firebase.database();
    const cardPath = parent + '/cards';
    const payload = {
      title: this.title,
      front: this.front,
      back: this.back
    }

    if (typeof this.id === 'undefined') {
      const cardRef = database.ref(cardPath);
      const newCard = cardRef.push();
      newCard.set(payload);
      this.id = newCard.key;
    } else {
      // update flashcards
      database.ref(cardPath + "/" + this.id).set(payload);
    }
  }

  load(id) {
    return new Promise((resolve) => {
      firebase.database().ref(id).once('value').then((snapshot) => {
        const data = snapshot.val();
        this.title = data.title;
        this.front = data.front;
        this.back  = data.back;
        console.log('Finished loading card.');
        resolve();
      });
    });
  }
}

module.exports = Card;
