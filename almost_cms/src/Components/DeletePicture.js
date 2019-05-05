import { removeFromStorage, copyToBucket, unPublish } from './Shared.js';
import { API, graphqlOperation } from "aws-amplify";
import DeletePicture from '../GraphQL/MutationDeletePicture.js';
import createGallery from './CreatePictureGallery'
		
export default async function deletePicture(section, fileName, item) {
    //Delete from S3 stoarge
    var objectPath = `${section}/${fileName}`
    let unPublishedItem = await new removeFromStorage(objectPath);
    switch(unPublishedItem) {
        case 'Success':
            console.log(`Succesfully removed ${fileName} from ${section}`);
            //Delete from DB
            const deleteInput = { id: item }
            var removeFromDB = await API.graphql(graphqlOperation(DeletePicture, deleteInput))
            .then (result => {
                console.log(`Successfully deleted the item ${result.data.deletePicture.title} from the Pictures table. reference:`, result.data.deletePicture.id)
                return 'Success'
            })
            .catch(err => {
                console.log('error: ', err)
                return 'err'
            });
            switch(removeFromDB) {
                case 'Success':
                    //Create Index
                    let addIndex = await new createGallery();
					switch(addIndex) {
                        case 'Success':
                            //Copy the new index
                            const galleryVars = {
                                sourceRoute: 'public/gallery',
                                sourceObject: 'index.html',
                                destRoute: 'gallery'
                            };
                            let copyIndex = await new copyToBucket(galleryVars);
                            switch(copyIndex) {
                                case 'Success':
                                    console.log( 'Succesfully published the new Index' );
                                    //Un publish the article
                                    const bucketVars = {
                                        sourceRoute: '',
                                        sourceObject: fileName,
                                        destRoute: section,
                                        delete: true,
                                    };
                                    let unPublishedItem = await new unPublish(bucketVars);
                                    switch(unPublishedItem) {
                                        case 'Success':
                                            console.log(`Succesfully un-published ${fileName} from ${bucketVars.destRoute}`);
                                            break;
                                        default:
                                            console.log("Error: Failed to copy your picture to your public bucket.");
                                    }
                                    break;
                                default:
                                    console.log("Error: Failed to copy the index")
                            }
                            break;
                        default:
                            console.log("Error: failed to create the index")
                    }
                    break;
                default:
                    console.log("Error: Failed to delete your Article from the DB");
            }
            break;
        default:
            console.log("Error: Failed to copy your Article to your public bucket.");
    }
	
}