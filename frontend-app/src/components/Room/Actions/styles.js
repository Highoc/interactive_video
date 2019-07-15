const styles = theme => ({
  root: {
    width: '40%',
    height: '100%',
  },
  actions: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'center',
    marginLeft: '10px',
  },
  button: {
    margin: theme.spacing,
  },
  line: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '5px',
  },
  title: {
    margin: 'auto',
  },
});

export default styles;
