function initPipes() {
  dragula([
    document.getElementById('zone1'),
    document.getElementById('zone2'),
    document.getElementById('zone3')
  ], {
    direction: 'horizontal',
    moves: function (el, source, handle, sibling) {
      return true;
    },
  }).on('drag', function (el) {
    el.className = el.className.replace('ex-moved', '');
  }).on('drop', function (el) {
    el.className += ' ex-moved';
  }).on('over', function (el, container) {
    container.className += ' ex-over';
  }).on('out', function (el, container) {
    container.className = container.className.replace('ex-over', '');
  });
}

function initEditors() {
  var elements = document.querySelectorAll('.editable');
  var editor = new MediumEditor(elements);
}

function init() {
  initPipes();
  initEditors();
}

init();
