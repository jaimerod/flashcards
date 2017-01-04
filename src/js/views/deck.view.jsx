import React from 'react';
import ReactDOM from 'react-dom';

var CardView = require('./card.view.jsx');

class DeckView extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="deck">
        <h1>{this.props.deck.title}</h1>

        {this.props.deck.cards.map((card, i, arr) => {
          var visible = (i === this.props.currentCard) ? "true" : "false";
          console.log(i + ' ' + visible);
          return (
            <CardView card={card} visible={visible} />
          );
        })}
      </div>
    );
  }
}

module.exports = DeckView;