function newNode(mainType,subType,x,y,isEmpty){
  var node = new Object()
  node.isEmpty = isEmpty;
  node.mainType = mainType
  node.subType = subType
  node.pos = {'x':x, 'y':y}
  node.set = function(mainType,subType){
    node.mainType = mainType
    node.subType = subType
    node.isEmpty = false
  }
  node.reset = function(){
    node.mainType = 0
    node.subType = 0
    node.isEmpty = true
  }
  return node;
}

function _gridToArray(x,y){
  var mY = y - 5;
  var mX = ((x-5)*2) + (y%2)
  return [mX,mY]
}

function _arrayToGrid(x,y){
  var mY = y + 5
  var mX = ( ( x - (mY%2) )/2 ) + 5
  return [mX,mY]
}

function newGrid(input){
  var mGrid = [[],[]];
  for(let x = 0;x<11;x++){
    mGrid[x] = []
    for(let y = 0; y<11;y++){
      let pos = _gridToArray(x,y)
      mGrid[x][y] = newNode(0,0,pos[0],pos[1],true)
    }
  }
  for(let i = 0; i < input.length; i++){
    let node = input[i]
    let pos = _arrayToGrid(node.pos.x,node.pos.y)
    mGrid[pos[0]][pos[1]].set(node.mainType,node.subType)
  }


  return mGrid;
}

function newStep(x1,y1, x2,y2){
  var step = new Object();
  step.node1 = {x:x1, y:y1}
  step.node2 = {x:x2, y:y2}
  return step;
}

function newSolution(openNodes, grid){
  var solution = new Object();
  solution.grid = grid
  solution.steps = []
  solution.openNodes = JSON.parse(JSON.stringify(openNodes));
  solution.possibleNodes = []
  solution.metalOrder = 1
  return solution;
}

function findNodeCount(grid){
  var count = 0;
  for(var node in grid){
    if(!node.isEmpty) count++;
  }
  return count

}

//grid
function findOpenNodes(grid){
  var openNodes = [];
  const x_max = 10 // TO DO convert 0 11 y+1 l ust
  const x_min = 1
  const y_max = 10
  const y_min = 1
  for(let i = 0;i<11;i++){
    for(let j = 0;j < 11; j++){
      var node = grid[i][j]
      if(node.isEmpty){
        continue;
      }
      let x = i, y = j;
      let g = {x:x-(y%2)}

      var adjents = [
       (x > x_max || grid[x+1][y].isEmpty),
       (x > x_max || y < y_min || grid[g.x+1][y-1].isEmpty),
       (x < x_min || y < y_min || grid[g.x][y-1].isEmpty),
       (x < x_min || grid[x-1][y].isEmpty),
       (x < x_min || y > y_max || grid[g.x][y+1].isEmpty),
       (x > x_max || y > y_max || grid[g.x+1][y+1].isEmpty)
      ]
      adjents.push(adjents[0])
      adjents.push(adjents[1])
      let contiguousCount = 0;
      for(let n = 0; n < adjents.length; n++){
        let bool = adjents[n]
        if(bool){
          contiguousCount++;
        } else {
          contiguousCount = 0;
        }
      }
      if(contiguousCount > 2){
        openNodes.push(node)
      }
    }
  }
  return openNodes;
}

function compareNodes(solution){
  var openNodes = solution.openNodes
  var metalOrder = solution.metalOrder
  var possibleSteps = []
  let length = openNodes.length
  for(var i = 0; i < length; i++){
    for(var j = i+1; j < length; j++){
      if(openNodes[i].mainType == openNodes[j].mainType){
        let t1 = openNodes[i].subType
        let t2 = openNodes[j].subType
        let l = _arrayToGrid(openNodes[i].pos.x, openNodes[i].pos.y)
        let m = _arrayToGrid(openNodes[j].pos.x, openNodes[j].pos.y)
        let x1 = l[0] ,y1 = l[1]
        let x2 = m[0], y2 = m[1]
        switch (openNodes[i].mainType) {
          case 0:
            if(t1 == 0 || t1 == t2 || t2 == 0){
              possibleSteps.push(newStep(x1,y1, x2,y2))
            }
            break;

          case 1:
            if( t1 + t2 == t1 || t1 + t2 == t2 ){
              if(t1 == metalOrder || t2 == metalOrder){
                possibleSteps.push(newStep(x1,y1, x2,y2));
                solution.metalOrder += 1;
              }

            }
            break;

          case 2:
            if(t1 + t2 == 1){
              possibleSteps.push(newStep(x1,y1, x2,y2));
            }
            break;
        }
      }
      //end of 2nd for loop's body
    }
  }
  return possibleSteps;
}

function main(input){
  var successfulSolutions = []
  var solutionQueue = []
  let grid = newGrid(input)

  var solutionLen = findNodeCount(grid)
  var openNodes = findOpenNodes(grid)

  solutionQueue.push( newSolution(openNodes, grid))

  while(solutionQueue.length > 0){
    var currentSolution = solutionQueue.pop()
    var possibleSteps = compareNodes(currentSolution)
    if( possibleSteps.length == 0 ){
      if ( currentSolution.steps.length * 2 == solutionLen ){
        successfulSolutions.push(currentSolution)
      } else {
        continue;
      }
    } else {
      for(let i = 0; i < possibleSteps.length; i++){
        let step = possibleSteps[i]
        let solution = JSON.parse( JSON.stringify(currentSolution) );
        solution.steps.push( step )
        //TODO
        solution.grid[step.node1.x][step.node1.y].reset()
        solution.grid[step.node2.x][step.node2.y].reset()
        solution.openNodes = findOpenNodes(solution.grid)
        solutionQueue.unshift( newSolution )
      }
    }
  }
  return successfulSolutions
}
// Element Panel
var elementList = {
  0:{0:"whitey",1:"one",2:"two",3:"three",4:"four"},
  1:{0:"whitey",1:"mOne",2:"mTwo",3:"mThree",4:"mFour",5:"mFive",6:"gold"},
  2:{0:"rBlack",1:"rPink"}
}

var elementSelector = document.getElementById("elementSelector")
var elements = document.getElementsByClassName("element")
var selectedMainType = 0;
var selectedSubType  = 0;
var selectedElement = elementList[0][0];
var selectedNode = document.getElementsByClassName("mainTypePanel")
                [selectedMainType].childNodes[selectedSubType]
document.getElementsByClassName("element")[0].classList.add("selected")

var input = []

elementSelector.addEventListener('click', function(e){
    //catch selected element
    var t = e.target;
    if(t.nodeName != "SPAN") return;
    //only high light selected element
    for(var i = 0; i < elements.length; i++){
      elements[i].classList.remove("selected");
    }
    t.classList.add("selected")
    selectedMainType = t.getAttribute("mainType")
    selectedSubType = t.getAttribute("subType")
    //selectedColor = t.style.backgroundColor
    selectedElement = elementList[selectedMainType][selectedSubType]
    selectedNode = t

},false)

// Hex Grid
var hexMap = document.getElementById("hexMap")

hexMap.addEventListener('click', function(e) {
  var t = e.target;
  if (t.nodeName == 'polygon'){
    //console.log(t.parentNode.parentNode.getAttribute("hex_x") + " " + t.parentNode.parentNode.getAttribute("hex_y"));
    var remaining = parseInt(selectedNode.innerText)
    if (remaining == 0) alert("careful bro")
    var mCircle = t.parentNode.nextElementSibling
    mCircle.setAttribute("transform","translate(0,0)")
    mCircle.setAttribute("class", selectedElement)
    selectedNode.innerText = remaining - 1
    input.push(
      newNode(
        selectedMainType, selectedSubType,
        parseInt(t.parentNode.parentNode.getAttribute("hex_x")),
        parseInt(t.parentNode.parentNode.getAttribute("hex_y")),
        false
      )
    )
  };
  if(t.nodeName == 'use'){
    t.parentNode.setAttribute("transform","translate(2000,0)")
  }


}, false);
