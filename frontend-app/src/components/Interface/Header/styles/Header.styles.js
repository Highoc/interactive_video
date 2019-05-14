const styles = ({
  spacing, breakpoints,
}) => ({
  root: {
    display: 'flex',
  },

  menuButton: {
    marginLeft: 12,
  },

  buttonContainer: {
    position: 'relative',
    marginRight: spacing.unit * 2,
    marginLeft: 0,
    [breakpoints.up('sm')]: {
      marginLeft: spacing.unit * 3,
      width: 'auto',
    },
  },

  buttonPlace: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  grow: {
    flexGrow: 0.5,
  },
  register: {
    marginLeft: '20px',
  },
});

export default styles;
