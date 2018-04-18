
// Copyright 2018 SailPoint Technologies, Inc.

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

//     http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

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
