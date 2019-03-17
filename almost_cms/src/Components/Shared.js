import axios from 'axios';
import { Storage } from 'aws-amplify'


export function CopyToBucket(bucketVars) {
    var x = '';
    const url = `https://dquw9oidca.execute-api.us-east-1.amazonaws.com/postCopyFunctionInitial/`;

    const headers = {
      'Accept': 'application/json', 
      'Content-Type': 'application/x-www-form-urlencoded' 
    };

    axios.post( url, bucketVars, { headers } )
      .then(res => {
        console.log(res);
        console.log(res.data);
        x = res.data;
      })
    return x;
}

export function addToStorage(contentType, section, title, fileObj) {
    let ax = Storage.put(`${section}/${title}.html`, fileObj, {contentType: contentType})
    .then (result => {
        console.log('result: ', result);
        console.log(result);
        return result;
    })
    .catch(err => console.log('error: ', err));
    return ax;
}