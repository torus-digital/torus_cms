import { API, graphqlOperation } from "aws-amplify";
import CreatePicture from '../GraphQL/MutationCreatePicture.js';
import { addToStorage } from './Shared.js';
import createGallery from './CreatePictureGallery';

export default async function createPicture(input, file, ext) {
  const contentType = 'image/'
	const section = 'gallery';

	var addToDB = await API.graphql(graphqlOperation(CreatePicture, input))
	.then (result => {
		console.log(`Successfully added the item ${result.data.createPicture.title} to the Pictures table. reference:`, result.data.createPicture.id)
		return 'Success'
	})
	.catch(err => {
		console.log('error: ', err)
		return err
	});
	switch(addToDB) {
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
		console.log('Error. Something went wrong. please try again', addToDB);
		return 'Error'
	}
}