import React from 'react'
import PaintComponent from '../components/PaintingComponent'


class PaintingContainer extends React.Component {




  render() {
    return(
      <div>
        <PaintComponent socketMessage="paint" />
      </div>
      )
  }

}

export default PaintingContainer
