import React from 'react'
import io from 'socket.io-client';

class PaintingComponent extends React.Component {

  constructor(props) {
    super(props)
    this.state ={
      id: null,
      penDown: false,
      context: null,
      canvas: null,
      currentlyDrawing: []
    }

    this.loadImage = this.loadImage.bind(this);
    this.resetCanvas = this.resetCanvas.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleConnection = this.handleConnection.bind(this);
    this.handleOnDrawing = this.handleOnDrawing.bind(this);
    this.handleStopDrawing = this.handleStopDrawing.bind(this);

    this.socket = io();
    this.socket.on(this.props.socketMessage, this.loadImage);
    this.socket.on('clear', this.resetCanvas);
    this.socket.on('success', this.handleConnection);
    this.socket.on('drawing', this.handleOnDrawing);
    this.socket.on('stopDrawing', this.handleStopDrawing);
  }

  handleOnDrawing(id){
    const drawers = this.state.currentlyDrawing;
    this.setState({currentlyDrawing: [id, ...drawers]});
  }

  handleStopDrawing(id){
    const drawers = this.state.currentlyDrawing.filter((members) => {
      return members != id;
    });
    this.setState({currentlyDrawing: drawers});
  }

  handleConnection(id){
    this.setState({id: id});
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

handleMouseMove(){
  if (!this.state.penDown) return;
  this.draw(event.layerX, event.layerY)
}

handleMouseDown(){
  this.setState({penDown: true});
  this.socket.emit('drawing', this.state.id);
}

handleMouseUp(){
  this.setState({penDown: false});
  this.socket.emit('stopDrawing', this.state.id);
}

setupCanvas(){
  const canvas = this.state.canvas;
  const ctx = this.state.context;
  canvas.addEventListener('mousemove', this.handleMouseMove);
  canvas.addEventListener('mousedown', this.handleMouseDown);
  canvas.addEventListener('mouseup', this.handleMouseUp);
}

resetCanvas() {
  const canvas = this.state.canvas;
  const ctx = this.state.context;
  ctx.clearRect(0,0,canvas.width,canvas.height);
  this.socket.emit('clear');
}

render() {
  return(
    <div>
    <canvas ref="canvas" id="canvas" width={500} height={500}/>
    <button id="button" width={50} height={50} onClick={this.resetCanvas}>Reset</button>

    </div>
    )
}

}

export default PaintingComponent
