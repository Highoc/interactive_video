const drawerWidth = '100%';
const styles = ({
  transitions,
}) => ({
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
    marginRight: '10%',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
});

export default styles;
