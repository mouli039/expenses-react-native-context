import React, { Component } from 'react'
import MainPage from './src/components/MainPage'
import WheatherAPI from './src/components/WheatherAPI'

export class App extends Component {
  render() {
    return (
      // <MainPage/>
      <WheatherAPI/>
    )
  }
}

export default App