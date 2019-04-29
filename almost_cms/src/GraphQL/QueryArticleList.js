const articleList =
`query {
  listArticles(limit: 1000) {
    items {
      id
      title
      body_html   
      }
    }
}`;
export default articleList;