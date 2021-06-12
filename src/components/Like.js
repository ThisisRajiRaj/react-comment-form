import React, { Component } from "react";
import { FcLikePlaceholder, FcLike } from "react-icons/fc";
import Button from 'react-bootstrap/Button'

class Like extends Component {

    state = { liked: false };

    
    render() {
        return (
            <div>
                <Button variant="primary" size="sm">

                    <div
                        onClick={() => {
                            // this.toggle(); 
                            // Toggle the state variable liked
                            let localLiked = !this.state.liked;   
                            this.setState({ liked: localLiked });
                            if (this.props.onLikeChange !== undefined) {
                                this.props.onLikeChange(localLiked)
                            }
                        }}
                    >
                        <center>
                            {this.state.liked === false ? (
                                <FcLikePlaceholder />
                            ) : (
                                <FcLike />
                            )}
                        </center>
                    </div>
                </Button>
                
                <span className="pl-2">({this.props.currentLikes} like(s))</span>
            </div>
        );
    }
}

export default Like;
