'use strict';

// Load Classes
const Card = require('./card.js');
const Decks = require('./decks.js');
const Flashcard = require('./flashcards.js');
const Notifier = require('./notifier.js');

const flashcardPath = "/flashcards";
const toast = new Notifier();
toast.sendMessage('Loaded');

// Load All flashcard decks
const decks = new Decks();
decks.load().then(() => {
  console.log('Decks promise finished.');
  console.dir(decks);
  const fc = new Flashcard('Programatically Added');

  for (let i = 0; i < 5; i++) {
    const newCard = new Card({
      title: 'Test card ' + i,
      back: 'test back ' + i,
      front: 'test back ' + i
    });
    fc.addCard(newCard);
    fc.save(flashcardPath);
    decks.addFlashcard(fc);
  }
}, reason => {
  console.log('Error: ' + reason);
});






















// const flashcardRef = firebase.database().ref('/tests');
// const newFlashcard = flashcardRef.push();
// newFlashcard.set({
//   username: 'testuser',
//   email: 'test@email.com',
//   profile_picture : '//cdn.rodriguez-jr.com/test.png'
// });

// firebase.database().ref('/tests/1').once('value').then(function(snapshot) {
//   console.dir(snapshot.val());
// });

// Sample making a new Flashcard
//const fc = new Flashcard('Test Flashcards 3');
//fc.save();



/*
function writeUserData(userId, name, email, imageUrl) {
  firebase.database().ref('users/' + userId).set({
    username: name,
    email: email,
    profile_picture : imageUrl
  });
}
*/
