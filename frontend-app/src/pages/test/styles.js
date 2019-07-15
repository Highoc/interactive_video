const styles = theme => ({
  main_container: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    flex: 'auto',
  },
  video: {
    position: 'relative',
    left: '0px',
    top: '0px',
    zIndex: '9997',
  },
  main_components: {
    width: '100%',
    height: '650px',
    display: 'flex',
  },
  secondary_components: {
    width: '100%',
    height: '200px',
    display: 'flex',
  },
  title: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  settings: {
    margin: '5px',
  },
  exit: {
    margin: '5px',
    float: 'right',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
  },
});

export default styles;
