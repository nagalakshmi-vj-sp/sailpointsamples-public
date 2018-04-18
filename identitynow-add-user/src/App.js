
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
import { Form, Text, Select } from 'react-form';
import { config } from "./config";
import IDNClient from "./IDNClient";
import { displayAlert } from "./Alerts";

class App extends Component {

  constructor( props ) {
    super( props );
    this.state = {};
  }

  submitForm( formValues ) {
    IDNClient.createAccount( config.tenant, config.source, formValues, displayAlert );
  }

  render(){
      return (
        <div className="panel-body">
          <Form onSubmit={formValues => this.submitForm( formValues )}>
            { formApi => (
              <form onSubmit={formApi.submitForm} id="dynamic-form">
                <FormElements entries={config.formElements} />
                <div className="row">
                  <div className="col-sm-10 form-group text-right">
                    <button type="submit" className="btn btn-success">Submit</button>
                  </div>
                </div>
              </form>
            )}
          </Form>
        </div>
      );
    }
}

class FormElements extends Component {

  constructor( props ) {
    super( props );
    this.state = {};
  }

  render(){
    const formElements = this.props.entries.map((entry) =>
      <FormElement entry={entry} key={entry.name}/>
    );
    return ( <div>{formElements}</div> );
  }
}

class FormElement extends Component {

  constructor( props ) {
    super( props );
    this.state = {};
  }

  render(){
    var formElement;
    switch( this.props.entry.type ) {
      case "list":
        formElement = <Select className="form-control" field={this.props.entry.name} id={this.props.entry.name} options={this.props.entry.options} />;
        break;
      case "string":
      default:
        formElement = <Text className="form-control" field={this.props.entry.name} id={this.props.entry.name}/>;
    }

    return (
      <div className="row" key={this.props.entry.name}>
        <div className="col-sm-2 form-group text-right">
          <label htmlFor={this.props.entry.name}>{this.props.entry.displayName}</label>
        </div>
        <div className="col-sm-1 form-group text-right">
          <span className="badge badge-dark" rel="txtTooltip" data-toggle="tooltip" data-placement="top" title={this.props.entry.tooltip} trigger="hover focus">?</span>
        </div>
        <div className="col-sm-7 form-group">
          {formElement}
        </div>
      </div>
    );
  }
}

export default App;
