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
      'Git & GitHub', 'Git', 'Jenkins', '', '', '', '', ''
    ],
    backgroundColor: '#99b433',
    textColor: '#ffffff'
  },
  {
    id: 4,
    title: 'Artifacts',
    items: [
      'Code', '', 'Build Log', '', '', '', '', '', '', ''
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

function updateItemData(pipeIndex, itemIndex, value) {
  window.pipeData[pipeIndex].items[itemIndex] = value;
  localStorage.setItem('ptop.pipe', JSON.stringify(window.pipeData));
}

function initPipes(ids) {
  dragula(ids, {
    direction: 'horizontal',
    moves: function (el, source, handle, sibling) {
      return true;
    },
    accepts: function (el, target, source, sibling) {
      if (target.id && source.id) {
        console.log(source.id, source.id);

      }
      return source.id === target.id;
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

function initEditor(elementId) {
  var elements = document.getElementById(elementId);
  var editor = new MediumEditor(elements, {
    placeholder: false
  });
  editor.subscribe('editableInput', function (event, editable) {
    var itemInfo = editable.id.split('_');
    var pipeIndex = parseInt(itemInfo[1]) - 1;
    var itemIndex = parseInt(itemInfo[3]);
    updateItemData(pipeIndex, itemIndex, editable.textContent);
    if (editable.textContent) {
      editable.classList.remove('empty');
    } else {
      editable.classList.add('empty');
    }
  });
}

function bindElementsEvent() {
  for (var i = 0; i < pipeData.length; i++) {
    var id = generateId(pipeData[i].id);
    var itemLength = pipeData[i].items.length;
    for (var k = 0; k < itemLength; k++) {
      var childItemId = id + '_child' + '_' + k;
      document.getElementById(childItemId).addEventListener('click', function (event) {
        initEditor(event.target.id);
      })
    }
  }
}

function generateId(pipeData) {
  return 'pipe_' + pipeData;
}

function changeItemHeight(maxLength) {
  var innerWidth = window.innerWidth;
  var itemWidth = ((innerWidth - 200) / maxLength - 20);
  if (itemWidth < 100) {
    itemWidth = 100;
  }

  var itemHeightPx = itemWidth + 'px';
  var containerHeight = itemWidth + 20 + 2 + 'px';

  var containers = document.getElementsByClassName('container');
  for (var i = 0; i < containers.length; i++) {
    containers[i].style["min-width"] = maxLength * (itemWidth + 21) + 'px';
    containers[i].style["height"] = containerHeight;
  }

  var items = document.getElementsByClassName('editable');
  for (var j = 0; j < items.length; j++) {
    items[j].style["height"] = itemHeightPx;
    items[j].style["width"] = itemHeightPx;
  }

  var headers = document.getElementsByClassName('pipe-header');
  for (var k = 0; k < headers.length; k++) {
    headers[k].style["height"] = itemWidth + 20 + 12 + 'px';
  }
}

function fillArrayWithEmpty(items) {
  for (var i = 0; i < items.length; i++) {
    var itemLength = items[i].items.length;
    for (var j = 0; j <= window.pipeMaxLength; j++) {
      if (j > itemLength) {
        items[i].items[j - 1] = '';
      }
    }
  }

  return items;
}

function fillArray(items) {
  var maxLength = items[0].items.length;
  for (var i = 0; i < items.length; i++) {
    var itemLength = pipeData[i].items.length;
    if (itemLength > maxLength) {
      maxLength = itemLength;
    }
  }
  window.pipeMaxLength = maxLength;
  items = fillArrayWithEmpty(items);

  return items;
}

function setEmptyClass(title) {
  if (!title) {
    return 'empty'
  }
}

function onAddItem() {
  console.log("saf");
  window.pipeMaxLength++;
  console.log(window.pipeData, window.pipeData);
  window.pipeData = fillArrayWithEmpty(window.pipeData);
  console.log(window.pipeData, window.pipeData);
  localStorage.setItem('ptop.pipe', JSON.stringify(window.pipeData));
  window.location.reload(false);
}

function initElements() {
  var ids = [];
  var items = localStorage.getItem('ptop.pipe');
  if (items) {
    pipeData = JSON.parse(items);
  }
  var elements = '';
  var headers = '';

  window.pipeData = pipeData = fillArray(pipeData);

  for (var i = 0; i < pipeData.length; i++) {
    var id = generateId(pipeData[i].id);
    var childItemId = id + '_child';
    var currentHtml = `<div id='${id}' class='container' style='background:${pipeData[i].backgroundColor};color:${pipeData[i].textColor}'>`;
    headers = headers + `<div class='pipe-header' id='${id}_header'><h2>${pipeData[i].title}</h2></div>`;

    var itemLength = pipeData[i].items.length;
    for (var k = 0; k < itemLength; k++) {
      childItemId = id + '_child' + '_' + k;
      currentHtml = `${currentHtml}<div class="editable ${setEmptyClass(pipeData[i].items[k])}" id="${childItemId}">${pipeData[i].items[k]}</div>`;
    }
    currentHtml = currentHtml + '</div>';
    elements = elements + currentHtml;
  }

  document.getElementById('pipe').innerHTML = elements;
  document.getElementById('pipe-header').innerHTML = headers;

  changeItemHeight(window.pipeMaxLength);

  for (var j = 0; j < pipeData.length; j++) {
    ids.push(document.getElementById(generateId(pipeData[j].id)));
  }
  return ids;
}

function init() {
  var ids = initElements();
  initPipes(ids);
  bindElementsEvent();

  window.onresize = function () {
    changeItemHeight(window.pipeMaxLength);
  }
}

init();
