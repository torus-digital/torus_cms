**Getting Started with almost CMS**
    
1. ** Prerequisites **
    1. Make sure you have node.js and npm installed. You can checkout this [tutorial](https://medium.com/@lucaskay/install-node-and-npm-using-nvm-in-mac-or-linux-ubuntu-f0c85153e173) to install npm and node in mac, linux (debian/ubuntu).
    2. Make sure you have an AWS account. If you don't have an AWS account, you can easily create one [here](https://portal.aws.amazon.com/billing/signup?#/start). Don't worry, everything you do with this project will fall within the AWS free tier limit! If you want to deploy cloudfront and you get a lot of traffic in your site you'll perhaps have a small bill.. 
2. Clone the git repository
3. Go into the app directory of the project ` cd almost_cms/almost_cms `
4. Install all dependencies by running ` npm install`
5. Install the amplify cli ` npm install -g @aws-amplify/cli`
6. run the deplyment script `node deployment-script.js`
7. Configure amplify by running ` amplify configure `
    - If you need help with configuration check out this [video tutorial](https://www.youtube.com/watch?v=fWbM5DLh25U)
8. Create a file called .env withe the following variables

    ```
    AWS_ACCESS_KEY_ID=your-access-key
    AWS_SECRET_ACCESS_KEY=your-secret-access-key
    AWS_REGION=us-east-1
    AWS_ACCOUNT_NUMBER=your-aws-account-number
    ```

9. To find your AWS account number, go to the [AWS console support center](https://console.aws.amazon.com/support/home?)
![image 18](img/18.png)
10. Initialize a new amplify project inside your react app ` amplify init `
![init1](img/init1.png)
![init2](img/init2.png)
11. Add authentication ` amplify add auth` use the default configuration
12. Add an S3 storage bucket ` amplify add storage `
![storage](img/storage.png)
13. Add a graphQL API ` amplify add api ` to easily store and retrieve data from dynamoDB 
![api](img/api.png)
14. Set up hosting for the amplify app `amplify hosting add `
    
    1. Select ` dev `
    2. For the name of the bucket, enter ` admin.your-domain.com ` replace your-domain.com with your domain..


15. Re-run the deployment script. the name of your storage bucket will contain -dev at the end (dev is the name of your environment).

16. Add a new variable to your .env file containing the api invoke URL `REACT_APP_COPY_BUCKET_URL=your-invoke-url`.


16. Now your ready to publish your app. Run ` amplify publish `

    1. Do you want to generate code for your newly created api? ` No `
    2. Be a bit patient ...

17. Your all set! now you can upload pictures and articles to your static site!

