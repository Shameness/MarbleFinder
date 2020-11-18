function newNode(mainType,subType,x,y,isEmpty){
  var node = new Object()
  node.isEmpty = isEmpty;
  node.mainType = mainType
  node.subType = subType
  node.pos = {'x':x, 'y':y}
  return node;
}

var setNode = function(node,mainType,subType){
  node.mainType = mainType
  node.subType = subType
  node.isEmpty = false
}
var resetNode = function(node){
  node.mainType = 0
  node.subType = 0
  node.isEmpty = true
}

function _gridToArray(x,y){
  var mY = y - 5;
  var mX = ((x-5)*2) + (mY%2)
  return [mX,mY]
}

function _arrayToGrid(x,y){
  var mY = y + 5
  var mX = ( ( x - (y%2) )/2 ) + 5
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
    setNode(mGrid[pos[0]][pos[1]], node.mainType,node.subType)
  }

  return mGrid;
}

function newStep(x1,y1, x2,y2){
  var step = new Object();
  step.node1 = {x:x1, y:y1}
  step.node2 = {x:x2, y:y2}
  return step;
}

var stepToString = function(step){
  let n1 = _gridToArray(step.node1.x, step.node1.y)
  let n2 = _gridToArray(step.node2.x, step.node2.y)
  return "Node 1:( "+n1[0]+", " + n1[1]+" ) Node 2:( " +
            n2[0]+", " + n2[1]+") "
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
  for(let i = 0; i < grid.length; i++){
    for(let j = 0; j < grid[i].length; j++){
      let node = grid[i][j];
      if(!node.isEmpty) count++;
    }
  }
  return count

}

//grid
function findOpenNodes(grid){
  var openNodes = [];
  const x_max = 9 // TO DO convert 0 11 y+1 l ust
  const x_min = 1
  const y_max = 9
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
          if(contiguousCount > 2){
            openNodes.push(node)
            break;
          }
        } else {
          contiguousCount = 0;
        }
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
                solution.metalOrder = t1 + t2 + 1;
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

function stringifySolutionSteps(solutions){
  let result = ""
  for(let i = 0; i < solutions.length; i++){
    let solution = solutions[i]
    result += "==========\n" +
             "Solution "+ i + ":\n" +
             "==========\n"
    for(let j = 0; j < solution.steps.length; j++){
      result+= "Step "+ j + "\n" +
      stepToString(solution.steps[j]) +
      "\n"
    }
    result += "==========\n" +
              "\n"
  }
  return result
}

//Java Hash implementation
const getHash = (string) => {
  let hash = 0;
  for (let i = 0; i < string.length; i++) {
      let char = string.charCodeAt(i);
      hash = ((hash<<5)-hash)+char;
      hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
}

//sort functions
const sortByX = (a, b) => {
  return a.x - b.x;
}
const sortByY = (a, b) => {
  return a.y - b.y;
}

function main(input){
  let successfulSolutions = []
  let solutionQueue = []
  let solutionsHashTable =new Set()
  let grid = newGrid(input)

  let solutionLen = findNodeCount(grid)
  let openNodes = findOpenNodes(grid)

  solutionQueue.push( newSolution(openNodes, grid))

  while(solutionQueue.length > 0){
    var currentSolution = solutionQueue.pop()
    var possibleSteps = compareNodes(currentSolution)
    //console.log(possibleSteps)
    if( possibleSteps.length == 0 ){
      if ( currentSolution.steps.length * 2 == solutionLen ){
        successfulSolutions.push(currentSolution)
      } else {
        continue;
      }
    } else {
      for(let i = 0; i < possibleSteps.length; i++){
        let step = possibleSteps[i]
        let newSolution = {}
        newSolution = JSON.parse(JSON.stringify(currentSolution));//easy deep copy
        newSolution.steps.push( step )
        //TODO
        resetNode(newSolution.grid[step.node1.x][step.node1.y])
        resetNode(newSolution.grid[step.node2.x][step.node2.y])
        newSolution.openNodes = findOpenNodes(newSolution.grid)
        console.log( newSolution.openNodes);
        hashToCompare = getHash(JSON.stringify(newSolution.openNodes))
        //console.log(hashToCompare)
        if (solutionsHashTable.has(hashToCompare) && hashToCompare !=2914){
          continue;
        }
        solutionsHashTable.add(hashToCompare)
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
        parseInt(selectedMainType),
        parseInt(selectedSubType),
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
// TODO:  Fix maintype shown as string, int expected
