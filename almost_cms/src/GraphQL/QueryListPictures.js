import gql from 'graphql-tag';

export default gql`
query {
  listPictures(limit: 200) {
    items {
      title
      description
      file
    }
  }
}`;
