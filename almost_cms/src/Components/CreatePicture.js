import { API, graphqlOperation } from "aws-amplify";
import CreatePicture from '../GraphQL/MutationCreatePicture.js';
import { copyToBucket, addToStorage } from './Shared.js';
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
			let addPicture = await new addToStorage(contentType, section, input.title, file, ext);
			switch(addPicture) {
			// if the create index function is succesful
			case 'Success':
				const bucketVars = {
				sourceRoute: `public/${section}`,
				sourceObject: input.file,
				destRoute: section
				};
				let copyPicture = await new copyToBucket(bucketVars);
				switch(copyPicture) {
				// If the copy Picture function is succesful
					case 'Success':
						console.log(`Succesfully copied ${bucketVars.sourceObject} to ${bucketVars.destRoute}`);
						// execute the create index function
						let addGallery = await new createGallery();
						switch(addGallery) {
						// if the create index function is succesful
						case 'Success':
							// execute the copy index function
							const bucketVars = {
							sourceRoute: 'public/gallery',
							sourceObject: 'index.html',
							destRoute: 'gallery'
							};
							let copyGallery = await new copyToBucket(bucketVars);
							switch(copyGallery) {
							case 'Success':
								console.log( "Congratulations! you have succesfully published your new picture!" );
								break;
							default:
								console.log("Error: Failed to copy your gallery")
							}
							break;
						default:
							console.log("Error: Failed to save the new picture gallery");
						}
						break;
				default:
					console.log(copyPicture)
					console.log("Error: Failed to copy your picture to your public bucket.");
				}
				break;
		default:
			console.log("Error: Failed to add your picture to storage."); 
		}
		break
		default:
			console.log('Error. Something went wrong. please try again later.', addToDB)
		}
	}