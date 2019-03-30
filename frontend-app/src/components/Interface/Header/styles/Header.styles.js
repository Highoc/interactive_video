const styles = ({
  spacing, breakpoints,
}) => ({
  root: {
    display: 'flex',
  },

  menuButton: {
    marginLeft: 12,
    marginRight: 36,
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
    flexGrow: 1,
  },
});

export default styles;
