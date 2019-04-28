import gql from 'graphql-tag';

export default gql`
query {
  listArticles(limit: 1000) {
    items {
      id
      title   
      }
    }
}`;