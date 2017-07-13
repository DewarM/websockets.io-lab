import React from 'react'
import io from 'socket.io-client';

class PaintingComponent extends React.Component {

  constructor(props) {
    super(props)
    this.state ={
      penDown: false,
      context: null,
      canvas: null,
    }

    this.socket = io();
    this.socket.on(this.props.socketMessage, this.loadImage.bind(this));
    this.socket.on('clear', this.resetCanvas.bind(this));
  }


  loadImage(painting) {
    const img = document.createElement("img");
    img.onload = () => {
      const ctx = this.state.context;
      ctx.drawImage(img,0,0);
    };
    img.src = painting;
  }


componentDidMount(){
  const canvas = this.refs.canvas;
  const ctx = canvas.getContext('2d');
  this.setState({
    context: ctx,
    canvas: canvas
  }, () => {
    this.setupCanvas();
  });
}

draw(x,y){
  const ctx = this.state.context;
  const canvas = this.state.canvas;
  ctx.beginPath();
  ctx.arc(x,y,5,0,2*Math.PI);
  ctx.fill();
  ctx.stroke();
  this.updateCanvas(ctx, canvas);

}

updateCanvas(ctx, canvas){
  this.setState({
    ctx: ctx,
    canvas: canvas
  }, () => {
    this.socket.emit(this.props.socketMessage, this.state.canvas.toDataURL());
  })
}

setupCanvas(){
  const canvas = this.state.canvas;
  const ctx = this.state.context;
  this.setState({originalCanvas: canvas.toDataURL()});
  canvas.addEventListener('mousemove', function(event){
    if (!this.state.penDown) return;
    this.draw(event.layerX, event.layerY)

  }.bind(this))
  canvas.addEventListener('mousedown', function(){
    this.setState({penDown: true})
  }.bind(this))
  canvas.addEventListener('mouseup', function(){
    this.setState({penDown: false})
  }.bind(this))
}

resetCanvas() {
  console.log("reset");
  const canvas = this.state.canvas;
  const ctx = this.state.context;

  ctx.clearRect(0,0,canvas.width,canvas.height);
  this.socket.emit('clear');
}

render() {
  return(
    <div>
    <canvas ref="canvas" id="canvas" width={500} height={500}/>
    <button id="button" width={50} height={50} onClick={this.resetCanvas.bind(this)}>Reset</button>

    </div>
    )
}

}

export default PaintingComponent
