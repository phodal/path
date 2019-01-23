function initPipes(ids) {
  dragula(ids, {
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

function generateId(pipeData) {
  return pipeData.toLocaleLowerCase();
}

function changeItemHeight(maxLength) {
  var items = document.getElementsByClassName('editable');

  for (var i = 0, len = items.length; i < len; i++) {
    items[i].style["height"] = '150px';
    items[i].style["width"] = '' + 100 / maxLength + '%';
  }
}

function initElements() {
  var ids = [];
  var pipeData = [
    {
      id: 1,
      title: 'Process',
      items: [
        '提交代码', 'PUSH Hooks', '运动持续集成', '部署到 Dev 环境', 'E2E 测试', '手动测试', '部署到 UAT 环境', '手工测试', '上线申请', '上线'
      ],
      backgroundColor: '#99b433',
      textColor: '#ffffff'
    },
    {
      id: 2,
      title: 'Tools',
      items: [
        'Git & GitHub', 'Git', 'Jenkins', '', '', '', '', '', '', '', '', ''
      ],
      backgroundColor: '#00a300',
      textColor: '#ffffff'
    }
  ];

  var maxLength = pipeData[0].items.length;
  var elements = '';
  for (var i = 0; i < pipeData.length; i++) {
    var id = generateId(pipeData[i].title);
    var childItemId = id + '_child';
    var currentHtml = `<div id='${id}' class='container' style='background:${pipeData[i].backgroundColor};color:${pipeData[i].textColor}'>`;

    var itemLength = pipeData[i].items.length;
    for (var k = 0; k < itemLength; k++) {
      currentHtml = currentHtml + '<div class="editable" id="' + childItemId + '">' + pipeData[i].items[k] + '</div>';
    }
    currentHtml = currentHtml + '</div>';
    elements = elements + currentHtml;

    if (itemLength > maxLength) {
      maxLength = itemLength;
    }
  }

  document.getElementById('pipe').innerHTML = elements;

  changeItemHeight(maxLength);

  for (var j = 0; j < pipeData.length; j++) {
    ids.push(document.getElementById(generateId(pipeData[j].title)));
  }
  return ids;
}

function init() {
  var ids = initElements();
  initPipes(ids);
  initEditors();
}

init();
