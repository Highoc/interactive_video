const styles = ({ palette, typography }) => ({
  root: {
    height: '200px',
    width: '270px',
    margin: '0 5px 0 5px',
    transition: '0.3s transform',
    position: 'relative',
    cursor: 'pointer',
    transformOrigin: '0% 50%',
    '&:hover': {
      transform: 'scale(1.7)',
    },
    '&:hover ~ &': {
      transform: 'translate3d(200px, 0, 0)',
    },
  },

  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    background: 'rgba(0, 0, 0, 0.5)',
    opacity: 0,
    transition: 'opacity 0.5s',
    '&:hover': {
      opacity: 1,
    },
  },

  img: {
    transition: 'transform 0.6s ease-out',
    height: '200px',
    width: '270px',
  },

  button: {
    display: 'flex',
    justifyContent: 'center',
  },

  name: {
    height: '25px',
    fontSize: typography.fontSize.medium,
    margin: '10px 5px 10px 5px',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },

  statistics: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    '& > div': {
      display: 'flex',
      flexDirection: 'row',
      margin: '0 5px 5px 5px',
      height: '25px',
    },
  },

  text: {
    paddingLeft: '5px',
    lineHeight: '25px',
    fontSize: typography.fontSize.medium,
  },
});

export default styles;
