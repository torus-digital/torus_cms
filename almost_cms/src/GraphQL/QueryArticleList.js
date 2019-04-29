const articleList =
`query {
  listArticles(limit: 1000) {
    items {
      id
      title
      body_html 
      body_txt  
      }
    }
}`;
export default articleList;