const styles = ({ palette }) => ({
  root: {
    margin: '10px 0 10px 0',
  },

  body: {
    border: '1px solid',
    borderColor: palette.grey.A200,
    borderRadius: '5px',
    '&:hover': {
      borderColor: palette.grey.A700,
    },
    '&[error="true"]': {
      borderColor: 'red',
    },
  },

  legend: {
    padding: '0 5px 0 5px',
    fontSize: '12px',
    color: palette.grey.A200,
    '&[error="true"]': {
      color: 'red',
    },
  },

  uploadArea: {
    display: 'block',
    overflow: 'hidden',
    fontSize: '1em',
    height: '35px',
    lineHeight: '35px',
    width: '600px',
    cursor: 'pointer',
  },

  button: {
    height: '100%',
    float: 'right',
  },

  placeholder: {},

  input: {
    position: 'absolute',
    top: '0',
    opacity: '0',
  },

  error: {
    margin: '5px 0 0 15px',
    fontSize: '12px',
    color: palette.grey.A200,
    '&[error="true"]': {
      color: 'red',
    },
  },
});

export default styles;
