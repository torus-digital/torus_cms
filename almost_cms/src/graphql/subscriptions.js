// eslint-disable
// this is an auto generated file. This will be overwritten

export const onCreateArticle = `subscription OnCreateArticle {
  onCreateArticle {
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
export const onUpdateArticle = `subscription OnUpdateArticle {
  onUpdateArticle {
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
export const onDeleteArticle = `subscription OnDeleteArticle {
  onDeleteArticle {
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
export const onCreateImage = `subscription OnCreateImage {
  onCreateImage {
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
export const onUpdateImage = `subscription OnUpdateImage {
  onUpdateImage {
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
export const onDeleteImage = `subscription OnDeleteImage {
  onDeleteImage {
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
