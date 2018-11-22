const { h, Component } = require('preact');
const scrollIntoView = require('scroll-into-view');
const FuzzyDates = require('@abcnews/fuzzy-dates');

const styles = require('./Navigation.scss');

function jiggleEvents(events) {
  const firstEvent = events[0].date.getTime();
  const lastEvent = events[events.length - 1].date.getTime();
  const timeDistance = lastEvent - firstEvent;

  let jiggledEvents = [];
  events
    .sort((a, b) => FuzzyDates.compare(a.date, b.date))
    .forEach((event, index) => {
      jiggledEvents.push(event);

      // Check how far away the next event is
      if (index !== events.length - 1) {
        const distanceToNextEvent = ((events[index + 1].date.getTime() - event.date.getTime()) / timeDistance) * 100;
        jiggledEvents.push({ distanceToNextEvent });
      }
    });

  return jiggledEvents;
}

class Navigation extends Component {
  constructor(props) {
    super(props);

    this.scrollToEvent = this.scrollToEvent.bind(this);

    this.state = {
      jiggledEvents: jiggleEvents(props.events)
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState(state => ({
      jiggledEvents: jiggleEvents(nextProps.events)
    }));
  }

  scrollToEvent(id) {
    scrollIntoView(document.getElementById(`event-${id}`), { align: { top: 0.05 } });
  }

  render({ style, showLabels, attachment, currentEvent }) {
    const { jiggledEvents } = this.state;

    return (
      <div style={style} className={`${styles.wrapper} ${styles[attachment]}`}>
        {!this.props.showLabels && (
          <div className={styles.trackLabel}>{FuzzyDates.formatDate(jiggledEvents[0].date, true)}</div>
        )}
        <div className={styles.track}>
          {jiggledEvents.map(event => {
            if (typeof event.distanceToNextEvent === 'number') {
              return <div className={styles.divider} style={{ height: event.distanceToNextEvent + '%' }} />;
            } else {
              return (
                <div
                  className={`${styles.event} ${event === currentEvent ? styles.current : ''}`}
                  title={event.date.original}
                  onClick={e => this.scrollToEvent(event.idx)}>
                  {showLabels && <div className={styles.label}>{FuzzyDates.formatDate(event.date)}</div>}
                </div>
              );
            }
          })}
        </div>
        {!this.props.showLabels && (
          <div className={styles.trackLabel}>
            {FuzzyDates.formatDate(jiggledEvents[jiggledEvents.length - 1].date, true)}
          </div>
        )}
      </div>
    );
  }
}

module.exports = Navigation;
