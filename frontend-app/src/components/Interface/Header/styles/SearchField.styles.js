import { fade } from '@material-ui/core/styles/colorManipulator';

const styles = ({
  palette, spacing, breakpoints, shape, transitions,
}) => ({
  search: {
    position: 'relative',
    borderRadius: shape.borderRadius,
    backgroundColor: fade(palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(palette.common.white, 0.25),
    },
    marginRight: spacing.unit * 2,
    marginLeft: 0,
    width: '100%',
    [breakpoints.up('sm')]: {
      marginLeft: spacing.unit * 3,
      width: 'auto',
    },
  },

  searchIcon: {
    width: spacing.unit * 9,
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  inputRoot: {
    color: 'inherit',
    width: '100%',
  },

  inputInput: {
    paddingTop: spacing.unit,
    paddingRight: spacing.unit,
    paddingBottom: spacing.unit,
    paddingLeft: spacing.unit * 10,
    transition: transitions.create('width'),
    width: '100%',
    [breakpoints.up('md')]: {
      width: 700,
    },
  },
});

export default styles;
