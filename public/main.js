(function() {

    var socket = io();
    var canvas = document.getElementsByClassName('whiteboard')[0];
    var colors = document.getElementsByClassName('color');
    var context = canvas.getContext('2d');
  var slider = document.getElementById("myRange");
    var current = {
      color: 'black',
      size: 2
    };
  slider.oninput = function () {
    console.log(this.value);
  current.size = this.value;
}
    var drawing = false;

    canvas.addEventListener('mousedown', onMouseDown, false);
    canvas.addEventListener('mouseup', onMouseUp, false);
    canvas.addEventListener('mouseout', onMouseUp, false);
    canvas.addEventListener('mousemove', throttle(onMouseMove, 10), false);

    //Touch support for mobile devices
    canvas.addEventListener('touchstart', onMouseDown, false);
    canvas.addEventListener('touchend', onMouseUp, false);
    canvas.addEventListener('touchcancel', onMouseUp, false);
    canvas.addEventListener('touchmove', throttle(onMouseMove, 10), false);

    for (var i = 0; i < colors.length; i++){
      colors[i].addEventListener('click', onColorUpdate, false);
    }

    socket.on('drawing', onDrawingEvent);

    window.addEventListener('resize', onResize, false);
    onResize();


    function drawLine(x0, y0, x1, y1, color, emit){
      context.beginPath();
      context.moveTo(x0, y0);
      context.lineTo(x1, y1);
      context.strokeStyle = color;
      context.lineWidth = current.size;
      context.stroke();
      context.closePath();

      if (!emit) { return; }
      var w = canvas.width;
      var h = canvas.height;

      socket.emit('drawing', {
        x0: x0 / w,
        y0: y0 / h,
        x1: x1 / w,
        y1: y1 / h,
        color: color
      });
    }

    function onMouseDown(e){
      drawing = true;
      current.x = e.clientX||e.touches[0].clientX;
      current.y = e.clientY||e.touches[0].clientY;
    }

    function onMouseUp(e){
      if (!drawing) { return; }
      drawing = false;
      drawLine(current.x, current.y, e.clientX||e.touches[0].clientX, e.clientY||e.touches[0].clientY, current.color, true);
    }

    function onMouseMove(e){
      if (!drawing) { return; }
      drawLine(current.x, current.y, e.clientX||e.touches[0].clientX, e.clientY||e.touches[0].clientY, current.color, true);
      current.x = e.clientX||e.touches[0].clientX;
      current.y = e.clientY||e.touches[0].clientY;
    }

    function onColorUpdate(e){
      current.color = e.target.className.split(' ')[1];
    }

    // limit the number of events per second
    function throttle(callback, delay) {
      var previousCall = new Date().getTime();
      return function() {
        var time = new Date().getTime();

        if ((time - previousCall) >= delay) {
          previousCall = time;
          callback.apply(null, arguments);
        }
      };
    }

    function onDrawingEvent(data){
      var w = canvas.width;
      var h = canvas.height;
      drawLine(data.x0 * w, data.y0 * h, data.x1 * w, data.y1 * h, data.color);
    }

    // make the canvas fill its parent
    function onResize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

  })();

var socket = io();

  var button1 = document.querySelector("button");


  button1.addEventListener("click", function() {

      document.body.classList.toggle("colored");

  });
  //Emit Events
btn = document.getElementById("send")
message = document.getElementById("message")
handle = document.getElementById("handle")
out = document.getElementById("output");
btn.addEventListener('click', function () {
  socket.emit('chat', {
    message: message.value,
    handle:handle.value
    })
  })

  //Listen for Messages
socket.on('chat', function (data) {
  out.innerHTML += '<p><strong>' + data.handle + ' </strong>' + data.message + '</p>';
})
  //Normal Code
