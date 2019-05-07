import { API, graphqlOperation } from "aws-amplify";
import gql from '../GraphQL/QueryListArticles';
import { addToStorage } from './Shared.js';

export default function createIndex(){
	let query = API.graphql(graphqlOperation(gql))
	.then (result => {
		const articles = result.data.listArticles.items;
		const title = 'index';
		const section = 'articles';
		const before_body = `<!DOCTYPE html> <html lang="en"> <head> <meta charset="utf-8"> <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"> <meta name="description" content=""> <meta name="author" content=""> <title>Almost CMS - Articles</title> <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.1/css/all.css" integrity="sha384-50oBUHEmvpQ+1lW4y57PTFmhCaXp0ML5d60M1M7uH2+nqUivzIebhndOJK28anvf" crossorigin="anonymous"> <link href='https://fonts.googleapis.com/css?family=Merriweather:400,300,300italic,400italic,700,700italic' rel='stylesheet' type='text/css'> <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous"> <link href="../css/index.css" rel="stylesheet"> </head> <body id="page-top"> <nav class="navbar navbar-expand-lg fixed-top py-3" id="mainNav"> <div class="container"> <a class="navbar-brand js-scroll-trigger" href="../index.html"> <img src="../img/almost-logo.svg" height="60" width="auto"> </a> <button class="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation"> <span class="fa fa-lg fa-bars text-primary"></span> </button> <div class="collapse navbar-collapse" id="navbarResponsive"> <ul class="navbar-nav ml-auto my-2 my-lg-0"> <li class="nav-item"> <a class="nav-link js-scroll-trigger" href="../about.html">About</a> </li> <li class="nav-item"> <a class="nav-link js-scroll-trigger" href="#">Articles</a> </li> <li class="nav-item"> <a class="nav-link js-scroll-trigger" href="../gallery/index.html">Gallery</a> </li> <li class="nav-item"> <a class="nav-link js-scroll-trigger" href="../contact.html">Contact</a> </li> </ul> </div> </div> </nav> <section class="page-heading bg-primary" id="about"> <div class="container"> <div class="row justify-content-center"> <div class="col-lg-8 text-center"> <h4 class="text-white pt-4">The latest on Almost CMS</h4> </div> </div> </div> </section> <section class="bg-light"> <div class="row py-2 pr-lg-2"> <div class="col-sm-12 container text-center"> <input id="articlesSearch" type="text" class="float-md-right search-bar" placeholder="Search.."> </div> </div> </section> <section class="index-body"> <table> <tbody id="articlesTable">`;
		const after_body = `</tbody> </table> </section> <footer class="bg-light py-5"> <div class="container-fluid"> <div class="row small text-center text-muted"> <div class="col-md-6"> <div>Copyright &copy; 2019 - Almost CMS</div> </div> <div class="col-md-6"> <div> Powered By <a href="https://github.com/gkpty/almost_cms">Almost CMS</a></div> </div> </div> </div> </footer> <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script> <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.bundle.min.js" integrity="sha384-xrRywqdh3PHs8keKZN+8zzc5TX0GRTLCcmivcbNJWm2rs5C8PRhcEn3czEjhAO9o" crossorigin="anonymous"></script> <script type="text/javascript"> $(document).ready(function(){$("#articlesSearch").on("keyup", function() {var value = $(this).val().toLowerCase(); $("#articlesTable tr").filter(function() {$(this).toggle($(this).text().toLowerCase().indexOf(value) > -1) }); }); }); </script> <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script> <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.bundle.min.js" integrity="sha384-xrRywqdh3PHs8keKZN+8zzc5TX0GRTLCcmivcbNJWm2rs5C8PRhcEn3czEjhAO9o" crossorigin="anonymous"></script> <script src="../js/index.js"></script> </body> </html>`;
		const contentType = 'text/html';
		var body = '';
		for (let elem of articles) { 
			body += (
				`<tr class="container">
					<td class="img-td">
						<img class="img-fluid p-4" src="../img/default_img.jpg">
					</td>
					<td class="h2 row article-title">
						<a href="${elem.title}.html">${elem.title}</a>
					</td>
					<td class="row article-body">
						${elem.body_txt.substring(0,128)} ...
					</td>         
				</tr>`
				); 
			}
		const fileObj = before_body + body + after_body;
		const Obj = {
			contentType: contentType,
			section: section,
			title: title,
			fileObj: fileObj,
		}
		let secondFunct = addToStorage(Obj.contentType, Obj.section, Obj.title, Obj.fileObj, 'html'); 
		return secondFunct;				
	})
	.catch(err => {
			console.log('error: ', err)
	});
	return query;
}