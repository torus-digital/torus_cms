import gql from 'graphql-tag';

export default gql`
query {
  listArticles(limit: 100) {
    items {
      title
      body_txt   
      }
    }
}`;