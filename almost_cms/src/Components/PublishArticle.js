import { copyToBucket } from './Shared.js';

export default async function publishArticle(articleVars) {
    // execute the copy article function.
    let copyArticle = await new copyToBucket(articleVars);
    switch(copyArticle) {
        // If the copy article function is succesful
        case 'Success':
            console.log(`Succesfully copied ${articleVars.sourceObject} to ${articleVars.destRoute}`);
            // execute the copy index function
            const indexVars = {
                sourceRoute: 'public/articles',
                sourceObject: 'index.html',
                destRoute: 'articles'
            };
            let copyIndex = await new copyToBucket(indexVars);
            switch(copyIndex) {
                case 'Success':
                    console.log( "Congratulations! You have succesfully published your new Article!" );
                    return 'Success';
                default:
                    console.log("Error: Failed to copy your index")
                }
            break;
        default:
            console.log("Error: Failed to copy your article to your public bucket.");
    }
}