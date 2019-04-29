const getArticle = `query($id: id!) {
    getArticle(input:{
      id: $id
    }) {
      id
      title
    }
  }`
export default getArticle


  