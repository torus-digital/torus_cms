import React, { Component } from 'react';

import 'semantic-ui-css/semantic.min.css';

import { copyToBucket } from './Shared.js';
import { Storage } from 'aws-amplify'

import createGallery from './CreatePictureGallery'

class AddPicture extends Component {
    onChange(e) {
      const file = e.target.files[0];
      const file_str = file.name;
      const ext = file_str.split('.')[1];
      Storage.put(`gallery/${this.state.title}.${ext}`, file, {
          contentType: 'image/'
      })
      .then (result => console.log(`Succesfully added your image ${file_str}.${ext} to your s3 storage bucket.`))
      .catch(err => console.log(err));
      this.setState({ file: file.name });

    }
  
    constructor(props) {
      super(props);
      this.state = {
          title: '',
          description: '',
          file: '',
      };
    }
  
    handleChange(title, ev) {
        this.setState({ [title]: ev.target.value });
    }
  
    async submit() {
      const section = 'gallery';
      const ext = this.state.file.split('.')[1];
      const { onCreate } = this.props;
      var input = {
        title: this.state.title,
        description: this.state.description,
        file: `${this.state.title}.${ext}`,
      }
      let firstFunct = await onCreate({input})
      console.log("first fucntion: ", firstFunct);
      const bucketVars = {
        sourceRoute: `public/${section}`,
        sourceObject: `${this.state.title}.${ext}`,
        destRoute: `${section}`
      };
      console.log("bucketvars: ", bucketVars);
      let copyPicture = await new copyToBucket(bucketVars);
      console.log(copyPicture)
				switch(copyPicture) {
					// If the copy article function is succesful
					case 'Success':
						console.log("Succesfully copied the new picture to your public bucket!");
						// execute the create index function
						let addGallery = await new createGallery();
						switch(addGallery) {
							// if the create index function is succesful
							case 'Success':
								console.log("Successfully created a gallery with your new picture and added it to your S3 storage bucket!");
								// execute the copy index function
								const bucketVars = {
									sourceRoute: 'public/gallery',
									sourceObject: 'gallery.html',
									destRoute: 'gallery'
								};
								let copyGallery = copyToBucket(bucketVars);
								console.log("index copy receipt: ", copyGallery);
								console.log( "Congratulations! Succesfully created your new Article!" );
								break;
							default:
								console.log("Error: Failed to save the new articles index");
						}
						break;
					default:
						console.log(copyPicture)
						console.log("Error: Failed to copy your article to your public bucket.");
				}
    }
  
    render(){
      return (
          <div>
            <div className="container section">
            <h1>Post an Image</h1>
            <input
              name="title"
              placeholder="title"
              type="text"
              onChange={(ev) => { this.handleChange('title', ev)}}
            />
            <input
              name="description"
              placeholder="description"
              type="text"
              onChange={(ev) => { this.handleChange('description', ev)}}
            />
            <input
              name="file" 
              placeholder="file"
              type="file" 
              accept='image/'
              onChange={(e) => this.onChange(e)}
            />
            <button onClick={this.submit.bind(this)}>
              Add
            </button>
          </div>
       
        </div>
      );
    }
  }

  export default AddPicture;