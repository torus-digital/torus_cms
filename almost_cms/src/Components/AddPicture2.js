import React, { Component } from 'react';
import '../App.css';
import 'semantic-ui-css/semantic.min.css';
import createPicture from './CreatePicture';

class AddPicture extends Component {
	constructor(props) {
		super(props)
		this.state = { 
			title: '',
      description: '',
      file: '',
		};
		this.handleChange = this.handleChange.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
	}
	onChange(e) {
		const file = e.target.files[0];
		this.setState({ file: file });
	}
	handleChange(title, event) {
		this.setState({ [title]: event.target.value })
	}
	handleSubmit(event) {
		const file = this.state.file;
		console.log(file);
    const file_str = file.name;
    const ext = file_str.split('.')[1];
		var input = {
			title: this.state.title,
			description: this.state.description,
			file: `${this.state.title}.${ext}`,
		}
		console.log(input)
		createPicture(input, file, ext);
		event.preventDefault()    
	}
	  
	render() {
		return (
			<div>
				<div className="container section">
					<h1>Post an Image</h1>
					<form onSubmit={this.handleSubmit}>
						<input
							name="title"
							placeholder="title"
							required="required"
							type="text"
							value={this.state.title}
							onChange={(event) => { this.handleChange('title', event)}}
						/>
						<input
							name="description"
							placeholder="description"
							type="text"
							value={this.state.description}
							onChange={(event) => { this.handleChange('description', event)}}
						/>
						<input
							name="file" 
							placeholder="file"
							required="required"
							type="file" 
							accept='image/'
							onChange={(e) => this.onChange(e)}
						/>
						<input type="submit" value="Submit" />
					</form>
				</div>
			</div>
		)
	}
}  
export default AddPicture;