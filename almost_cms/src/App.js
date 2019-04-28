import React, { Component } from 'react';
import './App.css';
import 'semantic-ui-css/semantic.min.css'

//rich text editor
import '../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

//Amplify
import Amplify from 'aws-amplify';
import { withAuthenticator } from 'aws-amplify-react';

// Components
import AddPicture from "./Components/AddPicture2";
import AddArticle from "./Components/AddArticle2"

import awsconfig from './aws-exports';

// Amplify init
Amplify.configure(awsconfig);

class App extends Component {

  render() {
    return (
      <div className="App">
        <div>
          <AddArticle></AddArticle>
        </div>
        <div>
          <AddPicture></AddPicture>
        </div>       
      </div>
    );
  }
}

const AppWithAuth = withAuthenticator(App, true);

export default () => (
  <AppWithAuth />
);
