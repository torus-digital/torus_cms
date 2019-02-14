import React, { Component } from 'react';
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
//import htmlToDraft from 'html-to-draftjs';
import './App.css';
import '../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { withAuthenticator } from 'aws-amplify-react'
import { Storage } from 'aws-amplify'
import Amplify, { graphqlOperation }  from "aws-amplify";
import { Connect } from "aws-amplify-react";
import * as mutations from './graphql/mutations';

class AddArticle extends Component {
    state = {
    editorState: EditorState.createEmpty(),
  }

  onEditorStateChange: Function = (editorState) => {
    this.setState({
      editorState,
    });
  };

  constructor(props) {
    super(props);
    this.state = {
        title: '',
        body: '',
    };
  }

  handleChange(title, ev) {
      this.setState({ [title]: ev.target.value });
  }

  async submit() {
    const { editorState } = this.state;
    const { onCreate } = this.props;
    var input = {
      title: this.state.title,
      body: draftToHtml(convertToRaw(editorState.getCurrentContent())),
    }
    console.log(input);
    await onCreate({input})
  }

  render(){
    const { editorState } = this.state;
    return (
        <div>
          <div className="container">
          <h1>Post a comment</h1>
          <input
                name="title"
                placeholder="title"
                onChange={(ev) => { this.handleChange('title', ev)}}
          />
          <Editor
            editorState={editorState}
            wrapperClassName="demo-wrapper"
            editorClassName="demo-editor"
            onEditorStateChange={this.onEditorStateChange}
          />
          <button onClick={this.submit.bind(this)}>
            Add
          </button>
        </div>
     
      </div>
    );
  }
}

class App extends Component {


  onChange(e) {
      const file = e.target.files[0];
      Storage.put('example.png', file, {
          contentType: 'image/png'
      })
      .then (result => console.log(result))
      .catch(err => console.log(err));
  }

  render() {
    return (
    <>
      <Connect mutation={graphqlOperation(mutations.createArticle)}>
        {({mutation}) => (
          <AddArticle onCreate={mutation} />
        )}
      </Connect>

      <div className="App">
        
      </div>
      <div className="container section">
        <h1>Post a picture</h1>
        <input
          type="file" accept='image/png'
          onChange={(e) => this.onChange(e)}
        />
      </div>
    </>

    );
  }
}


export default withAuthenticator(App, { includeGreetings: true })