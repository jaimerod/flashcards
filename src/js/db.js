'use strict';

const Dexie    = require('dexie');
const firebase = require('firebase');
const Notifier = require('./notifier.js');

class DataManager {
  constructor() {
    // Setup firebase
    firebase.initializeApp({
      apiKey: "AIzaSyBcxHXTQWPAVYS-2viARpVNOSXFlvOvNgk",
      authDomain: "flashcards-cb587.firebaseapp.com",
      databaseURL: "https://flashcards-cb587.firebaseio.com",
      storageBucket: "flashcards-cb587.appspot.com",
      messagingSenderId: "666358064594"
    });

    this.toast    = new Notifier();
    this.cardPath = "/cards";
    this.deckPath = "/decks";
    this.db       = new Dexie("flashcards");
    this.fdb      = firebase.database();

    // manage online and offline
    this.offline = navigator.onLine === false;

    window.addEventListener('online', () => {
      this.toast.sendMessage('App is now online.');
      this._sync();
      this.offline = false;
    });

    window.addEventListener('offline', () => {
      this.toast.sendMessage('App is now offline.');
      this.offline = true;
    });

    this.db.version(1).stores({
      decks: 'id, synced, title',
      cards: 'id, synced, title, *deckId, back, front'
    });

    this.db.open().then(() => {
      this._sync();
    }).catch(err => {
      console.log('DB Failed to open');
    });
  }

  _deleteCard(id) {
    return this.db.transaction('rw!', this.db.cards, () => {
      if (Array.isArray(id)) {
        id.forEach((item) => {
          this.db.cards.delete(item);
        });
      } else {
        this.db.cards.delete(id);
      }
    });
  }

  _deleteDeck(id) {
    return this.db.transaction('rw!', this.db.decks, () => {
      if (Array.isArray(id)) {
        id.forEach((item) => {
          this.db.decks.where('id').equals(item).delete();
        });
      } else {
        this.db.decks.where('id').equals(id).delete();
      }
    });
  }

  _loadCards() {
    return new Promise((resolve, reject) => {
      const promises = [];

      this.fdb
        .ref(this.cardPath)
        .once('value')
        .then(snapshot => {
          const library = snapshot.val();

          for (const card in library) {
            promises.push(new Promise((resolve, reject) => {
              this.db.cards.put({
                back:   library[card].back,
                deckId: library[card].deckId,
                front:  library[card].front,
                id:     card,
                synced: 1,
                title:  library[card].title
              }).then(() => {
                resolve();
              }).catch(err => {
                reject(err);
              });
            }));
          }

          Promise.all(promises).then(values => {
            console.log('Finished loading cards.');
            resolve();
          }, reason => {
            reject(reason);
          });
        });
    });
  }

  _loadDecks() {
    return new Promise((resolve, reject) => {
      const promises = [];

      this.fdb
        .ref(this.deckPath)
        .once('value')
        .then(snapshot => {
          const library = snapshot.val();

          for (const deck in library) {
            promises.push(new Promise((resolve, reject) => {
              this.db.decks.put({
                id:     deck,
                synced: 1,
                title:  library[deck].title
              }).then(() => {
                resolve();
              }).catch(err => {
                reject(err);
              });
            }));
          }

          Promise.all(promises).then(values => {
            console.log('Finished loading decks.');
            resolve();
          }, reason => {
            reject(reason);
          });
        });
    });
  }

  _syncCards() {
    const toBeDeleted = [];

    return this.db.transaction('rw!', this.db.cards, () => {
      this.db.cards.where('synced').equals(0).each(card => {
        const payload = {
          'deckId': card.deckId,
          'title':  card.title,
          'front':  card.front,
          'back':   card.back,
          'synced': 1
        };

        if (card.id.toString().startsWith('-')) {
          this.fdb.ref(this.cardPath + "/" + this.id).set(payload);
        } else {
          const oldId = card.id;
          const cardRef = this.fdb.ref(this.cardPath);
          const newCard = cardRef.push();
          // Add card to firebase
          newCard.set(payload);
          payload.id = newCard.key;
          // Add card to indexedDB
          this.db.cards.add(payload);
          // Delete the old one
          toBeDeleted.push(oldId);
        }
      }).then(() => {
        this._deleteCard(toBeDeleted);
      });
    });
  }

  _syncDecks() {
    const toBeDeleted = [];

    return this.db.transaction('rw!', this.db.decks, this.db.cards, () => {
      this.db.decks.where('synced').equals(0).each(deck => {
        const payload  = {
          'title': deck.title,
          'synced': 1
        };

        if (deck.id.toString().startsWith('-')) {
          this.fdb.ref(this.deckPath + '/' + this.id).set(payload);
        } else {
          const oldId   = deck.id;
          const deckRef = this.fdb.ref(this.deckPath);
          const newDeck = deckRef.push();

          // Add deck to firebase
          newDeck.set(payload);
          payload.id = newDeck.key;
          // Add deck to indexedDB
          this.db.decks.add(payload)
          // Delete the old one
          toBeDeleted.push(oldId);

          // update deckID for cards
          this.db.cards.where('deckId').equals(oldId).each(card => {
            // Add to indexedDB
            card.deckId = newDeck.key;
            card.synced = 0;
            this.db.cards.put(card);
          });
        }
      }).then(() => {
        this._deleteDeck(toBeDeleted);
      });
    });
  }

  _sync() {
    if (this.syncing) return;

    if (!this.offline) {
      console.log('syncing');
      this.syncing = true;
      this._syncDecks().then(() => {
        this._syncCards().then(() => {

          this.syncing = false;
          console.log('syncing done.');
        });;
      });
    }
  }

  getCard(id) {
    return new Promise((resolve, reject) => {
      this.db.cards.where("id").equals(id).first(card => {
        resolve(card);
      }).catch(err => {
        console.dir(err);
        reject(err);
      });
    });
  }

  getDeck(id) {
    return new Promise((resolve, reject) => {
      this.db.decks.where("id").equals(id).first(deck => {
        if (typeof deck !== "undefined") {
          resolve(deck);
        } else {
          reject('Could not get the Deck ' + id + '.');
        }
      });
    });
  }

  setCard(obj) {
    this.db.cards.put(obj).then(() => {
      this._sync();
    });
  }

  setDeck(obj) {
    this.db.decks.put(obj).then(() => {
      this._sync();
    });
  }

  getCardsForDeck(id) {
    const cards = [];

    return new Promise((resolve, reject) => {
      this.db.cards.where("deckId").equals(id).each(card => {
        cards.push(card);
      }).then(() => {
        resolve(cards);
      });
    });
  }

  getDecks() {

  }

  init() {
    return new Promise((resolve, reject) => {
      const promises = [];

      if (!this.offline) {
        promises.push(this._loadCards());
        promises.push(this._loadDecks());
      }

      Promise.all(promises).then(values => {
        console.log('Finished loading data.');
        resolve();
      }, reason => {
        reject(reason);
      });
    });
  }
}

module.exports = DataManager;