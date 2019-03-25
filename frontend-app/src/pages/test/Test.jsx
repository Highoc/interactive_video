import React, { Component } from 'react';
import clone from 'clone';
import Tree from 'react-d3-tree';

export class Test extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tree: {
        name: '1',
        children: [
          {
            name: '2',
          },
          {
            name: '3',
          },
        ],
      },
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log('Я обновилась!');
  }

  handleAddChildren() {
    const { tree } = this.state;
    tree.children[0].children = [
      {
        name: '2',
      },
      {
        name: '3',
      },
    ];
    this.setState({ tree: clone(tree) });
  }

  render() {
    return (
      <div>
        <Tree
          data={this.state.tree}
          translate={{ x: 20, y: 225 }}

        />
        <button onClick={() => this.handleAddChildren()}>TIK</button>
      </div>
    );
  }
}
