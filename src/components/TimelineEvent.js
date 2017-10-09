const { h, Component } = require('preact');

class TimelineEvent extends Component {
  shouldComponentUpdate() {
    return false;
  }

  componentDidMount() {
    if (!this.wrapper) return;

    this.props.nodes.forEach(node => {
      this.wrapper.appendChild(node);
    });
  }

  componentWillUnmount() {
    if (!this.wrapper) return;

    this.props.nodes.forEach(node => {
      this.wrapper.removeChild(node);
    });
  }

  render() {
    return <div ref={el => (this.wrapper = el)} id={`event-${this.props.id}`} />;
  }
}

module.exports = TimelineEvent;
