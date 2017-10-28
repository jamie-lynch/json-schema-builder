import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Message, Header, Segment } from 'semantic-ui-react'
import { dataTypeOptions } from '../enums'

import StringOptions from './furtherOptions/StringOptions'
import NumberOptions from './furtherOptions/NumberOptions'
import ObjectOptions from './furtherOptions/ObjectOptions'
import ArrayOptions from './furtherOptions/ArrayOptions'
import EnumsOptions from './furtherOptions/EnumsOptions'
import MultipleOptions from './furtherOptions/MultipleOptions'

class SchemaForm extends Component {
  constructor () {
    super()

    // bind functions to be used
    this.generateSchemaObject = this.generateSchemaObject.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.validateData = this.validateData.bind(this)
    this.renderFurtherOptions = this.renderFurtherOptions.bind(this)

    // setup the initial state
    this.state = {
      schema: {},
      type: null,
      warnings: {
        validation: null
      }
    }
  }

  /**
   * The function validates the inputs provided in the schema form
   * @return {string} An error message generated after validating the inputs
   */
  validateData () {
    var msg
    if (typeof this.state.schema.title !== 'string' || this.state.schema.title === 0) {
      msg = 'Please enter a title value'
    } else if (typeof this.state.schema.description !== 'string' || this.state.schema.description === 0) {
      msg = 'Please enter a description value'
    } else if (typeof this.state.schema.id !== 'string' || this.state.schema.id === 0) {
      msg = 'Please enter an id value'
    }

    this.setState(prevState => {
      let newWarnings = Object.assign({}, this.state.warnings)
      newWarnings.validation = msg
      return {warnings: newWarnings}
    })

    return msg
  }

  /**
   * This function is called when an input is changed. It updates the value held
   * in state.
   * @param  {object} e       A native change event generated by the input
   * @param  {string} name    The name of the input which has been changed
   * @param  {any} value   The new value of the input which has been changed
   */
  handleChange (e, { name, value }) {
    // Handle the schema inputs
    if (name.indexOf('schema') > -1) {
      this.setState(prevState => {
        let newSchema = Object.assign({}, prevState.schema)
        let schemaName = name.split('-')[1]
        newSchema[schemaName] = value
        return {schema: newSchema}
      })
    }

    // Handle the type inputs
    if (name === 'type') {
      this.setState({type: value})
    }
  }

  /**
   * The function is called when the form is submitted and creates a schema
   * object using the inputs provided. It calls the setSchema function passed
   * in via props with the generated schema
   */
  generateSchemaObject () {
    // Validate data and abort if there's a problem
    if (this.validateData()) {
      return
    }

    var schemaObject = {}

    // set the $schema value
    schemaObject['$schema'] = 'http://json-schema.org/schema#'

    // Set schema Details
    schemaObject.title = this.state.schema.title
    schemaObject.description = this.state.schema.description
    schemaObject.id = this.state.schema.id

    // Set the type
    if (['boolean', 'null'].includes(this.state.type)) {
      schemaObject.type = this.state.type
    } else {
      Object.assign(schemaObject, this.refs._further.extractOptions())
    }

    this.props.setSchema(schemaObject)
  }

  /**
   * This function render further options based on the type stored in state
   * @return {object} A JSX object to be rendered
   */
  renderFurtherOptions () {
    let content = null
    switch (this.state.type) {
      case 'string':
        content = <StringOptions ref='_further' />
        break
      case 'number':
        content = <NumberOptions ref='_further' />
        break
      case 'object':
        content = <ObjectOptions ref='_further' />
        break
      case 'array':
        content = <ArrayOptions ref='_further' />
        break
      case 'enums':
        content = <EnumsOptions ref='_further' />
        break
      case 'multiple':
        content = <MultipleOptions ref='_further' />
        break
      default:
        break
    }
    return content
  }

  render () {
    return (
      <Segment>
        <Form>
          <Header as='h4'>Schema Details</Header>
          <Form.Group widths='equal'>
            <Form.Field>
              <label>Title</label>
              <Form.Input placeholder='Schema Title' name='schema-title' onChange={this.handleChange} />
            </Form.Field>
            <Form.Field>
              <label>Description</label>
              <Form.Input placeholder='Schema Description' name='schema-description' onChange={this.handleChange} />
            </Form.Field>
            <Form.Field>
              <label>ID</label>
              <Form.Input placeholder='Schema ID' name='schema-id' onChange={this.handleChange} />
            </Form.Field>
          </Form.Group>
          <Form.Field>
            <label>Type</label>
            <Form.Select
              placeholder='Choose type...'
              name='type'
              options={dataTypeOptions}
              onChange={this.handleChange} />
          </Form.Field>
          {this.state.type && this.renderFurtherOptions()}
        </Form>
        {
          this.state.warnings.validation &&
          <Message
            warning
            header='There is a problem with your options'
            content={this.state.warnings.validation}
          />
        }
      </Segment>
    )
  }
}

SchemaForm.propTypes = {
  setSchema: PropTypes.func.isRequired
}

export default SchemaForm
