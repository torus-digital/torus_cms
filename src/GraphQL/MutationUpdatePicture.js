const UpdatePicture = `mutation($id: ID!, $title: String!, $description: String, $file: String!) {
    updatePicture(input:{
        id: $id
        title: $title
        description: $description
        file: $file
    }) {
        id
        title
    }
  }`
  export default UpdatePicture