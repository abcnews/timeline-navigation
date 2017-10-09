const { h, Component } = require('preact');
const scrollIntoView = require('scroll-into-view');

const styles = require('./Navigation.scss');

class Navigation extends Component {
  constructor(props) {
    super(props);

    this.scrollToEvent = this.scrollToEvent.bind(this);
  }

  scrollToEvent(id) {
    scrollIntoView(document.getElementById(`event-${id}`), { align: { top: 0.1 } });
  }

  render({ events }) {
    const wrapperStyle = {
      height: window.innerHeight + 'px'
    };

    const firstEvent = events[0].date.getTime();
    const lastEvent = events[events.length - 1].date.getTime();
    const timeDistance = lastEvent - firstEvent;

    let jiggledEvents = [];
    events.forEach((event, index) => {
      jiggledEvents.push(event);

      // Check how far away the next event is
      if (index !== events.length - 1) {
        const distanceToNextEvent = (events[index + 1].date.getTime() - event.date.getTime()) / timeDistance * 100;
        jiggledEvents.push({ distanceToNextEvent });
      }
    });

    return (
      <div className={styles.wrapper} ref={el => (this.wrapper = el)} style={wrapperStyle}>
        {jiggledEvents.map(event => {
          if (event.distanceToNextEvent) {
            return <div className={styles.divider} style={{ height: event.distanceToNextEvent + '%' }} />;
          } else {
            return (
              <div className={styles.event} title={event.date.original} onClick={e => this.scrollToEvent(event.idx)} />
            );
          }
        })}
      </div>
    );
  }
}

module.exports = Navigation;
