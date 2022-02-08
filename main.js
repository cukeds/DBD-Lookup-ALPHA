$.ajaxSetup({
  async: false
});
var killers, perks, survivors = null;
$.getJSON("http://localhost:8080/json/perks.json", function(json) {
  perks = json;
});

$.getJSON("http://localhost:8080/json/characters.json", function(json) {
  characters = json;
});

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
      let img = document.createElement("img");
      img.src = "http://localhost:8080/" + perk.image;
      img.id = perk.name;
      img.width = 128;
      img.height = 128;
      img.classList.add("perk");

      img.addEventListener('click', function() {
        for (let i = 0; i < document.getElementsByClassName("clickedPerk").length; i++) {
          document.getElementsByClassName("clickedPerk")[i].classList.remove("clickedPerk");
        }
        img.classList.add("clickedPerk");
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
        portrait.src = "http://localhost:8080/UI/Icons/CharPortraits/" + characters[perk.character].image;
        portrait.width = 256;
        portrait.height = 256;
        portrait.border = "5px solid;";

        document.getElementById("portraitName").innerText = characters[perk.character].name;
      });
      perkScroll.appendChild(img);
    }
  });
}


let lookup = {

  setup: function() {
    getPerks("survivor");
  }
}

lookup.setup();

document.getElementById("roleKiller").addEventListener("click", function() {
  for (let i = 0; i < document.getElementsByClassName("clickedPerk").length; i++) {
    document.getElementsByClassName("clickedPerk")[i].classList.remove("clickedPerk");
  }
  document.getElementById("roleSurvivor").classList.remove("clickedRole");
  getPerks("killer");
  document.getElementById(perks.NurseCalling.name).classList.add('clickedPerk');
  document.getElementById('name').textContent = perks.NurseCalling.name;
  cleanText = perks.NurseCalling.description.replace(/<\/?[^>]+(>|$)/g, "");
  cleanText = cleanText.replaceAll(',', ', ');
  cleanText = cleanText.replaceAll('.', '. ');
  for (let i = 0; i < perks.NurseCalling.tunables.length; i++) {
    cleanText = cleanText.replace(`{${i}}`, perks.NurseCalling.tunables[i][perks.NurseCalling.tunables[i].length - 1]);
  }
  document.getElementById('description').innerText = cleanText;
  for (let i = 1; i < 6; i++) {
    if (i <= parseInt(perks.NurseCalling.stars)) {
      document.getElementById(`star${i}`).style.display = "";
    } else {
      document.getElementById(`star${i}`).style.display = "none";
    }
  }
  let portrait = document.getElementById("portrait");
  portrait.src = "http://localhost:8080/UI/Icons/CharPortraits/" + characters[perks.NurseCalling.character].image;
  portrait.width = 256;
  portrait.height = 256;
  portrait.border = "5px solid;";
  this.classList.add("clickedRole");
});

document.getElementById("roleSurvivor").addEventListener("click", function() {
  for (let i = 0; i < document.getElementsByClassName("clickedPerk").length; i++) {
    document.getElementsByClassName("clickedPerk")[i].classList.remove("clickedPerk");
  }
  document.getElementById("roleKiller").classList.remove("clickedRole");
  getPerks("survivor");
  document.getElementById(perks.Ace_In_The_Hole.name).classList.add('clickedPerk');
  document.getElementById('name').textContent = perks.Ace_In_The_Hole.name;
  cleanText = perks.Ace_In_The_Hole.description.replace(/<\/?[^>]+(>|$)/g, "");
  cleanText = cleanText.replaceAll(',', ', ');
  cleanText = cleanText.replaceAll('.', '. ');
  for (let i = 0; i < perks.Ace_In_The_Hole.tunables.length; i++) {
    cleanText = cleanText.replace(`{${i}}`, perks.Ace_In_The_Hole.tunables[i][perks.Ace_In_The_Hole.tunables[i].length - 1]);
  }
  document.getElementById('description').innerText = cleanText;
  for (let i = 1; i < 6; i++) {
    if (i <= parseInt(perks.Ace_In_The_Hole.stars)) {
      document.getElementById(`star${i}`).style.display = "";
    } else {
      document.getElementById(`star${i}`).style.display = "none";
    }
  }
  let portrait = document.getElementById("portrait");
  portrait.src = "http://localhost:8080/UI/Icons/CharPortraits/" + characters[perks.Ace_In_The_Hole.character].image;
  portrait.width = 256;
  portrait.height = 256;
  portrait.border = "5px solid;";
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
