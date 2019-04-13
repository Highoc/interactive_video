const styles = ({ palette, spacing }) => ({
  root: {
    borderBottom: `1px solid ${palette.divider}`,
    margin: 0,
    padding: spacing.unit * 2,
  },

  closeButton: {
    position: 'absolute',
    right: spacing.unit,
    top: spacing.unit,
    color: palette.grey[500],
  },

  content: {
    margin: 0,
    padding: spacing.unit * 2,
  },
});

export default styles;
