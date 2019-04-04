import React, { Component } from 'react';

import 'semantic-ui-css/semantic.min.css';

import { copyToBucket, addToStorage } from './Shared.js';

import createGallery from './CreatePictureGallery'

class AddPicture extends Component {
    onChange(e) {
      const file = e.target.files[0];
      this.setState({ file: file });
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
      const { onCreate } = this.props;
      const contentType = 'image/'
      const section = 'gallery';
      const title = this.state.title;
      const file = this.state.file
      const file_str = file.name;
      const ext = file_str.split('.')[1];
      var input = {
        title: this.state.title,
        description: this.state.description,
        file: `${this.state.title}.${ext}`,
      }
      let firstFunct = await onCreate({input})
      console.log("first fucntion: ", firstFunct);
      let addPicture = await new addToStorage(contentType, section, title, file, ext);
      switch(addPicture) {
        // if the create index function is succesful
        case 'Success':
          const bucketVars = {
            sourceRoute: `public/${section}`,
            sourceObject: `${this.state.title}.${ext}`,
            destRoute: `${section}`
          };
          let copyPicture = await new copyToBucket(bucketVars);
          switch(copyPicture) {
            // If the copy article function is succesful
            case 'Success':
              console.log(`Succesfully copied ${bucketVars.sourceObject} to ${bucketVars.destRoute}`);
              // execute the create index function
              let addGallery = await new createGallery();
              switch(addGallery) {
                // if the create index function is succesful
                case 'Success':
                  // execute the copy index function
                  const bucketVars = {
                    sourceRoute: 'public/gallery',
                    sourceObject: 'index.html',
                    destRoute: 'gallery'
                  };
                  let copyGallery = await new copyToBucket(bucketVars);
                  switch(copyGallery) {
                    case 'Success':
                      console.log( "Congratulations! you have succesfully published your new picture!" );
                      break;
                    default:
                      console.log("Error: Failed to copy your gallery")
                  }
                  break;
                default:
                  console.log("Error: Failed to save the new picture gallery");
              }
              break;
            default:
              console.log(copyPicture)
              console.log("Error: Failed to copy your picture to your public bucket.");
          }
          break;
        default:
          console.log("Error: Failed to add your picture to storage."); 
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