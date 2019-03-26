import React, { Component } from 'react';

//import { addToStorage, copyToBucket } from './Shared.js';
import { Storage } from 'aws-amplify'

class AddPicture extends Component {
    onChange(e) {
      const file = e.target.files[0];
      Storage.put(this.state.name, file, {
          contentType: 'image/'
      })
      .then (result => console.log(result))
      .catch(err => console.log(err));
    }
  
    constructor(props) {
      super(props);
      this.state = {
          name: '',
          file: null,
      };
    }
  
    handleChange(name, ev) {
        this.setState({ [name]: ev.target.value });
    }
  
    async submit() {
      const { onCreate } = this.props;
      var input = {
        name: this.state.name,
        file: this.state.file,
      }
      console.log(input);
      await onCreate({input})
    }
  
    render(){
      return (
          <div>
            <div className="container section">
            <h1>Post an Image</h1>
            <input
              name="name"
              placeholder="name"
              type="text"
              onChange={(ev) => { this.handleChange('name', ev)}}
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