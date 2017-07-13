import React from 'react'

class PaintingComponent extends React.Component {

  constructor(props) {
    super(props)
    this.state ={
      penDown: false,
      context: null
    }
  }

  componentDidMount(){
    const canvas = this.refs.canvas;
    const ctx = canvas.getContext('2d');
    this.setState({
      context: ctx,
      canvas: canvas
    }, () => {
      this.updateCanvas();
    });
  }

  draw(x,y){
    const ctx = this.state.context;
    ctx.beginPath();
    ctx.arc(x,y,10,0,2*Math.PI);
    ctx.fill();
    ctx.stroke();
  }

  updateCanvas(){
    const canvas = this.state.canvas;
    const ctx = this.state.context;
    ctx.fillRect(0, 0, 100, 100);
    canvas.addEventListener('mousemove', function(event){
      console.log('whatever')
      if (!this.state.penDown) return;
      console.log(event);
      this.draw(event.layerX, event.layerY)

    }.bind(this))
    canvas.addEventListener('mousedown', function(){
      this.setState({penDown: true})
    }.bind(this))
    canvas.addEventListener('mouseup', function(){
      this.setState({penDown: false})
    }.bind(this))
  }


  render() {
    return(
      <div>
         <canvas ref="canvas" id="canvas" width={500} height={500}/>

      </div>
      )
  }

}

export default PaintingComponent