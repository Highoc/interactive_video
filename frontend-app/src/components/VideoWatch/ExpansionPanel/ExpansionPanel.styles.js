const styles = theme => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(22),
    flexBasis: '33.33%',
  },
  details: {
    alignItems: 'center',
  },
  column: {
    flexBasis: '33.33%',
  },
  row: {
    flexBasis: '33.33%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    justifyItems: 'center',
    flex: 'auto',
  },
  ratingViews: {
    marginTop: '10px',
    fontSize: theme.typography.pxToRem(22),
  },
  columnButton: {
    marginLeft: '30%',
    marginRight: '30%',
  },
  columnContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  description: {
    marginTop: '20px',
  },
  line: {
    display: 'flex',
    flexDirection: 'row',
  },
  statistics: {
    lineHeight: '24px',
    marginLeft: '20px',
  },
  buttons: {
    marginLeft: '20px',
  },
  columnSpace: {
    marginTop: '35px',
    marginLeft: '45px',
  },
});

export default styles;