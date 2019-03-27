import React, { Component } from 'react';
//import { addToStorage, copyToBucket } from './Shared.js';
import { Storage } from 'aws-amplify'

class AddPicture extends Component {
    onChange(e) {
      const file = e.target.files[0];
      Storage.put(`gallery/${this.state.title}`, file, {
          contentType: 'image/'
      })
      .then (result => console.log(result))
      .catch(err => console.log(err));
      this.setState({ file: `gallery/${this.state.title}` });
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