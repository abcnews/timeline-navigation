const { h, Component } = require('preact');
const styles = require('./App.scss');

const Navigation = require('./Navigation');
const TimelineEvent = require('./TimelineEvent');

class App extends Component {
  render({ section }) {
    return (
      <div className={styles.wrapper}>
        <Navigation events={section.events} />
        <div className={styles.content}>
          {section.events.map(event => <TimelineEvent id={event.idx} nodes={event.nodes} />)}
        </div>
      </div>
    );
  }
}

module.exports = App;
