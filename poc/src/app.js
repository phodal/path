dragula([document.getElementById('left-events'), document.getElementById('right-events')])
  .on('drag', function (el) {
    el.className = el.className.replace('ex-moved', '');
  }).on('drop', function (el) {
  el.className += ' ex-moved';
}).on('over', function (el, container) {
  container.className += ' ex-over';
}).on('out', function (el, container) {
  container.className = container.className.replace('ex-over', '');
});
