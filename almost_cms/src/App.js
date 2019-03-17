import React, { Component } from 'react';
import './App.css';
import './Components/AddArticle.js';
import 'semantic-ui-css/semantic.min.css'

//rich text editor
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

// Components
import AllPhotos from "./Components/AllPhotos";
import AddPhoto from "./Components/AddPhoto";
import AddArticle from "./Components/AddArticle"

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
