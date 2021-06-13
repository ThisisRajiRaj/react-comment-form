import React from "react";
import CommentFormImpl from "./CommentForm";

function CommentForm(props) {
  return (
    <React.Fragment>      
      <CommentFormImpl parentId={props.parentId}/>
    </React.Fragment>
  );
}

export default CommentForm;
