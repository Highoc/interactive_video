const styles = ({ palette, typography, breakpoints }) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: '0 1.5% 0 1.5%',
    margin: '1.5% 0 1.5% 0',
    backgroundColor: palette.background.paper,

  },

  columnText: {
    width: '35%',
    height: '600px',
    minHeight: '600px',
    minWidth: '400px',
    padding: '0 4% 0 4%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },

  columnImg: {
    position: 'relative',
    cursor: 'pointer',
    minHeight: '600px',
    minWidth: '760px',
  },

  img: {
    height: '600px',
    maxWidth: '760px',
  },

  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    display: 'flex',
    justifyContent: 'center',
    background: 'rgba(0, 0, 0, 0.5)',
    opacity: 0,
    transition: 'opacity 0.5s',
    '&:hover': {
      opacity: 1,
    },
  },
  name: {
    height: '160px',
    minHeight: '180px',
    padding: '20px 0 10px 0',
    fontSize: typography.fontSize.large,
  },

  channel: {
    height: '50px',
    minHeight: '50px',
    fontSize: typography.fontSize.medium,
  },

  created: {
    height: '25px',
    minHeight: '25px',
    padding: '5px',
    fontSize: typography.fontSize.medium,
  },

  rating: {
    height: '25px',
    minHeight: '25px',
    padding: '5px',
    fontSize: typography.fontSize.medium,
  },

  description: {
    height: '285px',
    minHeight: '295px',
    padding: '10px 0 35px 0',
    fontSize: typography.fontSize.medium,
  },

  row: {
    display: 'flex',
    flexDirection: 'row',
  },

  statistics: {
    lineHeight: '24px',
    marginLeft: '20px',
  },
  button: {
    display: 'flex',
    alignItems: 'center',
  },

  channelName: {
    fontSize: 20,
    color: 'rgb(255,255,255)',
    margin: '12px 5px 10px 15px',
    fontFamily: 'Helvetica Neue Cyr Medium',
    display: '-webkit-box',
    webkitBoxOrient: 'vertical',
    webkitLineClamp: '1',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  link: {
    textDecoration: 'none',
    margin: '0px 5px 10px 5px',
    overflow: 'hidden',
  },
});


export default styles;
