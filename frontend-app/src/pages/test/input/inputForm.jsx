import React, { Component } from 'react';

//controlled components
export class InputForm extends Component {
	constructor(props) {
		super(props);
		this.state = { value: '' };
        this.state = { placeholder: props.placeholder};
		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(event) {

		this.setState({ value: event.target.value });

	}

	render() {
		return (
		    <input name={this.props.name} type="text" placeholder={ this.state.placeholder } value={this.state.value} onChange={ this.handleChange } />
		);
	}
}
export default InputForm;
