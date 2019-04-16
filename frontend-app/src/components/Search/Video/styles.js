const styles = theme => ({
  card: {
    display: 'flex',
    margin: '20px',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: '30px',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '200px',
  },
  cover: {
    height: '240px',
    minWidth: '320px',
    maxWidth: '320px',
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
  },
  playIcon: {
    height: 38,
    width: 38,
  },
  channelName: {
    fontSize: 20,
    color: 'rgb(255,255,255)',
    fontFamily: 'Helvetica Neue Cyr Medium',
    display: '-webkit-box',
    webkitBoxOrient: 'vertical',
    webkitLineClamp: '1',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
  },
  channel: {
    height: '50px',
    minHeight: '50px',
    fontSize: theme.typography.fontSize.medium,
  },
  name: {
    fontSize: theme.typography.fontSize.medium,
  },
  description: {
    fontSize: theme.typography.fontSize.medium,
  },
});

export default styles;