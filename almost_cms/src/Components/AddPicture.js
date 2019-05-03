import React, { Component } from 'react';
import '../App.css';
import 'semantic-ui-css/semantic.min.css';
import createPicture from './CreatePicture';
import publishPicture from './PublishPicture';

class AddPicture extends Component {
	constructor(props) {
		super(props)
		this.state = { 
			title: '',
			description: '',
			file: '',
			ext: '',
			itemProps: '',
		};
		this.handleChange = this.handleChange.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
	}
	onChange(e) {
		const file = e.target.files[0];
		this.setState({ file: file });
	}
	handleChange(event) {
		this.setState({ [event.target.name]: event.target.value })
	}

	handleSubmit(event) {
		const file = this.state.file;
		var state = this.state;
		var props = this.state.itemProps;
    	const file_str = file.name;
   	 	const ext = file_str.split('.')[1];
		var input = {
			title: this.state.title,
			description: this.state.description,
			file: `${this.state.title}.${ext}`,
		};
		(async function(input, file, ext, state, props){
			if (state.title === props.title && state.description === props.description && state.file.name === props.file_origin) {
				alert('Error. No changes detected');
			}
			else {
				let x = await createPicture(input, file, ext).then(response => {
					return 'Success';
				});
				return x;
			}
		})(input, file, ext, state, props).then( response => {
			//console.log(response)
			switch(response) {
				case 'Success':
					this.setState({
						ext: ext,
						itemProps: {
							title: this.state.title,
							description: this.state.description,
							file: `${this.state.title}.${ext}`,
							file_origin: this.state.file.name
						},
					});
					break;
				default:
					//Do Nothing
			}
		});
		event.preventDefault()    
	}
	//handler for publish event
	handleAlternate(event) { 
		const section = 'gallery';
		var ext = this.state.ext;
		var file = `${this.state.title}.${ext}`;
		const bucketVars = {
			sourceRoute: `public/${section}`,
			sourceObject: file,
			destRoute: section,
		};
		if (this.state.title === this.state.itemProps.title && this.state.description === this.state.itemProps.description && this.state.file.name === this.state.itemProps.file_origin) {
			publishPicture(bucketVars);
		}
		else {
			alert('Error. Please Save your changes before publishing');
		}
		event.preventDefault();
	}
	  
	render() {
		return (
			<div>
				<div className="container section">
					<h1>Post an Image</h1>
					<form onSubmit={this.handleSubmit.bind(this)}>
						<input
							name="title"
							placeholder="title"
							required="required"
							type="text"
							value={this.state.title}
							onChange={this.handleChange}
						/>
						<input
							name="description"
							placeholder="description"
							type="text"
							value={this.state.description}
							onChange={this.handleChange}
						/>
						<input
							name="file" 
							placeholder="file"
							required="required"
							type="file" 
							accept='image/'
							onChange={(e) => this.onChange(e)}
						/>
						<input type="submit" value="Save" />
						<button disabled={!this.state.ext} onClick={this.handleAlternate.bind(this)}>Publish</button>
					</form>
				</div>
			</div>
		)
	}
}  
export default AddPicture;