# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
Publishing to package manager was done using instructions [here](https://medium.com/@revanth0212/how-to-create-and-publish-react-components-using-the-create-react-app-9d60583c2161)


## To install this component
```
npm install react-comment-form
```

## To use this component

**Prerequisites:** You need to have Node + NPM installed.

```jsx
import React from "react";
import QuotesSlider from "react-comment-form";

export default function MyBlogCommentForm() {
  return (
    <CommentForm
      parentId="unique_id"
    />
  );
}
```

parentId is a mandatory property. It identifies all comments that belong to the 
same parent (e.g.: a blog post).

## Backend APIs
This component expects the following backend APIs. The public repo 
[here](https://github.com/ThisisRajiRaj/siteapis) has example code
written as Azure Functions, but any API that follows the protocol below would do.

1. REACT_APP_BLOGMETADATA_URL. This environment variable should point to an API supporting POST, GET 
that accepts the following
parameters and returns another json response.

```json
Input to API

    {
        "name": "parentId"
    }


Output/Response from API
   {
        "name": "parentId",
        "comments": "all_stored_comments",
        "likes":"current_like_count"
    }


```


2. REACT_APP_UPDATELIKES_URL. This environment variable should point to an API supporting POST, GET
that will update
the current like count, addint the passed in numeric value to the existing count. It will return
the final updated count in respose.

```json
Input to API

    {
        "name": "parentId",
        "likes": number_to_add_current_like_count
    }


Output/Response from API is expected to be an int value 
```



3. REACT_APP_COMMENTS_URL. This environment variable should point to an API supporting POST, GET
that will update
the current comments by prepending the existing comments with the string passed in. 

```json
Input to API

    {
        "name": "parentId",
        "comments": "comments to prepend."
    }


Output/Response from API is expected to be an string value that will contain all the comments 
including what is passed in. 
```


4. REACT_APP_SENDMAIL_URL. This environment variable should point to an API supporting POST, GET
that will send email using a service like SendGrid. This API is only needed if REACT_APP_SENDMAIL 
is set to true - see below.
```json
Input to API

    {
        "fromemail": "fromemail_from_form",
        "from": "user name from form",
        "message": "comment"
    }


Output/Response from API is expected to be an string value that will contain all the comments 
including what is passed in. 
```
## Environment variables
The following environment variables are expected by the component. You can set them in a 
.env file at the root of your project

```
REACT_APP_SENDMAIL_URL (Backend API to send email if REACT_APP_SENDMAIL is true)
REACT_APP_SENDMAIL (true|false. If true, every new comment will be sent as an email using the backend API above)
REACT_APP_SENDMAIL_API_KEY (the component will send email if REACT_APP_SENDMAIL is set to true and sendmail is configured)
REACT_APP_BLOGMETADATA_URL (backend API to retrieve info from storage of blog metadata - comments, likes)
REACT_APP_UPDATELIKES_URL (backend API to update like count )
REACT_APP_GOOGLE_CAPTCHA_SITE_KEY (your key for captcha. see [here](https://www.google.com/recaptcha/admin/create))
REACT_APP_COMMENTS_URL (backend API to add comments)
REACT_APP_API_KEY (API key for communicating with the backend API. This will be appended to the end of the 
URLs above with a query string ?code=REACT_APP_API_KEY
```