import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import { connect } from "react-redux";
import { addLike, removeLike, removePost } from "../../actions/post";

const PostItem = ({
  addLike,
  removeLike,
  removePost,
  auth,
  post: { _id, text, name, avatar, likes, comments, date, user },
  showActions
}) => {
  return (
    <div className="post bg-white my-1">
      <Link to={`/profile/${user}`}>
        <img className="round-img" src={avatar} alt="User's gravatar" />
        <h4>{name}</h4>
      </Link>

      <div className="p-3">
        <p className="my-1 ">{text}</p>
        <p className="post-date small-text">
          Posted on <Moment format="DD/MM/YYYY">{date}</Moment>
        </p>

        {showActions && (
          <Fragment>
            <button onClick={e => addLike(_id)} className="btn">
              <i className="fa fa-thumbs-up"></i>{" "}
              {likes.length > 0 && <span>{likes.length}</span>}
            </button>
            <button onClick={e => removeLike(_id)} className="btn">
              <i className="fa fa-thumbs-down"></i>
            </button>

            <Link to={`/post/${_id}`} className="btn btn-primary">
              Discussion{" "}
              {comments.length > 0 && (
                <span className="comment-count">{comments.length}</span>
              )}
            </Link>

            {!auth.loading && user === auth.user._id && (
              <a
                onClick={e => removePost(_id)}
                type="button"
                className="btn btn-danger"
              >
                <i className="fa fa-times"></i>
              </a>
            )}
          </Fragment>
        )}
      </div>
    </div>
  );
};

PostItem.defaultProps = {
  showActions: true
};

PostItem.propTypes = {
  post: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  addLike: PropTypes.func.isRequired,
  removeLike: PropTypes.func.isRequired,
  removePost: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, { addLike, removeLike, removePost })(
  PostItem
);
