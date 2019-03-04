
// Element Panel
var elementList = {
  0:{0:"whitey",1:"one",2:"two",3:"three",4:"four"},
  1:{0:"whitey",1:"mOne",2:"mTwo",3:"mThree",4:"mFour",5:"mFive",6:"gold"},
  2:{0:"rBlack",1:"rPink"}
}

var elementSelector = document.getElementById("elementSelector")
var elements = document.getElementsByClassName("element")
var selectedMainType = -1;
var selectedSubType  = -1;
var selectedElement = null;
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
},false)

// Hex Grid
var hexMap = document.getElementById("hexMap")

hexMap.addEventListener('click', function(e) {
  var t = e.target;
  if (t.nodeName == 'polygon'){
    console.log(t.parentNode.parentNode.getAttribute("hex_x") + " " + t.parentNode.parentNode.getAttribute("hex_y"));
    var mCircle = t.parentNode.nextElementSibling
    mCircle.setAttribute("transform","translate(0,0)")
    mCircle.setAttribute("class", selectedElement)
  };
  if(t.nodeName == 'use'){
    t.parentNode.setAttribute("transform","translate(2000,0)")
  }


}, false);
