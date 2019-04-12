const styles = ({ palette, typography }) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: '0 1.5% 0 1.5%',
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
    minHeight: '600px',
    minWidth: '760px',
  },

  name: {
    height: '160px',
    minHeight: '180px',
    padding: '35px 0 10px 0',
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

  channelName: {
    lineHeight: '40px',
    marginLeft: '20px',
  },

  statistics: {
    lineHeight: '24px',
    marginLeft: '20px',
  },
});

export default styles;
