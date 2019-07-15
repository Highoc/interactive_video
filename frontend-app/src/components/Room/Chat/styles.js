const styles = ({ palette, typography }) => ({
  root: {
    height: '100%',
    width: '35%',
    margin: '0 5px 0 5px',
    backgroundColor: "rgb(67,69,69)",
    display: 'flex',
    flexDirection: 'column',
  },

  textField: {
    width: '100%',
    backgroundColor: "rgb(17,18,18)",
  },

  chatField: {
    width: '100%',
    height: '80%',
    overflow: 'scroll',
    backgroundImage: "url(https://userscontent2.emaze.com/images/50e5c135-dc7e-44ee-b422-c3ec63b4cb44/7917cc5280b6b28c35ebb0732d6b18a7.jpg)",
  },

  button: {
    display: 'flex',
    justifyContent: 'center',
  },
  inline: {
    display: 'inline',
  },
});

export default styles;
