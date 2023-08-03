const newPlayerFormContainer = document.querySelector("#new-player-form");
const playerContainer = document.querySelector("#player-container");

// Use the API_URL variable to make fetch requests to the API.
// Replace the placeholder with your cohort name (ex: 2109-UNF-HY-WEB-PT)
const cohortName = "2306-GHP-ET-WEB-FT-SF";
const API_URL = `https://fsa-puppy-bowl.herokuapp.com/api/2306-GHP-ET-WEB-FT-SF`;
const PLAYERS_API_URL = `https://fsa-puppy-bowl.herokuapp.com/api/2306-GHP-ET-WEB-FT-SF/players`;

/**
 * Fetches all players from the API.
 * @returns {Object[]} the array of player objects
 */
const fetchAllPlayers = async () => {
    try {
      const response = await fetch(PLAYERS_API_URL);
      const puppies = await response.json();
      return puppies.data.players;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

/**
 * Fetches a single player from the API.
 * @param {number} playerId
 * @returns {Object} the player object
 */
const fetchSinglePlayer = async (id) => {
  try {
    const response = await fetch(`${PLAYERS_API_URL}/${id}`);
    const puppy = await response.json();
    return puppy.data.players;
  } catch (err) {
    console.error(`Oh no, trouble fetching player #${id}!`, err);
    throw err;
  }
};

/**
 * Adds a new player to the roster via the API.
 * @param {Object} playerObj the player to add
 * @returns {Object} the player returned by the API
 */

/**
 * Removes a player from the roster via the API.
 * @param {number} playerId the ID of the player to remove
 */
const removePlayer = async (id) => {
  try {
    const response = await fetch(`${PLAYERS_API_URL}/${id}`, {
        method: 'DELETE',
      });
      const player = await response.json();
      fetchAllPlayers();
  
      window.location.reload();
    } catch (err) {
      console.error("Whoops, trouble removing player #${id} from the roster!", err);
      throw err;
    }
  };

/**
 * Updates `<main>` to display a list of all players.
 *
 * If there are no players, a corresponding message is displayed instead.
 *
 * Each player is displayed in a card with the following information:
 * - name
 * - id
 * - image (with alt text of the player's name)
 *
 * Additionally, each card has two buttons:
 * - "See details" button that, when clicked, calls `renderSinglePlayer` to
 *    display more information about the player
 * - "Remove from roster" button that, when clicked, will call `removePlayer` to
 *    remove that specific player and then re-render all players
 *
 * Note: this function should replace the current contents of `<main>`, not append to it.
 * @param {Object[]} playerList - an array of player objects
 */
//const renderAllPlayers = (playerList) => {
  // TODO
//};

const renderAllPlayers = async (players) => {
  
  try {
    playerContainer.innerHTML = '';
    players.forEach((player) => {
      const playerElement = document.createElement('div');
      playerElement.classList.add('player');
      playerElement.innerHTML = `
        <h2>${player.name}</h2>
        <img src="${player.imageUrl}" alt="photo of ${player.name}">
        <div class = "body">
        <button class="details-button" data-id="${player.id}">See Details</button>
        <button class="delete-button" data-id="${player.id}">Remove Player</button>
        <div/>
      `;
      
      playerContainer.appendChild(playerElement);

      // See details
      const detailsButton = playerElement.querySelector('.details-button');
      detailsButton.addEventListener('click', async (event) => {
        playerElement.innerHTML = `
          <h2>${player.name}</h2>
          <img src="${player.imageUrl}" alt="photo of ${player.name}">
          <p>${player.breed}</p>
          <p>${player.status}</p>
          <p>${player.teamId}</p>
          <button class="details-button" data-id="${player.id}">See Details</button>
          <button class="delete-button" data-id="${player.id}">Remove Player</button>
        `;
        console.log(playerElement);
      });

       // delete player
       const deleteButton = playerElement.querySelector('.delete-button');
       deleteButton.addEventListener('click', async (event) => {        
        try {
          const id = event.target.dataset.id
          await removePlayer(id)
          const remainingPlayers = await fetchAllPlayers
          renderAllPlayers(remainingPlayers)
        } catch (error) {
          console.error(error)
        }
      });
    });
  } catch (error) {
    console.error(error);
  }
};

/**
 * Updates `<main>` to display a single player.
 * The player is displayed in a card with the following information:
 * - name
 * - id
 * - breed
 * - image (with alt text of the player's name)
 * - team name, if the player has one, or "Unassigned"
 *
 * The card also contains a "Back to all players" button that, when clicked,
 * will call `renderAllPlayers` to re-render the full list of players.
 * @param {Object} player an object representing a single player
 */
//const renderSinglePlayer = (player) => {
  // TODO
//};

const renderSinglePlayer = async (id) => {
  try {
    // fetch player details from server
    const player = await getPlayerById(id);

    const playersResponse = await fetch(`${PLAYERS_API_URL}/player/${id}`);
    const players = await playersResponse.json();

    // create new HTML element to display player details
    const playerDetailsElement = document.createElement('div');
    playerDetailsElement.classList.add('player-details');
    playerDetailsElement.innerHTML = `
            <h2>${players.name}</h2>
            <img src="${players.imageUrl}" alt="photo of ${players.name}">
            <p>${players.breed}</p>
            <p>${players.status}</p>
            <p>${players.teamId}</p>
        `;
    playerDetailsElement.classList.add('box');
    playerContainer.appendChild(playerDetailsElement); 

    // add event listener to close button
    const closeButton = playerDetailsElement.querySelector('.close-button');
    closeButton.addEventListener('click', () => {
      playerDetailsElement.remove();
    });

  //   return (
  //     <div>
  //        { players.map((player) =>
  //           <h2>{player.player_id}</h2>
  //        }
  //     </div>
  //  )

    } catch (error) {
    console.error(error);
  }
};

/**
 * Fills in `<form id="new-player-form">` with the appropriate inputs and a submit button.
 * When the form is submitted, it should call `addNewPlayer`, fetch all players,
 * and then render all players to the DOM.
 */

const addNewPlayer = async (name, breed, imageUrl, status, teamId) => {
  try {
    const response = await fetch(PLAYERS_API_URL,{
      method: "POST",
      body: JSON.stringify({name, breed, imageUrl, status, teamId}),
      headers: {
        'Content-Type':'application/json'
      }
    });
    const newPlayer = await response.json();
    fetchAllPlayers();
  } catch (err) {
    console.error("Oops, something went wrong with adding that player!", err);
  }
};


const renderNewPlayerForm = () => {
  let formHtml = `
  <form>
  <label for="title">New Player Form</label>
  <br>
  <label for="name">Name</label>
  <br>
  <input type="text" id="name" placeholder="Name">
  <br>
  <label for="breed">Breed</label>
  <br>
  <input type="text" id="breed" placeholder="Breed">
  <br>
  <label for="imageUrl">Image URL</label>
  <br>
  <input type="text" id="imageUrl" placeholder="Image URL">
  <br>
  <label for="Status">Status</label>
  <br>
  <input type="text" id="status" placeholder="Status"></input>
  <br>
  <label for="teamId">Team Name</label>
  <br>
  <input type="number" id="teamId" placeholder="Team Name">
  <br>
  <button type="submit">Submit</button>
  </form>
  `;
  newPlayerFormContainer.innerHTML = formHtml;

  let form = newPlayerFormContainer.querySelector('form');
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
  
  let playerData = {
    name:form.name.value,
    breed:form.breed.value,
    imageUrl:form.imageUrl.value,
    status:form.status.value,
    teamId:form.teamId.value || null
  };
  await addNewPlayer(playerData.name, playerData.breed, playerData.imageUrl, playerData.status, playerData.teamId);

  const players = await fetchAllPlayers();
  renderAllPlayers(players.data.players);
  form.name.value="";
  form.breed.value="";
  form.imageUrl.value="";
  form.status.value="";
  form.teamId.value="";
  })
};

/**
 * Initializes the app by fetching all players and rendering them to the DOM.
 */
const init = async () => {
  const players = await fetchAllPlayers();
  renderAllPlayers(players);

  renderNewPlayerForm();
};

// This script will be run using Node when testing, so here we're doing a quick
// check to see if we're in Node or the browser, and exporting the functions
// we want to test if we're in Node.
if (typeof window === "undefined") {
  module.exports = {
    fetchAllPlayers,
    fetchSinglePlayer,
    addNewPlayer,
    removePlayer,
    renderAllPlayers,
    renderSinglePlayer,
    renderNewPlayerForm,
  };
} else {
  init();
}














