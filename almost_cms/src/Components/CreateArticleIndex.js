import { API, graphqlOperation } from "aws-amplify";
import gql from '../GraphQL/QueryListArticles';

export default function createIndex(){
	let query = API.graphql(graphqlOperation(gql))
	.then (result => {
		console.log('result: ', result);
		const articles = result.data.listArticles.items;
		console.log(articles);
		var indexBody = '';
		for (let elem of articles) { 
			indexBody += (
				`<div class="row">
					<div class="col-sm-4">
						<img class="img-fluid p-4" src="../images/gallery/images/image1.jpg">
					</div>
					<div class="col-sm-8">
						<div class="container p-4 p-4">
							<div class="row">
								<h2>
									${elem.title}
								</h2>
							</div>
							<div class="row">
							<p>
								${elem.body}
							</p>
							</div>
						</div>
					</div>
				</div>
				<hr class="separator"></hr>`
				); 
			} 
		return indexBody;					
	})
	.catch(err => {
			console.log('error: ', err)
	});
	return query;
}