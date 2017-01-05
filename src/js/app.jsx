'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

const DeckView    = require('./views/deck.view.jsx');

const DataManager = require('./db.js');
// const Card        = require('./card.js');
const Deck        = require('./deck.js');
const sw          = require('./sw.js');
const db          = new DataManager();

sw.register();

class App extends React.Component {
  constructor(props) {
    super(props);

    const that = this;

    db.init().then(() => {
      const d1 = new Deck();

      d1.load(db, '-K_SddtcEo_ny01fhehT').then(function (deck) {
        console.dir(deck);
        that.setState({
          deck: deck
        });
      }).catch(err => {
        console.log(err);
      });
    });

    this.state = {
      deck: {cards:[]}
    };

    this.nextCard = this.nextCard.bind(this);
    this.prevCard = this.prevCard.bind(this);
    this.flipCard = this.flipCard.bind(this);
  }

  // componentWillUpdate(nextProps) {}
  // componentWillUnmount() {}

  nextCard() {
    this.setState(prevState => {
      prevState.deck.getNextCard();
      return {
        deck: prevState.deck
      };
    });
  }

  prevCard() {
    this.setState(prevState => {
      prevState.deck.getPrevCard();
      return {
        deck: prevState.deck
      };
    });
  }

  flipCard() {
    this.setState(prevState => {
      prevState.deck.cards[prevState.deck.position].flip();
      return {
        deck: prevState.deck
      };
    });
  }

  render() {
    return (
      <div className="app">
        <ul className="controls">
          <li><button onClick={this.prevCard}>Previous</button></li>
          <li><button className="flip" onClick={this.flipCard}>Flip</button></li>
          <li><button onClick={this.nextCard}>Next</button></li>
        </ul>
        <DeckView deck={this.state.deck} currentCard={this.state.deck.position} />
      </div>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('app')
);

/*
const newCards = [
  {
    'title': 'Arrays',
    'front': 'What method do you use to add an element to the end of an Array?',
    'back': '<h2>Array.prototype.push()</h2><code>\nvar arr = [];\narr.push("new element");</code>'
  }, {
    'title': 'Arrays',
    'front': 'What method do you use to get an element from the end of an Array?',
    'back': '<h2>Array.prototype.pop()</h2><code>\nvar arr = ["element"];\narr.pop();\n// "element"</code>'
  }, {
    'title': 'Objects',
    'front': 'How do you iterate through all the properties of an Object?',
    'back': "<h2>For in</h2><code>\nfor (prop in obj) {  \n  if (obj.hasOwnProperty(prop)) {\n    console.log(obj[prop]);\n  }\n}</code>"
  }, {
    'title': 'Strings',
    'front': 'How do you replace a part of a string with another string?',
    'back': "<h2>String.prototype.replace()</h2><code>\nvar str = 'Twas the night...';\nvar str2 = str.replace(\n  /'Twas'/i, \n  'It was'\n);\nconsole.log(newstr);\n// It was the night...</code>"
  }, {
    'title': 'Strings',
    'front': 'How do you remove the whitespace from the left and right sides of a string?',
    'back': "<h2>String.prototype.trim()</h2><code>\nvar orig = '   foo  ';\nconsole.log(orig.trim());\n// 'foo'\n</code>"
  }
];

  const deck = new Deck();

  deck.load(db, "-K_SddtcEo_ny01fhehT").then(function (d) {
    newCards.forEach((c) => {
      const card = new Card({
        title: c.title,
        back:  c.back,
        front: c.front,
        deckId: d.id
      });
      d.addCard(card);
    });

    d.save(db);
  }).catch(err => {
    console.log(err);
  });


  const deck = new Deck('Programatically Added');
  for (let i = 0; i < 5; i++) {
    const card = new Card({
        title: 'Test card ' + i,
        back:  'test back ' + i,
        front: 'test front ' + i,
        deckId: deck.id
    });
    deck.addCard(card);
  }
  deck.save(db);
*/