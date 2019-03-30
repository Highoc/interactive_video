const styles = theme => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(24),
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  details: {
    alignItems: 'center',
  },
  column: {
    flexBasis: '33.33%',
  },
  rightcolumn: {
    flexBasis: '16.5%',
  },
  columnButton: {
    marginLeft: '30%',
    marginRight: '30%',
  },
  buttonContainer: {
    marginLeft: '60%',
  },
});

export default styles;