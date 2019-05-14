const styles = ({ palette, typography }) => ({
  root: {
    height: '352px',
    position: 'relative',
    margin: '1.5% 0 1.5% 0',
    overflow: 'hidden',
    backgroundColor: palette.background.paper,
  },

  content: {
    display: 'flex',
    flexDirection: 'row',
    margin: '70px 0 70px 0',
    transition: '0.3s transform',
    '&:hover': {
      transform: 'translate3d(-135px, 0, 0)',
    },
  },

  label: {
    position: 'absolute',
    margin: '10px',
    fontSize: typography.fontSize.large,
  },
});

export default styles;
