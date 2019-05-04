import axios from 'axios';
import { Storage } from 'aws-amplify'

export function copyToBucket(bucketVars) {
  var x = '';
  const url = process.env.REACT_APP_COPY_BUCKET_URL;
  console.log("Copying your file...");

  const headers = {
    'Accept': 'application/json', 
    'Content-Type': 'application/x-www-form-urlencoded' 
  };

  const post = axios.post( url, bucketVars, { headers } )
    .then(res => {
      console.log(res.data);
      x = 'Success';
      return x;
    })
    .catch(err => {
      console.log('error: ', err)
    });
  return post;
}

export function unPublish(bucketVars) {
  var x = '';
  const url = process.env.REACT_APP_COPY_BUCKET_URL;
  console.log("Unpublishing your file...");

  const headers = {
    'Accept': 'application/json', 
    'Content-Type': 'application/x-www-form-urlencoded' 
  };

  const post = axios.post( url, bucketVars, { headers } )
    .then(res => {
      console.log(res);
      x = 'Success';
      return x;
    })
    .catch(err => {
      console.log('error: ', err)
    });
  return post;
}

export function addToStorage(contentType, section, title, fileObj, ext) {
  console.log("Uploading your file to S3 Storage...")
  let ax = Storage.put(
    `${section}/${title}.${ext}`, fileObj, {
      contentType: contentType, 
      progressCallback(progress) {
        console.log(`Uploading: ${progress.loaded}/${progress.total}`);
      },
  })
  .then (result => {
      console.log('Succesfully Uploaded to S3 Storage: ', result.key);
      return 'Success';
  })
  .catch(err => {
      console.log('Error: ', err)
  });
  return ax;
}

export function removeFromStorage(objectPath) {
  console.log("Removeing the file from S3 Storage...")
  let rx = Storage.remove(objectPath, {
    progressCallback(progress) {
      console.log(`Uploading: ${progress.loaded}/${progress.total}`);
    },
  })
  .then(result => {
    console.log('Succesfully removed the object from S3 Storage: ', result);
    return 'Success';
  })
  .catch(err => {
    console.log('Error: ', err)
  });
  return rx;
}

