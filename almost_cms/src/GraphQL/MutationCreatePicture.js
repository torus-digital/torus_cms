import gql from 'graphql-tag';

export default gql`
mutation ($input: CreatePictureInput!) {
  createPicture(input: $input) {
    id
    name
    visibility
    owner
    createdAt
  }
}`;


export const createPicture = `mutation CreatePicture($input: CreatePictureInput!) {
  createPicture(input: $input) {
    id
    title
    description
    file {
      bucket
      region
      key
    }
  }
}
`;
