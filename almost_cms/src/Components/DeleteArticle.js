import { unPublish } from './Shared.js';
//import { API, graphqlOperation } from "aws-amplify";
//import CreateArticle from '../GraphQL/MutationCreateArticle.js';
//import the createIndexFunction
//import createIndex from './CreateArticleIndex'		
//import publishArticle from './PublishArticle.js';
		
export default async function deleteArticle(fileName) {
	//TEMPLATE
	const section = 'articles';
    const bucketVars = {
        sourceRoute: '',
        sourceObject: fileName,
        destRoute: section,
        delete: true,
    };
	let unPublishedItem = await new unPublish(bucketVars);
    switch(unPublishedItem) {
        case 'Success':
            console.log(`Succesfully removed ${fileName} from ${bucketVars.destRoute}`);
            break;
        default:
            console.log("Error: Failed to copy your picture to your public bucket.");
    }
	
}