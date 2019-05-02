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
		};
		(async function(input, file, ext){
			let x = await createPicture(input, file, ext).then(response => {
				return response;
			});
			return x;
		})(input, file, ext).then( response => {
			console.log(response)
			switch(response) {
				case 'Success':
					this.setState({
						ext: ext,
					});
					break;
				default:
					console.log('Error. Something went wrong...');
			}
		});
		event.preventDefault()    
	}
	//handler for publish event
	async handleAlternate(event) { 
		const section = 'gallery';
		var ext = this.state.ext;
		var file = `${this.state.title}.${ext}`;
		const bucketVars = {
			sourceRoute: `public/${section}`,
			sourceObject: file,
			destRoute: section
		};
		await publishPicture(bucketVars).then( response => {
			console.log(response);
			window.location.reload();
		})
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
						<input type="submit" value="Save" />
						<button disabled={!this.state.ext} onClick={this.handleAlternate.bind(this)}>Publish</button>
					</form>
				</div>
			</div>
		)
	}
}  
export default AddPicture;