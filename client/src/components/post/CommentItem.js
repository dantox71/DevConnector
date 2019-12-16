import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Moment from "react-moment";
import { removeComment } from "../../actions/post";

const CommentItem = ({
  postId,
  auth,
  comment: { _id, user, text, name, avatar, date },
  removeComment
}) => {
  return (
    <div className="post bg-white p-1 my-1">
      <div>
        <Link to={`/profile/${user}`}>
          <img src={avatar} alt="User Avatar" class="round-img" />
          <h4>{name}</h4>
        </Link>
      </div>

      <div class="px-5 py-3">
        <p className="my-1">{text}</p>
        <p className="post-date small-text">
          Posted on <Moment format="YYYY-MM-DD">{date}</Moment>
        </p>

        {!auth.loading && user === auth.user._id && (
          <button
            type="button"
            onClick={() => removeComment(postId, _id)}
            class="btn btn-danger"
          >
            <i className="fa fa-close"></i>
          </button>
        )}
      </div>
    </div>
  );
};
CommentItem.propTypes = {
  postId: PropTypes.string.isRequired,
  comment: PropTypes.object.isRequired,
  removeComment: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, { removeComment })(CommentItem);
