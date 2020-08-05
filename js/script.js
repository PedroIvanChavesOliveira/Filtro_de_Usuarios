let inputText = document.querySelector('#inputText');
let inputButton = document.querySelector('#inputButton');
let saveSearch = '';
let brokenName = [];
let contacts = [];
let filterName = [];

let countMale = 0;
let countFemale = 0;
let summaryAges = 0;
let mediaAges = 0;

let divFinder = document.querySelector('#divFinder');
let divStatistics = document.querySelector('#divStatistics');

window.addEventListener('load', () => {
  preventSubmit();
  doFetchAsync();
  activateInput();
});

async function doFetchAsync() {
  const res = await fetch(
    'https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo'
  );
  const json = await res.json();
  contacts = json.results.map(
    ({
      name: { first },
      name: { last },
      dob: { age },
      gender,
      picture: { medium },
    }) => {
      return {
        name: `${first} ${last}`,
        age,
        gender,
        medium,
      };
    }
  );
  render();
}

function render() {
  searching();
  value();
}

function value() {
  contacts.forEach((results) => {
    const { name, age, medium, gender } = results;
    brokenName.push({ name, age, medium, gender });
  });
}

function activateInput() {
  function pressEnter(event) {
    if (event.key === 'Enter') {
      saveSearch = event.target.value.toLowerCase().trim();
      filterName = brokenName.filter((item) => {
        return item.name.toLowerCase().includes(saveSearch);
      });
      searching();
    }
  }
  function doInputButton(event) {
    event = inputText.value.toLowerCase();
    saveSearch = event.trim();
    filterName = brokenName.filter((item) => {
      return item.name.toLowerCase().includes(saveSearch);
    });
    searching();
  }

  inputText.focus();
  inputButton.addEventListener('click', doInputButton);
  inputText.addEventListener('keyup', pressEnter);
}
function searching() {
  if (saveSearch === '') {
    return;
  } else {
    showPeople();
  }
}

function showPeople() {
  let divPeople = '<div>';

  filterName.map((results) => {
    const { name, age, medium, gender } = results;
    if (saveSearch) {
      const peopleHTML = ` 
        <div class= 'total'>
          <div class='photo'>
            <img src="${medium}" alt="${name}">
          </div>
          <div class='text'>
            <p>${name}, ${age} anos</p>
          </div>
        </div>
        `;

      if (gender === 'female') {
        countFemale++;
      } else {
        countMale++;
      }

      divPeople += peopleHTML;
      summaryAges = summaryAges + age;
      mediaAges = Math.round(summaryAges / filterName.length);
    }
    divPeople += '</div>';
    divFinder.innerHTML = divPeople;

    divStatistics.innerHTML = `
      <div class='newDivRight'>
        <ul>
          <li>Usuários Encontrados: ${filterName.length}</li>
          <li>Gênero Masculino: ${countMale}</li>
          <li>Gênero Feminino: ${countFemale}</li>
          <li>Somatório das Idades: ${summaryAges}</li>
          <li>Idade Média: ${mediaAges}</li>
        </ul>
      </div>
    `;
  });
  countFemale = 0;
  countMale = 0;
  summaryAges = 0;
  mediaAges = 0;
}

function preventSubmit() {
  function stopSubmit(event) {
    event.preventDefault();
  }
  var body = document.querySelector('body');
  body.addEventListener('submit', stopSubmit);
}
