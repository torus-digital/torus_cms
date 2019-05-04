const pictureList =
`query {
  listPictures(limit: 500) {
    items {
      id
      title
      description
      file  
      }
    }
}`;
export default pictureList;