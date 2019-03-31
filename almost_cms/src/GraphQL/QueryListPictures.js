import gql from 'graphql-tag';

export default gql`
query {
  listPictures(limit: 100) {
    items {
      title
      description
      file
    }
  }
}`;
