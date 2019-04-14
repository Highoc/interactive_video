const drawerWidth = '100%';
const styles = ({
  spacing, transitions,
}) => ({
  divider: {
    marginTop: spacing.unit * 2,
  },
  title: {
    marginLeft: '20px',
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: transitions.create('width', {
      easing: transitions.easing.sharp,
      duration: transitions.duration.enteringScreen,
    }),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
  },
  root: {
    marginRight: '10%',
  },
  buttonContainer: {
    display: 'flex',
    marginTop: '70px',
    justifyContent: 'center',
  },
  card: {
    width: '100%',
  },
  media: {
    height: 120,
  },
  content: {
    height: '80%',
    width: '90%',
  },
});

export default styles;
