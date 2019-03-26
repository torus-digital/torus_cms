export const createArticle = `mutation CreateArticle($input: CreateArticleInput!) {
    createArticle(input: $input) {
      id
      title
      body_html
      body_txt
    }
  }
  `;