import React, { Component } from 'react';

//import { addToStorage, copyToBucket } from './Shared.js';
import { Storage } from 'aws-amplify'

class AddPicture extends Component {
    onChange(e) {
      const file = e.target.files[0];
      const file_str = file.name;
      const ext = file_str.substr(file_str.length - 3);
      Storage.put(`${this.state.title}.${ext}`, file, {
          contentType: 'image/'
      })
      .then (result => console.log(result))
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
        console.log("file: ", this.state.file)
      const { onCreate } = this.props;
      var input = {
        title: this.state.title,
        description: this.state.description,
        file: this.state.file,
      }
      console.log("input: ", input );
      let firstFunct = await onCreate({input})
      console.log(firstFunct);
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