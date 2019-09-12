import React from 'react';

export default class ProfilePhoto extends React.Component {

	state = {
		clicked:false
	}

	enlarge = () => {
		this.setState({clicked: !this.state.clicked})
	}

	render = () => {
		// debugger
		// console.log(this.state)
		return(
			<div>
				{this.state.clicked ? 
					<div className="pic-modal">
						<button onClick={this.enlarge} className="closePic">X</button>
						<img className="modal-profile-photo" src={this.props.photo.picture.url} />
					</div> 
				: 
					null
				}
				<img onClick={this.enlarge} className="profile-photo" src={this.props.photo.picture.url} />
			</div>
		)
	}
}