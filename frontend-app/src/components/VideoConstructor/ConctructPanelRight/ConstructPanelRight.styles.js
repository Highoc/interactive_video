const drawerWidth = '100%';
const styles = ({
  spacing, transitions,
}) => ({
  divider: {
    marginTop: spacing.unit * 2,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: transitions.create('width', {
      easing: transitions.easing.sharp,
      duration: transitions.duration.enteringScreen,
    }),
  },
  root: {
    marginLeft: '5%',
    marginRight: '1px',
  },

  buttonContainer: {
    display: 'flex',
    marginTop: '70px',
    justifyContent: 'center',
  },
  rightIcon: {
    marginLeft: spacing.unit,
  },
});

export default styles;
