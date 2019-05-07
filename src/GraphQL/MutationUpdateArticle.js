const UpdateArticle = `mutation($id: ID!, $title: String!, $body_html: String!, $body_txt: String!) {
    updateArticle(input:{
        id: $id
        title: $title
        body_html: $body_html
        body_txt: $body_txt
    }) {
        id
        title
    }
  }`
  export default UpdateArticle