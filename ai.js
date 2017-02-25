var civclicker = window.frames[0].frameElement.contentWindow;
var civdoc = civclicker.document;

window.setInterval(function aiLoop() {
  var food = civclicker.resourceData.find( function(elem) {
    return (elem.id === 'food');
  });

  if (food.owned < food.limit) {
    clickFood();
  }
}, 1000);

function clickFood(){
  clickResource('foodRow')
}

function clickWood(){
  clickResource('woodRow')
}

function clickStone(){
  clickResource('stoneRow')
}

function clickResource(id) {
  var targetNode = civdoc.getElementById(id).firstChild.firstChild;
  if (targetNode) {
    //--- Simulate a natural mouse-click sequence.
    triggerMouseEvent (targetNode, "mouseover");
    triggerMouseEvent (targetNode, "mousedown");
    triggerMouseEvent (targetNode, "mouseup");
    triggerMouseEvent (targetNode, "click");
  }
}

function triggerMouseEvent (node, eventType) {
    var clickEvent = civdoc.createEvent ('MouseEvents');
    clickEvent.initEvent (eventType, true, true);

    // As mesaured on https://cookie.riimu.net/speed/
    var clicksPerSecond = 5;

    for (var i=0; i < clicksPerSecond; i++){
      node.dispatchEvent (clickEvent);
    }
}
