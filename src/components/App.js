const { h, Component } = require('preact');
const styles = require('./App.scss');

const Navigation = require('./Navigation');
const TimelineEvent = require('./TimelineEvent');

class App extends Component {
  constructor(props) {
    super(props);

    this.onScroll = this.onScroll.bind(this);

    this.state = {
      timelineAttachment: 'before'
    };
  }

  componentDidMount() {
    window.addEventListener('scroll', this.onScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll);
  }

  onScroll() {
    if (!this.wrapper) return;

    const bounds = this.wrapper.getBoundingClientRect();

    let timelineAttachment;
    if (bounds.top > 0) {
      timelineAttachment = 'before';
    } else if (bounds.bottom < window.innerHeight) {
      timelineAttachment = 'after';
    } else {
      timelineAttachment = 'during';
    }

    this.setState({ timelineAttachment });
  }

  render({ section }) {
    const timelineStyle = {
      height: window.innerHeight + 'px'
    };

    return (
      <div className={styles.wrapper} ref={el => (this.wrapper = el)}>
        <Navigation style={timelineStyle} events={section.events} attachment={this.state.timelineAttachment} />
        <div className={styles.content}>
          {section.events.map(event => <TimelineEvent id={event.idx} nodes={event.nodes} />)}
        </div>
      </div>
    );
  }
}

module.exports = App;
