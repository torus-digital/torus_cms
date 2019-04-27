const CreateArticle = `mutation($title: String!, $body_html: String!, $body_txt: String!) {
  createArticle(input:{
    title: $title
    body_html: $body_html
    body_txt: $body_txt
  }) {
    id
    title
  }
}`
export default CreateArticle