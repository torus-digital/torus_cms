export const createArticle = `mutation CreateArticle($input: CreateArticleInput!) {
    createArticle(input: $input) {
      id
      title
      body
      file {
        bucket
        region
        key
      }
    }
  }
  `;