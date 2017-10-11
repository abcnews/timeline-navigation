const { h, Component } = require('preact');
const styles = require('./App.scss');

const Navigation = require('./Navigation');
const TimelineEvent = require('./TimelineEvent');

class App extends Component {
  constructor(props) {
    super(props);

    this.onViewPortChanged = this.onViewPortChanged.bind(this);

    this.state = {
      currentEvent: null,
      timelineAttachment: 'before',
      indented: false,
      showLabels: true
    };
  }

  componentDidMount() {
    window.addEventListener('scroll', this.onViewPortChanged);
    window.addEventListener('resize', this.onViewPortChanged);
    this.onViewPortChanged();
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.onViewPortChanged);
    window.removeEventListener('resize', this.onViewPortChanged);
  }

  onViewPortChanged() {
    if (!this.wrapper) return;

    const bounds = this.wrapper.getBoundingClientRect();

    // See if the timeline needs to be indented
    this.setState(state => ({
      showLabels: bounds.width > 500,
      indented: bounds.left < 150
    }));

    // Check to see if a timeline event is active
    const fold = window.innerHeight * 0.05;

    const pastEvents = this.props.section.events.filter(event => {
      return event.nodes[0] && event.nodes[0].getBoundingClientRect().top < fold;
    });

    let lastSeenEvent = pastEvents[pastEvents.length - 1];
    if (!lastSeenEvent) lastSeenEvent = this.props.section.events[0];
    if (this.state.currentEvent !== lastSeenEvent) {
      this.setState(state => ({
        currentEvent: lastSeenEvent
      }));
    }

    // Attach the timeline navigation
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
      height: window.innerHeight + 'px',
      marginLeft: '-30px'
    };

    const contentStyle = {
      paddingLeft: '0px'
    };

    if (this.state.indented) {
      timelineStyle.marginLeft = this.state.showLabels ? '100px' : '20px';
      contentStyle.paddingLeft = this.state.showLabels ? '130px' : '50px';
    }

    return (
      <div className={styles.wrapper} ref={el => (this.wrapper = el)}>
        <Navigation
          style={timelineStyle}
          events={section.events}
          currentEvent={this.state.currentEvent}
          attachment={this.state.timelineAttachment}
          showLabels={this.state.showLabels}
        />
        <div className={styles.content} style={contentStyle}>
          {section.events.map(event => <TimelineEvent id={event.idx} nodes={event.nodes} />)}
        </div>
      </div>
    );
  }
}

module.exports = App;
