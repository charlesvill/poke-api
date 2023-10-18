const initializer = (function () {
    const name = document.querySelector(".name");
    const img = document.querySelector("img");
    const search = document.getElementById("name");
    const form = document.querySelector(".searchbar");
    const typetxt = document.querySelector(".types");
    const doubleTo = document.querySelector(".doubleto");
    const noTo = document.querySelector(".noto");
    const halfTo = document.querySelector(".halfto");
    const doubleFrom = document.querySelector(".doublefrom");
    const noFrom = document.querySelector(".nofrom");
    const halfFrom = document.querySelector(".halffrom");

    const searchEvntHndlr = function () {
        form.addEventListener("submit", (e) => {

            e.preventDefault();
            resetStats();
            processSearch();
        })
    }
    const resetStats = () => {
      console.log("stats should be resetting");
      doubleTo.textContent = "";
      noTo.textContent = "";
      halfTo.textContent = "";
      doubleFrom.textContent = "";
      noFrom.textContent = "";
      halfFrom.textContent = "";
    }
    const getTypeByName = (queryString) => {
        fetch(`https://pokeapi.co/api/v2/pokemon/${queryString}/`, {mode: 'cors'})
        .then((rsp) => {
            if (!rsp.ok) {
                throw new Error(`Search was not found, please try again. Status: ${rsp.status}`);
            }
            return rsp.json();
        })
        .then((data) => {
            processImg(data);
            getStatsByType(processType(data));
            name.textContent = search.value;
        })
        .catch((error) => {
            console.error(error);
            displayErrorCode();
        })
    }
    const processType = (obj) => {
        const types = [];
        obj.types.forEach((element) => {
           const name = element.type['name'];
           types.push(name);
        });
        typetxt.textContent = types.join(", ");
        return types;
    }
    const processImg = (obj) => {
        const imgSrc = obj.sprites.front_default;
        img.src = imgSrc;
    }
    const getStatsByType = (types) => {
        types.forEach((type) => {
          if (type) { // Check if type is defined (not undefined or null)
            fetch(`https://pokeapi.co/api/v2/type/${type}`)
              .then(rsp => {
                if (!rsp.ok) {
                  throw new Error(`failure on request for ${type} status: ${rsp.status}`)
                }
                return rsp.json();
              })
              .then(data => {
                processStats(data);
              })
              .catch(error => console.error(error));
          }
        });
      }


    const processSearch = () => {
        const queryString = search.value.toLowerCase();
        getTypeByName(queryString);
    }

    const processStats = (obj) => {
        const twoDamTo = stringFormulator(obj.damage_relations.double_damage_to);
        const noDamTo = stringFormulator(obj.damage_relations.no_damage_to);
        const halfDamTo = stringFormulator(obj.damage_relations.half_damage_to);
        const twoDamFrom = stringFormulator(obj.damage_relations.double_damage_from);
        const halfDamFrom = stringFormulator(obj.damage_relations.half_damage_from);
        const noDamFrom = stringFormulator(obj.damage_relations.no_damage_from);


        doubleTo.textContent += twoDamTo;
        noTo.textContent += noDamTo;
        halfTo.textContent += halfDamTo;

        doubleFrom.textContent += twoDamFrom;
        noFrom.textContent += noDamFrom;
        halfFrom.textContent += halfDamFrom;
    }
    const stringFormulator = (arr) => {
        let stringArr = [];
        arr.forEach((element) => {
            stringArr.push(element.name)
        });
        return stringArr.join(", ");
    }
    const displayErrorCode = () => {
        name.textContent = "! Search Not Found !";
        img.src = './images/ohnopokemon.png';
        typetxt.textContent = "Try again";
    }


    searchEvntHndlr();
})();