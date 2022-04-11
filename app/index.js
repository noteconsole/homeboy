function getColor() {
  var colors = ['#9fc2b2','#a90636','#8c6510','#96bfe6','#9e194d','#baa600','#f5f5b8','#ffb852','#328e13'];
  for (var i = 0; i < 9; i++) {
    var color = colors[Math.floor(Math.random() * 9)];
  }
  return color;
}

function setColor() {
  document.documentElement.style.setProperty('--backgroundColor', getColor());
}

setColor();

document.body.addEventListener('mouseover', function (evt) {
if (evt.target.tagName === 'A') {
    setColor();
}
}, false);