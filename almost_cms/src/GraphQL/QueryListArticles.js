import gql from 'graphql-tag';

export default gql`
query {
  listArticles {
    items {
      title
      body   
        }
    }
}`;