'use strict';

class Card {
  constructor(obj) {
    let defaults = {
      id:     Date.now().toString() + Math.random() * (100000 - 1) + 1,
      synced: 0,
      view:   'front',
      back:   'The back of the flashcard',
      deckId: 0,
      front:  'The front of the flashcard',
      title:  'The Default Title'
    }

    Object.assign(defaults, obj);

    this.id     = defaults.id;
    this.synced = defaults.synced;
    this.view   = defaults.view;
    this.back   = defaults.back;
    this.deckId = defaults.deckId;
    this.front  = defaults.front;
    this.title  = defaults.title;
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

  load(db, id) {
    return new Promise((resolve) => {
      db.getCard(id).then(card => {
        this.back   = card.back;
        this.deckId = card.deckId;
        this.front  = card.front;
        this.id     = card.id;
        this.synced = card.synced;
        this.title  = card.id;
        resolve(this);
      });
    });
  }

  save(db) {
    db.setCard({
      back:   this.back,
      deckId: this.deckId,
      front:  this.front,
      id:     this.id,
      synced: 0,
      title:  this.title
    });
  }
}

module.exports = Card;
