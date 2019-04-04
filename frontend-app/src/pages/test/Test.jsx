import React, { Component } from 'react';

import { ClientForm, ServerForm } from '../../components/Forms';

const inputs = [{
  type: 'textarea',
  name: 'text',
  value: '',
  description: 'Текст комментария',
  rules: {
    max_length: 512,
    required: true,
  },
}];

class Test extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <ServerForm
          name="test-server-form"
          inputs={inputs}
          action="/test/"
          enctype="application/json"
        />
        <hr />
        <ClientForm />
      </div>
    );
  }
}

export default Test;
