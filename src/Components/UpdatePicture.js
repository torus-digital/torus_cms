import { API, graphqlOperation } from "aws-amplify";
import UpdatePicture from '../GraphQL/MutationUpdatePicture.js';
import { addToStorage } from './Shared.js';
import createGallery from './CreatePictureGallery';

export default async function updatePicture(input, file, ext, item) {
    console.log(item)
    const contentType = 'image/'
    const section = 'gallery';
    const putInput = {
        id: item,
        title: input.title,
        description: input.description,
        file: input.file,
    }
    console.log(putInput);
	var putToDB = await API.graphql(graphqlOperation(UpdatePicture, putInput))
	.then (result => {
		console.log(`Successfully updated the item ${result.data.updatePicture.title} in the Pictures table. reference:`, result.data.updatePicture.id)
		return 'Success'
	})
	.catch(err => {
		console.log('error: ', err)
		return err
	});
	switch(putToDB) {
		case 'Success':
			// aad the picture to s3 storage bucket
			let addPicture = await new addToStorage(contentType, section, input.title, file, ext);
			switch(addPicture) {
				case 'Success':
					// create the index and add that to s3 storage
					let addGallery = await new createGallery();
					switch(addGallery) {
						case 'Success':
							console.log('Success!')
							return 'Success'
						default:
							console.log("Error: Failed to save the picture gallery");
							return 'Error';
					}
			default:
				console.log("Error: Failed to save the picture.");
				return 'Error';
		}
	default:
		console.log('Error. Something went wrong. please try again', putToDB);
		return 'Error'
	}
}