import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { addComment } from "../../actions/post";

const CommentForm = ({ addComment, postId }) => {
  const [text, setText] = useState("");

  return (
    <div class="post-form">
      <div class="post-form-header bg-primary">
        <h3>Leave A Comment</h3>
      </div>
      <form
        class="form my-1"
        onSubmit={e => {
          addComment({ text }, postId);

          //Clear input
          setText("");
          e.preventDefault();
        }}
      >
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          name="text"
          cols="30"
          rows="5"
          placeholder="Comment on this post"
        ></textarea>
        <input type="submit" class="btn btn-dark my-1" value="Submit" />
      </form>
    </div>
  );
};

CommentForm.propTypes = {
  addComment: PropTypes.func.isRequired
};

// const mapStateToProps = state => ({
//   post: state.post
// });

export default connect(null, { addComment })(CommentForm);
