import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { deleteComment } from '../../actions/postActions'

class CommentItem extends Component {
  onDeleteClick(postId, commentId) {
    this.props.deleteComment(postId, commentId)
  }

  render() {
    const { postId, auth, comment } = this.props

    return (
      <div className="card card-body mb-3">
        <div className="row">
          <div className="col-md-1">
            <a href="profile.html">
              <img
                className="rounded-circle d-none d-md-block"
                src={comment.avatar}
                alt=""
              />
            </a>
          </div>
          <div className="col-md-11">
            {comment.user === auth.user.id ? (
              <button
                onClick={this.onDeleteClick.bind(this, postId, comment._id)}
                type="button"
                className="btn btn-danger float-right"
              >
                <i className="fas fa-times" />
              </button>
            ) : null}

            <strong className="d-block">{comment.name}</strong>

            <p>{comment.text}</p>
          </div>
        </div>
      </div >
    )
  }
}

CommentItem.propTypes = {
  deleteComment: PropTypes.func.isRequired,
  postId: PropTypes.string.isRequired,
  comment: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  auth: state.auth
})

export default connect(mapStateToProps, { deleteComment })(CommentItem)