import React, { useState, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { addPost } from "../../actions/post";

const PostForm = ({ addPost }) => {
  const [text, setText] = useState("");

  const onSubmit = e => {
    addPost({ text });

    //Clear input
    setText("");

    e.preventDefault();
  };

  return (
    <Fragment>
      <div className="post-form-header bg-primary">
        <h3>Say Something...</h3>
      </div>

      <form className="form my-1" onSubmit={onSubmit}>
        <textarea
          cols="30"
          rows="5"
          value={text}
          name="text"
          onChange={e => setText(e.target.value)}
          placeholder="Create a post"
        ></textarea>
        <input type="submit" value="Submit" className="btn btn-dark my-1" />
      </form>
    </Fragment>
  );
};

PostForm.propTypes = {
  addPost: PropTypes.func.isRequired
};

export default connect(null, { addPost })(PostForm);
