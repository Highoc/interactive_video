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
    marginLeft: '10%',
    marginRight: '1px',
  },
});

export default styles;
