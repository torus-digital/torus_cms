import { copyToBucket } from './Shared.js';

export default async function publishPicture(bucketVars){
    // copy the picture to the s3 website bucket
    let copyPicture = await new copyToBucket(bucketVars);
    switch(copyPicture) {
        case 'Success':
            console.log(`Succesfully copied ${bucketVars.sourceObject} to ${bucketVars.destRoute}`);
            const galleryVars = {
                sourceRoute: 'public/gallery',
                sourceObject: 'index.html',
                destRoute: 'gallery'
            };
            // copy the gallery to the s3 website bucket
            let copyGallery = await new copyToBucket(galleryVars);
            switch(copyGallery) {
                case 'Success':
                    console.log( "Congratulations! you have succesfully published your new picture!" );
                    break;
                default:
                    console.log("Error: Failed to copy your gallery")
            }
            break;
        default:
            console.log("Error: Failed to copy your picture to your public bucket.");
    }
}
