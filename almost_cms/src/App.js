import React, { Component } from 'react';
import './App.css';
import './Components/AddArticle.js';
import 'semantic-ui-css/semantic.min.css'

//rich text editor
import '../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

//article mutations
import { graphqlOperation }  from "aws-amplify";
import { Connect } from "aws-amplify-react";
import * as article_mut from './GraphQL/MutationCreateArticle';
import * as picture_mut from './GraphQL/MutationCreatePicture';

//Amplify
import Amplify from 'aws-amplify';
import { withAuthenticator } from 'aws-amplify-react';

// Components
import AddPicture from "./Components/AddPicture";
import AddArticle from "./Components/AddArticle"

import awsconfig from './aws-exports';

// Amplify init
Amplify.configure(awsconfig);

class App extends Component {

  render() {
    return (
      <div className="App">
        <div>
          <Connect mutation={graphqlOperation(article_mut.createArticle)}>
            {({mutation}) => (
              <AddArticle onCreate={mutation} />
            )}
          </Connect>
        </div>
        <div>
          <Connect mutation={graphqlOperation(picture_mut.createPicture)}>
            {({mutation}) => (
              <AddPicture onCreate={mutation} />
            )}
          </Connect>
        </div>       
      </div>
    );
  }
}

const AppWithAuth = withAuthenticator(App, true);

export default () => (
  <AppWithAuth />
);
