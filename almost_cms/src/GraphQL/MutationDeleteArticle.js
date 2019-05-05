const DeleteArticle = `mutation($id: ID!) {
    deleteArticle(input:{
        id: $id
    }) {
        id
        title
    }
  }`
export default DeleteArticle