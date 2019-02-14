// eslint-disable
// this is an auto generated file. This will be overwritten

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
export const updateArticle = `mutation UpdateArticle($input: UpdateArticleInput!) {
  updateArticle(input: $input) {
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
export const deleteArticle = `mutation DeleteArticle($input: DeleteArticleInput!) {
  deleteArticle(input: $input) {
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
export const createImage = `mutation CreateImage($input: CreateImageInput!) {
  createImage(input: $input) {
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
export const updateImage = `mutation UpdateImage($input: UpdateImageInput!) {
  updateImage(input: $input) {
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
export const deleteImage = `mutation DeleteImage($input: DeleteImageInput!) {
  deleteImage(input: $input) {
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
