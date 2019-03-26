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

//AppSync and Apollo libraries
import AWSAppSyncClient from "aws-appsync";
import { Rehydrated } from 'aws-appsync-react';
import { ApolloProvider } from 'react-apollo';

//Amplify
import Amplify, { Auth } from 'aws-amplify';
import { withAuthenticator } from 'aws-amplify-react';

// Components
import AddPicture from "./Components/AddPicture";
import AddArticle from "./Components/AddArticle"

import awsconfig from './aws-exports';

// Amplify init
Amplify.configure(awsconfig);

const GRAPHQL_API_REGION = awsconfig.aws_appsync_region
const GRAPHQL_API_ENDPOINT_URL = awsconfig.aws_appsync_graphqlEndpoint
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
  <ApolloProvider client={client}>
    <Rehydrated>
      <AppWithAuth />
    </Rehydrated>
  </ApolloProvider>
);
