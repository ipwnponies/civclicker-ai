var civclicker;
var civdoc;

window.onload = function(){
  civclicker = window.frames[0].frameElement.contentWindow;
  civdoc = civclicker.document;
}

window.setInterval(function aiLoop() {
  var food = civclicker.resourceData.find( function(elem) {
    return (elem.id === 'food');
  });

  if (food.owned < food.limit) {
    clickFood();
  }

  var population = civclicker.population;
  if (population.limit === 0 || population.current/population.limit < 0.9) {
    setCustomQuantity(1);
    clickTent();
  }

}, 1000);

function clickFood(){
  clickResource('#foodRow');
}

function clickWood(){
  clickResource('#woodRow');
}

function clickStone(){
  clickResource('#stoneRow');
}

function clickTent(){
  clickPurchase('#tentRow');
}

function clickResource(id) {
  var targetNode = civdoc.querySelector(id + ' button');
  if (targetNode) {
    //--- Simulate a natural mouse-click sequence.
    triggerMouseEvent (targetNode, "mousedown");
  }
}

function triggerMouseEvent (node, eventType) {
    var clickEvent = civdoc.createEvent ('MouseEvents');
    clickEvent.initEvent (eventType, true, true);

    // As measured on https://cookie.riimu.net/speed/
    // Conservatively throttled to 3
    var clicksPerSecond = 3;

    for (var i=0; i < clicksPerSecond; i++){
      node.dispatchEvent (clickEvent);
    }
}

function setCustomQuantity(quantity){
  civdoc.getElementById('buildingCustomQty').value = quantity;
}

function clickPurchase(id) {
  var targetNode = civdoc.querySelector(id + ' .buycustom button');
  if (targetNode) {
    triggerMouseEvent(targetNode, "mousedown");
  }
}
