const CreatePicture = `mutation($title: String!, $description: String!, $file: String!) {
  createPicture(input:{
    title: $title
    description: $description
    file: $file
  }) {
    id
    title
  }
}`
export default CreatePicture



