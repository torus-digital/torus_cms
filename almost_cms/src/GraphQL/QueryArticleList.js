const articleList =
`query {
  listArticles(limit: 1000) {
    items {
      id
      title   
      }
    }
}`;
export default articleList;