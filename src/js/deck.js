'use strict';

class Decks {
  constructor (title) {
    this.flashcards = [];
  }

  addFlashcard(fc) {
    this.flashcards.push(fc);
  }

  deleteFlashcard() {}

  load() {
    return new Promise((resolve, reject) => {
      const promises = [];
      const path = "/tests";

        firebase.database().ref(path).once('value').then((snapshot) => {
          const flashcardData = snapshot.val();
          for (const prop in flashcardData) {
            promises.push(new Promise((resolve, reject) => {
              const newFlashcard = new Flashcard();
              newFlashcard.load(path + "/" + prop).then(() => {
                this.flashcards.push(newFlashcard);
                resolve();
              }, reason => {
                reject(reason);
              });
            }));
          };

          Promise.all(promises).then(values => {
            console.log('Decks finished loading flashcards.');
            resolve();
          }, reason => {
            reject(reason);
          });
        });

    });
  }
}

if (typeof module !== 'undefined') module.exports = Flashcard;
