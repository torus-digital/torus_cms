import React from 'react';
import axios from 'axios';

function CopyToBucket(instructions) {
    var x = '';
    const url = `https://jsonplaceholder.typicode.com/users`
    axios.post( url, { instructions })
      .then(res => {
        console.log(res);
        console.log(res.data);
        x = res.data
      })
    return x;
}
