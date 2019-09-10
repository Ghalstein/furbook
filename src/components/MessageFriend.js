import React from 'react';
import CreateMessage from './CreateMessage';
import { getMessages } from '../actions/messageActions';
import { connect } from 'react-redux';
import withAuth from '../hocs/withAuth';
import { withRouter } from 'react-router-dom';

class MessageFriend extends React.Component {

	state = {
		messageOpend: false
	}

	componentDidMount() {
  	this.props.getMessages();
  }

	handleOpenMessages = () => {
		this.setState({messageOpend: true})
	}

	handleCloseMessages = () => {
		this.setState({messageOpend: false})
	}

	render = () => {
		// debugger
		console.log(this.props.messageInfo)
		let messages = this.props.messages.filter(message => message.friendship_id === this.props.messageInfo.friendship_id)
		return (
				<div>
					{this.state.messageOpend ?
						<div className="chat">
							<div className="top-chat">
								<a onClick={this.handleCloseMessages} className="close x-out">x</a>
							</div>
							<div className="message-friend-name">
								{this.props.messageInfo.friend.username}
							</div>
							<div>
								<CreateMessage messageInfo={this.props.messageInfo}/>
							</div>
						</div>
					:
						<div onClick={this.handleOpenMessages} className="message-friend">
							{this.props.messageInfo.friend.username}
						</div>
					}
				</div>
		)
	}
}

const mapStateToProps = state => {
  // console.log(state)
  return {
    user: state.currentUser,
    messages: state.messageReducer.messages
  }
}

const mapDispatchToProps = {
  // more to do for getComments redux
  getMessages: getMessages
}

export default withAuth(connect(mapStateToProps, mapDispatchToProps)(withRouter(MessageFriend)))