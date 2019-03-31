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
    justifyContent: 'center',
    justifyItems: 'center',
    flex: 'auto',
  },
  ratingViews: {
    fontSize: theme.typography.pxToRem(22),
  },
  columnButton: {
    marginLeft: '30%',
    marginRight: '30%',
  },
  columnContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
});

export default styles;