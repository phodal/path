var pipeData = [
  {
    id: 1,
    title: 'Process',
    items: [
      '提交代码', 'PUSH Hooks', '运行持续集成', '部署到 Dev 环境', 'E2E 测试', '手动测试', '部署到 UAT 环境', '手工测试', '上线申请', '上线'
    ],
    backgroundColor: '#00a300',
    textColor: '#ffffff'
  },
  {
    id: 2,
    title: 'People',
    items: [
      ''
    ],
    backgroundColor: '#ff0097',
    textColor: '#ffffff'
  },
  {
    id: 3,
    title: 'Tooling',
    items: [
      'Git & GitHub', 'Git', 'Jenkins', '', '', '', '', '', '', '', '', ''
    ],
    backgroundColor: '#99b433',
    textColor: '#ffffff'
  },
  {
    id: 4,
    title: 'Artifacts',
    items: [
      'Code', '', 'Build Log', '', '', '', '', '', '', '', '', ''
    ],
    backgroundColor: '#1e7145',
    textColor: '#ffffff'
  }
];

window.pipeData = pipeData;

function updateContainerPipeData(source) {
  var sourceId = source.id;
  var element = document.getElementById(sourceId);
  var newOrders = [];
  for (var i = 0; i < element.childNodes.length; i++) {
    let innerText = element.childNodes[i].innerText;
    newOrders.push([innerText]);
  }
  window.pipeData.filter(item => {
    if (sourceId === generateId(item.id)) {
      item.items = newOrders;
    }
    return item;
  });
  localStorage.setItem('ptop.pipe', JSON.stringify(window.pipeData));
}

function initPipes(ids) {
  dragula(ids, {
    direction: 'horizontal',
    moves: function (el, source, handle, sibling) {
      return true;
    },
  }).on('drag', function (el) {
    el.className = el.className.replace('ex-moved', '');
  }).on('drop', function (el, container, handle) {
    updateContainerPipeData(container);
    updateContainerPipeData(handle);

    el.className += ' ex-moved';
  }).on('over', function (el, container) {
    container.className += ' ex-over';
  }).on('out', function (el, container) {
    container.className = container.className.replace('ex-over', '');
  });
}

function initEditors() {
  var elements = document.querySelectorAll('.editable');
  var editor = new MediumEditor(elements, {
    placeholder: false

  });
}

function generateId(pipeData) {
  return 'pipe_' + pipeData;
}

function changeItemHeight(maxLength) {
  var innerWidth = window.innerWidth;
  // document.getElementById('pipe').style['min-width'] = innerWidth + 'px';
  var itemHeight = ((innerWidth - 100) / maxLength - 20);
  if (itemHeight < 100) {
    itemHeight = 100;
  }

  document.getElementById('pipe').style['min-width'] = 20 + maxLength * (itemHeight + 30) + 'px';
  var itemHeightPx = itemHeight + 'px';
  var containerHeight = itemHeight + 20 + 2 + 'px';

  var containers = document.getElementsByClassName('container');
  for (var i = 0; i < containers.length; i++) {
    containers[i].style["min-width"] = 'calc(' + innerWidth - 100 + ')px';
    containers[i].style["height"] = containerHeight;
  }

  var items = document.getElementsByClassName('editable');
  for (var i = 0; i < items.length; i++) {
    items[i].style["height"] = itemHeightPx;
    items[i].style["width"] = itemHeightPx;
  }
}

function initElements() {
  var ids = [];
  var items = localStorage.getItem('ptop.pipe');
  if (items) {
    pipeData = JSON.parse(items);
  }
  var maxLength = pipeData[0].items.length;
  var elements = '';
  for (var i = 0; i < pipeData.length; i++) {
    var id = generateId(pipeData[i].id);
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

  window.pipeMaxLength = maxLength;
  changeItemHeight(maxLength);

  for (var j = 0; j < pipeData.length; j++) {
    ids.push(document.getElementById(generateId(pipeData[j].id)));
  }
  return ids;
}

function init() {
  var ids = initElements();
  initPipes(ids);
  initEditors();
}

init();
