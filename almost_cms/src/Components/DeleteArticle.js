import { removeFromStorage, copyToBucket, unPublish } from './Shared.js';
import { API, graphqlOperation } from "aws-amplify";
import DeleteArticle from '../GraphQL/MutationDeleteArticle.js';
import createIndex from './CreateArticleIndex'
		
export default async function deleteArticle(section, fileName, item) {
    //Delete from S3 stoarge
    var objectPath = `${section}/${fileName}`
    let unPublishedItem = await new removeFromStorage(objectPath);
    switch(unPublishedItem) {
        case 'Success':
            console.log(`Succesfully removed ${fileName} from ${section}`);
            //Delete from DB
            const deleteInput = { id: item }
            var removeFromDB = await API.graphql(graphqlOperation(DeleteArticle, deleteInput))
            .then (result => {
                console.log(`Successfully deleted the item ${result.data.deleteArticle.title} from the articles table. reference:`, result.data.deleteArticle.id)
                return 'Success'
            })
            .catch(err => {
                console.log('error: ', err)
                return 'err'
            });
            switch(removeFromDB) {
                case 'Success':
                    console.log('Success!');
                    //Create Index
                    let addIndex = await new createIndex();
					switch(addIndex) {
                        case 'Success':
                            //Copy the new index
                            const indexVars = {
                                sourceRoute: 'public/articles',
                                sourceObject: 'index.html',
                                destRoute: 'articles'
                            };
                            let copyIndex = await new copyToBucket(indexVars);
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
                    console.log("Error: Failed to Dlete your Article from the DB");
            }
            break;
        default:
            console.log("Error: Failed to copy your picture to your public bucket.");
    }
	
}