import React from 'react';

class CardView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentSide: 'front'
    };

    if (props.visible === 'true') {
      this.state.visibility = {display: 'block'};
    } else {
      this.state.visibility = {display: 'none'};
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.visible === 'true') {
      this.setState({visibility: {display: 'block'}});
    } else {
      this.setState({visibility: {display: 'none'}});
    }
  }

  // componentWillUpdate(nextProps) {  }
  // componentWillUnmount() {}

  frontVisible() {
    if (this.props.card.view === 'front') {
      return {display: 'block'};
    }

    return {display: 'none'};
  }

  backVisible() {
    if (this.props.card.view === 'back') {
      return {display: 'block'};
    }

    return {display: 'none'};
  }

  createMarkup(str) {
    return {__html: str};
  }

  render() {
    return (
      <div style={this.state.visibility} className="card">
        <h1>{this.props.card.title}</h1>
        <ul>
          <li style={this.frontVisible()} className="front">{this.props.card.front}</li>
          <li style={this.backVisible()} className="back" dangerouslySetInnerHTML={this.createMarkup(this.props.card.back)}></li>
        </ul>
      </div>
    );
  }
}

module.exports = CardView;
