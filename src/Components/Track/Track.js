import React, { Component } from 'react';
import './Track.css';

class Track extends Component {
    constructor(props) {
        super(props);
        this.addTrack = this.addTrack.bind(this);
        this.removeTrack = this.removeTrack.bind(this);
    }
    addTrack() {
        this.props.onAdd(this.props.track);
    }
    removeTrack() {
        this.props.onRemove(this.props.track);
    }
    renderAction() {
        let action;
        if (this.props.isRemoval) {
            action = <div onClick={this.removeTrack}>-</div>;
        } else {
            action = <div onClick={this.addTrack}>+</div>;
        }
        return action
    }
    render() {
        return (
            <div className="Track">
                <div className="Track-information">
                    <h3>{this.props.track.Name}</h3>
                    <p> {this.props.track.Artist} | {this.props.track.Album} </p>
                </div>
                <a className="Track-action">{this.renderAction()}</a>
            </div>
        );
    }
}

export default Track;