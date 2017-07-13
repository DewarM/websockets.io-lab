import React from 'react'
import PaintComponent from '../components/PaintingComponent'


class PaintingContainer extends React.Component {




  render() {
    return(
      <div>
        <PaintComponent socketMessage="paintA" />
        <PaintComponent socketMessage="paintB" />

      </div>
      )
  }

}

export default PaintingContainer