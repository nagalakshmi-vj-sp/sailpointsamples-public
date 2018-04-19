import React, { Component } from 'react';
import ReactDOM from 'react-dom';

export function closeAlert(){
  //console.log("Close!");
}

export function displayAlert ( type, title, message ) {
  ReactDOM.render(
    <DismissableAlert type={type} title={title} message={message} visible="true"/>,
    document.getElementById( 'alerts' )
  );
}

export class DismissableAlert extends Component {
  constructor( props ) {
    super( props );
    this.state = {
      visible: props.visible
    };
  }
  render(){
    if ( !this.state.visible ) {
      return null;
    } else {
      return (
        <div className={`alert alert-${this.props.type} alert-dismissible fade show`} role='alert'>
          <h4 className="alert-heading">{this.props.title}</h4>
          <hr/>{this.props.message}
          <button type="button" className="close" aria-label="Close" data-dismiss="alert" onClick={closeAlert()}>
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      )
    }
  }
}
