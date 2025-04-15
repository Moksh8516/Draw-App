interface Shapes{
  x:number,
  y:number,
  width:number,
  height:number,
  type: "rect"
}

export function initDraw(canvas:HTMLCanvasElement, ctx:CanvasRenderingContext2D, socket:WebSocket|null){
  let scrollX = 0;
  let scrollY = 0;
  let clicked = false;
  const existingShapes :Shapes[] = [];
  canvas.addEventListener("mousedown", (e) => {
    clicked = true;
    scrollX = e.clientX;
    scrollY = e.clientY;
  });

  canvas.addEventListener("mouseup", (e) => {
    clicked = false;
    let shape : Shapes ={
      width: e.clientX-scrollX,
      height: e.clientY-scrollY,
      x:scrollX,
      y:scrollY,
      type:"rect"
    }
    existingShapes.push(shape);

  });

  canvas.addEventListener("mousemove", (e) => {
    if (clicked) {
      const width = e.clientX - scrollX;
      const height = e.clientY - scrollY;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#09090b";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = "#fff";
      ctx.strokeRect(scrollX, scrollY, width, height);
    }
  });
}