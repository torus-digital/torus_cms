const DeletePicture = `mutation($id: ID!) {
    deletePicture(input:{
        id: $id
    }) {
        id
        title
    }
  }`
export default DeletePicture