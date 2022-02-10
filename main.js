$(document).ready(function () {

$.ajaxSetup({
  async: false
});
var killers, perks, survivors = null;
$.getJSON("https://jignaciodegiovanni.github.io/DBD-Lookup-ALPHA/json/perks.json", function(json) {
  perks = json;
});

$.getJSON("https://jignaciodegiovanni.github.io/DBD-Lookup-ALPHA/json/characters.json", function(json) {
  characters = json;
});

let lastSurv = perks.Ace_In_The_Hole;
let lastKiller = perks.NurseCalling;

let doubleBubble = function(arr, arr2) {
  var len = arr.length;

  for (var i = 0; i < len; i++) {
    for (var j = 0; j < len - i - 1; j++) { // this was missing
      if (arr[j] > arr[j + 1]) {
        // swap
        var temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;

        var temp2 = arr2[j];
        arr2[j] = arr2[j + 1];
        arr2[j + 1] = temp2;
      }
    }
  }
  return [arr, arr2];
}



let getRecommended = function(perk){
  let recommendedP = [];
  let recommendedStars = [];
  for(let i = 0; i < perk.categories.length; i++){
    category = perk.categories[i];
    Object.keys(perks).forEach(k => {
      if(perks[k].categories != null){
        if(document.getElementById("minOrExact").value == 1){
          if(perks[k].categories.indexOf(category) >= 0 && perks[k].stars >= document.getElementById("starsOfPerks").value && perks[k].modifier != perk.modifier){
            recommendedP.push(perks[k]);
            recommendedStars.push(perks[k].stars)
          }
        }
        else{
          if(perks[k].categories.indexOf(category) >= 0 && perks[k].stars == document.getElementById("starsOfPerks").value && perks[k].modifier != perk.modifier){
            recommendedP.push(perks[k]);
            recommendedStars.push(perks[k].stars)
          }
        }
      }
    })
  }
  recommendedP = doubleBubble(recommendedStars, recommendedP)[1].reverse();
  recommendedP = recommendedP.slice(0, 5);
  let recommended = [];
  for(let i = 0; i < recommendedP.length; i++){
    let p = document.createElement("img");
    p.src = "https://jignaciodegiovanni.github.io/DBD-Lookup-ALPHA/" + recommendedP[i].image;
    p.id = recommendedP[i].name;
    p.width = 64;
    p.height = 64;
    p.classList.add("recommendedPerk");

    p.addEventListener('click', function() {
      document.getElementById('searchPerk').value = p.id;
      searchPerk();
    })
    recommended.push(p);
  }
  if(recommended.length == 0){
    let p = document.createElement("img");
    p.width = 64;
    p.height = 64;
    recommended.push(p);
  }
  return recommended;
}

let clickPerk = function(perk){
  for (let i = 0; i < document.getElementsByClassName("clickedPerk").length; i++) {
    if(document.getElementsByClassName("clickedPerk")[i].id != perk.name){
      document.getElementsByClassName("clickedPerk")[i].classList.remove("clickedPerk");
    }
  }
  document.getElementById('name').textContent = perk.name;
  cleanText = perk.description.replace(/<\/?[^>]+(>|$)/g, "");
  cleanText = cleanText.replaceAll(',', ', ');
  cleanText = cleanText.replaceAll('.', '. ');
  for (let i = 0; i < perk.tunables.length; i++) {
    cleanText = cleanText.replace(`{${i}}`, perk.tunables[i][perk.tunables[i].length - 1]);
  }
  document.getElementById('description').innerText = cleanText;
  for (let i = 1; i < 6; i++) {
    if (i <= parseInt(perk.stars)) {
      document.getElementById(`star${i}`).style.display = "";
    } else {
      document.getElementById(`star${i}`).style.display = "none";
    }
  }

  let portrait = document.getElementById("portrait");


  if(characters[perk.character] != null){
    document.getElementById("portraitName").innerText = characters[perk.character].name;
    portrait.src = "https://jignaciodegiovanni.github.io/DBD-Lookup-ALPHA/UI/Icons/CharPortraits/" + characters[perk.character].image;
  }
  else{
    document.getElementById("portraitName").innerText = `Basic ${perk.role} perk`;
    portrait.src = "https://jignaciodegiovanni.github.io/DBD-Lookup-ALPHA/css/pentagram.png";
  }

  portrait.width = 256;
  portrait.height = 256;
  portrait.border = "5px solid;";


  let recommendedPerks = document.getElementById("recommendedPerks");
  child = recommendedPerks.lastElementChild;
  while (child) {
    recommendedPerks.removeChild(child);
    child = recommendedPerks.lastElementChild;
  }
  let recommended = getRecommended(perk);

  for(let i = 0; i < recommended.length; i++){
    recommendedPerks.appendChild(recommended[i]);
  }

  if(perk.role == "survivor"){lastSurv = perk;}
  else if(perk.role == "killer"){lastKiller = perk;}
}

let getPerkImg = function(perk){
  let img = document.createElement("img");
  img.src = "https://jignaciodegiovanni.github.io/DBD-Lookup-ALPHA/" + perk.image;
  img.id = perk.name;
  img.width = 128;
  img.height = 128;
  img.classList.add("perk");

  img.addEventListener('click', function() {
    clickPerk(perk);
    img.classList.add("clickedPerk");
  });
  return img;
}

let getPerks = function(role) {
  let perkScroll = document.getElementById("perkScroll");
  let child = perkScroll.lastElementChild;

  while (child) {
    perkScroll.removeChild(child);
    child = perkScroll.lastElementChild;
  }

  let keys = [];
  let names = [];
  Object.keys(perks).forEach(key => {
    names.push(perks[key].name);
    keys.push(key);
  });

  let sorted = doubleBubble(names, keys);
  keys = sorted[1];

  keys.forEach(key => {
    let perk = perks[key];

    if (perk.role == role) {
      let img = getPerkImg(perk);
      if(perk == lastSurv || perk == lastKiller){img.classList.add("clickedPerk");}
      perkScroll.appendChild(img);
    }
  });
}


let lookup = {

  setup: function() {
    getPerks("survivor");
    clickPerk(lastSurv);
  }
}

lookup.setup();

document.getElementById("roleKiller").addEventListener("click", function() {
  getPerks("killer");
  clickPerk(lastKiller);
  document.getElementById("roleSurvivor").classList.remove("clickedRole");
  this.classList.add("clickedRole");
});

document.getElementById("roleSurvivor").addEventListener("click", function() {  getPerks("killer");
  getPerks("survivor");
  clickPerk(lastSurv);
  document.getElementById("roleKiller").classList.remove("clickedRole");
  this.classList.add("clickedRole");
});

function searchPerk() {
  // Declare variables
  let input, filter, list, a, i, txtValue;
  input = document.getElementById('searchPerk');
  filter = input.value.toUpperCase();
  list = document.getElementsByClassName('perk');
  // Loop through all list items, and hide those who don't match the search query
  for (i = 0; i < list.length; i++) {
    txtValue = list[i].id
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      list[i].style.display = "";
    } else {
      list[i].style.display = "none";
    }
  }
}


function loopNext(speed){
    $('#perkScroll').stop().animate({scrollLeft:'+=40'}, 'fast', 'linear', loopNext);
}

function loopPrev(){
    $('#perkScroll').stop().animate({scrollLeft:'-=40'}, 'fast', 'linear', loopPrev);
}

function stop(){
    $('#perkScroll').stop();
}

function clickNext(speed){
    $('#perkScroll').stop().animate({scrollLeft:'+=100'}, 'fast', 'linear', loopNext);
}

function clickPrev(){
    $('#perkScroll').stop().animate({scrollLeft:'-=100'}, 'fast', 'linear', loopPrev);
}


$('#afterArrow').hover(function () {
   loopNext();
},function () {
   stop();
});

$('#beforeArrow').hover(function () {
   loopPrev();
},function () {
   stop();
});

let mousedownArrow = -1;
$('#afterArrow').mousedown(function () {
  if(mousedownArrow == -1)
   mousedownArrow = setInterval(clickNext, 50);
}).mouseup(function(){
  clearInterval(mousedownArrow);
  mousedownArrow = -1;
});

$('#beforeArrow').mousedown(function () {
   mousedownArrow = setInterval(clickPrev, 50);
}).mouseup(function(){
  clearInterval(mousedownArrow);
  mousedownArrow = -1;
});

$('#starsOfPerks').on('change', function(){
  let perk;
  let recommendedPerks = document.getElementById("recommendedPerks");
  Object.keys(perks).forEach(k=>{
    if(perks[k].name == document.getElementsByClassName("clickedPerk")[0].id){
      perk = perks[k];
    }
  })


  child = recommendedPerks.lastElementChild;
  while (child) {
    recommendedPerks.removeChild(child);
    child = recommendedPerks.lastElementChild;
  }
  let recommended = getRecommended(perk);

  for(let i = 0; i < recommended.length; i++){
    recommendedPerks.appendChild(recommended[i]);
  }
});

$('#minOrExact').on('change', function(){
  let perk;
  let recommendedPerks = document.getElementById("recommendedPerks");
  Object.keys(perks).forEach(k=>{
    if(perks[k].name == document.getElementsByClassName("clickedPerk")[0].id){
      perk = perks[k];
    }
  })


  child = recommendedPerks.lastElementChild;
  while (child) {
    recommendedPerks.removeChild(child);
    child = recommendedPerks.lastElementChild;
  }
  let recommended = getRecommended(perk);

  for(let i = 0; i < recommended.length; i++){
    recommendedPerks.appendChild(recommended[i]);
  }
});

});
