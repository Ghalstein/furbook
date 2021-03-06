import React from 'react';
import { Link } from 'react-router-dom';
import Comment from '../components/Comment/Comment';
import { getComments } from '../actions/commentActions';
import { connect } from 'react-redux';
import withAuth from '../hocs/withAuth';
import { withRouter } from 'react-router-dom';

class Comments extends React.Component {

  // gets the current signed in user
  state = {
    username: ''
  }

  componentDidMount() {
    this.props.getComments();
  }
  
  render = () => {
    // on render drags the scroll to the bottom
    var commentScroll = document.querySelector(".comment-container");
    if (commentScroll) {
      commentScroll.scrollTop = commentScroll.scrollHeight;
    }
    // filters the comments based on it belonging to the post
    let comments = this.props.comments.filter(comment => comment.post_id === this.props.info.id)

    return (
      <div className="all-comments">
        <div className="comment-container">
          {comments.length ? comments.map(comment => <Comment comment={comment}/>) : <div className="no-comments">There are no comments...</div>}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.currentUser,
    comments: state.commentReducer.comments
  }
}

const mapDispatchToProps = {
  // more to do for getComments redux
  getComments: getComments
}

export default withAuth(connect(mapStateToProps, mapDispatchToProps)(withRouter(Comments)))