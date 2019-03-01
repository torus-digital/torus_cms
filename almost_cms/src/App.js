import React, { Component } from 'react';
import logo from './logo.png';
import './App.css';
import 'semantic-ui-css/semantic.min.css'

//rich text editor
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
//import htmlToDraft from 'html-to-draftjs';
import '../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

//article mutations
import { graphqlOperation }  from "aws-amplify";
import { Connect } from "aws-amplify-react";
import * as mutations from './GraphQL/MutationCreateArticle';

//AppSync and Apollo libraries
import AWSAppSyncClient from "aws-appsync";
import { Rehydrated } from 'aws-appsync-react';
import { ApolloProvider } from 'react-apollo';

//Amplify
import Amplify, { Auth } from 'aws-amplify';
import { withAuthenticator } from 'aws-amplify-react';
import { Storage } from 'aws-amplify'

// Components
import AllPhotos from "./Components/AllPhotos";
import AddPhoto from "./Components/AddPhoto";

import awsconfig from './aws-exports';

// Amplify init
Amplify.configure(awsconfig);

const GRAPHQL_API_REGION = awsconfig.aws_appsync_region
const GRAPHQL_API_ENDPOINT_URL = awsconfig.aws_appsync_graphqlEndpoint
const S3_BUCKET_REGION = awsconfig.aws_user_files_s3_bucket_region
const S3_BUCKET_NAME = awsconfig.aws_user_files_s3_bucket
const AUTH_TYPE = awsconfig.aws_appsync_authenticationType

// AppSync client instantiation
const client = new AWSAppSyncClient({
  url: GRAPHQL_API_ENDPOINT_URL,
  region: GRAPHQL_API_REGION,
  auth: {
    type: AUTH_TYPE,
    // Get the currently logged in users credential.
    jwtToken: async () => (await Auth.currentSession()).getAccessToken().getJwtToken(),
  },
  // Amplify uses Amazon IAM to authorize calls to Amazon S3. This provides the relevant IAM credentials.
  complexObjectsCredentials: () => Auth.currentCredentials()
});

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

  addToStorage = () => {
    const { editorState } = this.state;
    const heading = '<!DOCTYPE html> <html lang="en"> <head> <meta charset="utf-8"> <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"> <meta name="description" content=""> <meta name="author" content=""> <title>Creative - Start Bootstrap Theme</title> <!-- Font Awesome Icons --> <link href="../vendor/fontawesome-free/css/all.min.css" rel="stylesheet" type="text/css"> <!-- Google Fonts --> <link href="https://fonts.googleapis.com/css?family=Merriweather+Sans:400,700" rel="stylesheet"> <link href="https://fonts.googleapis.com/css?family=Merriweather:400,300,300italic,400italic,700,700italic" rel="stylesheet" type="text/css"> <!-- Plugin CSS --> <link href="../vendor/magnific-popup/magnific-popup.css" rel="stylesheet"> <link href="../vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet"> <!-- Theme CSS - Includes Bootstrap --> <link href="../css/index.css" rel="stylesheet"> </head> <body id="page-top">';
    const nav = '<nav class="navbar navbar-expand-lg fixed-top py-3" id="mainNav"> <div class="container"> <a class="navbar-brand js-scroll-trigger" href="../index.html">Almost CMS</a> <button class="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation"> <span class="navbar-toggler-icon"></span> </button> <div class="collapse navbar-collapse" id="navbarResponsive"> <ul class="navbar-nav ml-auto my-2 my-lg-0"> <li class="nav-item"> <a class="nav-link js-scroll-trigger" href="../about.html">About</a> </li> <li class="nav-item"> <a class="nav-link js-scroll-trigger" href="index.html">Articles</a> </li> <li class="nav-item"> <a class="nav-link js-scroll-trigger" href="../images/gallery/index.html">Gallery</a> </li> <li class="nav-item"> <a class="nav-link js-scroll-trigger" href="../contact.html">Contact</a> </li> </ul> </div> </div> </nav>';
    const header = '<section class="page-heading bg-primary" id="about"> <div class="container"> <div class="row justify-content-center"> <div class="col-lg-8 text-center"> <h4 class="text-white mt-0">The latest on Almost CMS</h4> </div> </div> </div> </section>';
    const footer = '<footer class="bg-light py-5"> <div class="container-fluid"> <div class="row small text-center text-muted"> <div class="col-md-6"> <div>Copyright &copy; 2019 - Almost CMS</div> </div> <div class="col-md-6"> <div> Powered By <a href="http://***REMOVED***">Almost CMS</a></div> </div> </div> </div> </footer>';
    var body = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    var page = heading + nav + header + body + footer;
    Storage.put('articles/article_title.html', page, {contentType: 'text/html'})
    .then (result => {
      console.log('result: ', result)
    })
    .catch(err => console.log('error: ', err));
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
            Add to DB
          </button>
        </div>
        <div>
          <button onClick={this.addToStorage}>Create Article</button>
        </div>
     
      </div>
    );
  }
}

class App extends Component {

  render() {
    return (
      <div className="App">
        <div>
          <Connect mutation={graphqlOperation(mutations.createArticle)}>
            {({mutation}) => (
              <AddArticle onCreate={mutation} />
            )}
          </Connect>
        </div>
        
        <div>
          <div>
            <h1>Post a Picture</h1>
          </div>
          <div className="App-content">
            <AddPhoto options={{ bucket: S3_BUCKET_NAME, region: S3_BUCKET_REGION }} />
            <AllPhotos />
          </div>
        </div>       
      </div>
    );
  }
}

const AppWithAuth = withAuthenticator(App, true);

export default () => (
  <ApolloProvider client={client}>
    <Rehydrated>
      <AppWithAuth />
    </Rehydrated>
  </ApolloProvider>
);
