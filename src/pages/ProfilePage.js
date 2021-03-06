import React from 'react';
import UploadPhoto from '../components/Profile/uploadPhoto';
import withAuth from '../hocs/withAuth';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { getUserById } from '../actions/usersActions';
import { createMessage } from '../actions/messageActions';
import ProfilePhotos from '../components/Profile/ProfilePhotos';
import ProfilePosts from '../components/Profile/ProfilePosts';
import EditProfilePic from '../components/Profile/EditProfilePic';
import EditBio from '../components/Profile/EditBio';

// make a working redux fetch for the specific profile you are on

class ProfilePage extends React.Component {

  // state keeps track of whether icon is clicked
  state = {
    iconClicked: false,
    editProfileClicked: false
  }
  componentDidMount = () => {
    // makes sure user is signedin
    if (!localStorage.token && this.props.hasOwnProperty('history')) this.props.history.push("/")
    // gets the user's page info
    this.props.getUserById(this.props.location.pathname.split("/")[2]);
    // keeps track of the state's pathname
    this.setState({pathname: this.props.location.pathname})
  }


  uploadedPhoto = () => {
    this.setState({editProfileClicked: true})
  }

  // if the user is on his/own page can click the icon to edit pro pic
  handleIconClick = () => {
    if (this.props.user.id === parseInt(this.props.location.pathname.split("/")[2])) {
      this.setState({iconClicked: true})
    }
  }

  // closes the close for the modal
  handleCloseIcon = () => {
    this.setState({iconClicked: false})
  }

  // makes the fetch to update the database that a friend request was sent to the respective user
  handleFriendRequest = () => {
    fetch(`https://furbook-api.herokuapp.com/friendships`, {
      method: "POST",
      headers: {
        'Authorization': localStorage.token,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(
        {
          'user_id': this.props.user.id,
          'friend_user_id': this.props.profileUser.id
        }
      )
    }).then(res => res.json())
    //displays the friend status as pending
    .then(this.setState({friendRequestSent: true}))
  }

  // accepting the friend request makes the the two users friends and changes the firend status the button to unfriend
  handleAccept = () => {
    let friendship = this.props.user.pending_friend_requests.find(friendRequest => friendRequest.user.id === this.props.profileUser.id);
    // this.props.createMessage("Thanks for accepting my friend request", friendship.user_id, friendship.id)
    fetch(`https://furbook-api.herokuapp.com/friendships/${friendship.id}`, {
      method: 'PATCH',
      headers: {
        'Authorization': localStorage.token,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(
        {
          "pending": false
        })
    })
    .then(this.setState({acceptedRequest: true}))
  }

  // unfriends the friend and makes them not friends anymore
  handleUnfriend = () => {
    let id = this.props.profileUser.friends.find(friend => parseInt(friend.user.id) === parseInt(this.props.user.id)).id;
    fetch(`https://furbook-api.herokuapp.com/friendships/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': localStorage.token,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    }).then(this.setState({unfriended: true}))
    .then(window.location.reload())
  }

  handleEditProfile = () => {
    this.setState({editProfileClicked: !this.state.editProfileClicked})
  }

  // {this.state.editProfileClicked ? 
  //   <div className="profile-modal">
  //     <EditBio profileUser={this.props.user} handleEditProfile={this.handleEditProfile}/>
  //   </div>
  // :
  //   null
  // }


  // page render
  render = () => {
    // checks if their is a user
    if (!Object.keys(this.props.profileUser).length) return null;
    if (!this.props.user.id) return null;
    if (this.props.location.pathname !== this.state.pathname) {
      this.setState({pathname: this.props.location.pathname})
      window.location.reload();
    }
    // debugger
    console.log(this.props)
    // debugger
    if (this.props.profileUser.error === "Not Found") {
      // debugger
      this.props.history.push('/home')
      window.location.reload();
    }
    return (
      <div className="/profile">
        <div className="ProfilePage">
        {this.state.iconClicked ? 
          <div className="profile-modal">
            <EditProfilePic handleCloseIcon={this.handleCloseIcon}/>
          </div>
        :
          null
        }
          <h1 className="Hi"> {this.props.profileUser.username ? `${this.props.profileUser.username}'s page` : 'Getting your profile...'}</h1>
          <div className="profile-icon-friend-options">
            <div className="profile-icon-div">
              {this.props.profileUser.pro_pics.length ?
                <img onClick={this.handleIconClick} className="profile-icon" src={this.props.profileUser.pro_pics.slice(-1)[0].picture.url} />
              :
                <img onClick={this.handleIconClick} className="profile-icon" src='https://image.flaticon.com/icons/png/512/17/17479.png' />
              }
              <h2 className="profile-username">{this.props.profileUser.username}</h2>
            </div>
            <div className="friend-options">
              {this.props.user.id === parseInt(this.props.location.pathname.split("/")[2]) ?
                null
              :
                this.props.profileUser.friends.find(friend => friend.user.id === this.props.user.id) || this.state.acceptedRequest || this.state.unfriended ? 
                  <button onClick={this.handleUnfriend} className="unfriend">Unfriend</button>
                :
                  this.props.profileUser.pending_friend_requests.find(friendRequest => friendRequest.user.id === this.props.user.id) || this.state.friendRequestSent ?
                    <a className="request-pending">Request Pending</a>
                  :
                    this.props.user.pending_friend_requests.find(friendRequest => friendRequest.user.id === this.props.profileUser.id) ?
                      <button onClick={this.handleAccept} className="accept-request"> Accept their Request </button>
                    :
                      <button onClick={this.handleFriendRequest} className="friend-request">Friend Request</button>
              }
            </div>
          </div>
          <div className="posts-photos-div">
            {this.props.profileUser.posts.length ? 
              <div className="profile-posts-container">
                <h2> Posts</h2>
                <ProfilePosts user={this.props.profileUser} />
              </div>
            :
              <h2 className="no-posts-to-show">No posts to show...</h2>
            }

            {this.props.profileUser.photos.length ? 
              <div className="profile-photos">
                <h2> Photos & Videos</h2>
                {this.props.user.id === parseInt(this.props.location.pathname.split("/")[2]) ?
                  <UploadPhoto uploadedPhoto={this.uploadedPhoto} type={"photos"} userInfo={this.props.userInfo}/>
                :
                  null
                }
                <ProfilePhotos photos={this.props.profileUser.photos}/>
              </div>
            :
              <div className="profile-photos">
                <h2 className="no-photos-to-show">No photos to show...</h2>
                {this.props.user.id === parseInt(this.props.location.pathname.split("/")[2]) ?
                  <UploadPhoto type={"photo"} />
                :
                  null
                }
              </div>
            }
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  // console.log(state)
  return {
    user: state.currentUser,
    profileUser: state.usersReducer.user
  }
}

const mapDispatchToProps = {
  getUserById: getUserById,
  createMessage: createMessage
}

export default withAuth(connect(mapStateToProps, mapDispatchToProps)(withRouter(ProfilePage)))