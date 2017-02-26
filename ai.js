// Mundane details. Like sigdigs
var civclicker;
var civdoc;
window.onload = function(){
  civclicker = window.frames[0].frameElement.contentWindow;
  civdoc = civclicker.document;
}

// This dictionary contains the current resource requirement for the next major upgrade we are
// working towards. This may be further exteneded to take a linked list of objectives and resources.
var resourceTargets = {
  'food': 100
};

var heap = new Heap(function(a, b) {
    return a.score > b.score;
});

window.setInterval(function aiLoop() {
  basicResourceHeuristic();
  populationLimitHeuristic();
  recruitWorker();

  for (var i=0; i<5 && heap.size()>0; i++){
    var action = heap.pop().action;
    action();
  }
}, 1000);

function basicResourceHeuristic(){
  var basicResources = civclicker.resourceData.filter( function(elem) {
    return elem.subType == 'basic';
  });

  for (const resource of basicResources){
    if (resource.limit === 0) {
      var score = 1;
    }
    else {
      var score = (resource.limit - resource.owned) / resource.limit;
    }

    heap.push({
      score:score,
      action: function(){
        clickResource(resource.id)
      }
    });
  }
}

function populationLimitHeuristic() {
  var population = civclicker.population;
  if (population.limit === 0){
    var score = 1;
  }
  else {
    var score = population.current/population.limit;
  }

  heap.push({
    score:score,
    action: function(){
      setCustomQuantity(1);
      clickTent();
    }
  });
}

function recruitWorker(){
  var food = civclicker.resourceData.find( function(elem) {
    return elem.id === 'food';
  });

  var quantity = 2;
  var cost = quantity * 20;

  // Current room for population growth
  var availablePopulationSpace = 1 - civclicker.population.current / civclicker.population.limit;

  if (cost / food.current > 0.1) {
    // This upgrade is too expensive at this time
    var score = 0;
  }
  else if (food.current > resourceTargets['food']){
    // Abundant resources leftover after for upgrade
    // Demand is dictated solely by population growth demand
    var score = availablePopulationSpace;
  }
  else {
    // Still saving resources for next major upgrade. Factor setback cost and population growth.
    var setback = cost / resourceTargets['food'];
    var score = (1 - setback) * availablePopulationSpace;
  }

  heap.push({
    score: score,
    action: function(){
      civdoc.getElementById('spawnCustomQty').value = quantity;
      var targetNode = civdoc.querySelector('#spawnCustomButton');
      triggerMouseEvent(targetNode, "mousedown");
    }
  });
}

function clickTent(){
  clickPurchase('#tentRow');
}

function clickResource(id) {
  var mapping = {
    "food": "#foodRow",
    "wood": "#woodRow",
    "stone": "#stoneRow",
  };

  var targetNode = civdoc.querySelector(mapping[id] + ' button');
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
