// eslint-disable
// this is an auto generated file. This will be overwritten

export const getArticle = `query GetArticle($id: ID!) {
  getArticle(id: $id) {
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
export const listArticles = `query ListArticles(
  $filter: ModelArticleFilterInput
  $limit: Int
  $nextToken: String
) {
  listArticles(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      title
      body
      file {
        bucket
        region
        key
      }
    }
    nextToken
  }
}
`;
export const getImage = `query GetImage($id: ID!) {
  getImage(id: $id) {
    id
    name
    file {
      bucket
      region
      key
    }
  }
}
`;
export const listImages = `query ListImages(
  $filter: ModelImageFilterInput
  $limit: Int
  $nextToken: String
) {
  listImages(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      name
      file {
        bucket
        region
        key
      }
    }
    nextToken
  }
}
`;
