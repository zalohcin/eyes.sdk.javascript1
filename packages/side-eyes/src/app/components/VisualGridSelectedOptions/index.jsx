import React from 'react'
import PropTypes from 'prop-types'
import RemoveButton from '../ActionButtons/RemoveButton'
import './style.css'

export default class VisualGridSelectedOptions extends React.Component {
  static propTypes = {
    items: PropTypes.array.isRequired,
    removeOption: PropTypes.func.isRequired,
  }
  render() {
    return (
      <div className="selected-options">
        {this.props.items.map(function(item) {
          const itemName = typeof item === 'string' ? item : item.name
          const itemKey = typeof item === 'string' ? itemName : `${itemName}-${item.type}`
          return (
            <div className="option" key={itemKey}>
              <div className="option-text">{itemName}</div>
              <RemoveButton onClick={this.props.removeOption.bind(this, item)} />
            </div>
          )
        }, this)}
      </div>
    )
  }
}
