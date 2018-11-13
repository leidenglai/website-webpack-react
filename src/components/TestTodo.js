import React, { Component } from 'react'
import { Button, Switch } from 'antd'
import { observer, inject } from 'mobx-react'

@inject('testStore')
@observer
class TestTodo extends Component {
  constructor(props) {
    super()

    console.log(props)
  }

  handleClick = () => {
    const { testStore } = this.props

    testStore.changeSelect()
  }

  render() {
    const { testStore } = this.props

    return (
      <div className="container-wrapper">
        <h2>{testStore.test.attr}, Test Success!!!!</h2>
        <Switch checked={testStore.select} />
        <Button onClick={this.handleClick}>Click</Button>
      </div>
    )
  }
}
export default TestTodo
