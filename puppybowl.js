const newPlayerForm = document.querySelector('#new-player-form');
const playerContainer = document.querySelector('#player-container');

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

const addNewPlayer = async (playerObj) => {
  try {
    const response = await fetch(PLAYERS_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=UTF-8"
      },
      body: JSON.stringify(playerObj),
    });

    if (!response.ok) {
      throw new Error("Failed to add player");
    }

    const addedPlayer = await response.json();
    return addedPlayer.data.players;
  } catch (err) {
    console.error("Oops, something went wrong with adding that player!", err);
    throw err;
  }
};

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
      console.log(player);
      fetchAllPlayers();
  
      window.location.reload();
    } catch (err) {
      console.log(`Whoops, trouble removing player #${id} from the roster!`, err);
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
        <button class="details-button" data-id="${player.id}">See Details</button>
        <button class="delete-button" data-id="${player.id}">Delete</button>
      `;
      
      playerContainer.appendChild(playerElement);

      // See details
      const detailsButton = playerElement.querySelector('.details-button');
      detailsButton.addEventListener('click', async (event) => {
        playerElement.innerHTML = `
          <h2>${player.name}</h2>
          <p>${player.imageUrl}</p>
          <p>${player.breed}</p>
          <p>${player.status}</p>
          <p>${player.createdAt}</p>
          <p>${player.updatedAt}</p>
          <p>${player.teamId}</p>
          <p>${player.cohortId}</p>
          <button class="details-button" data-id="${player.id}">See Details</button>
          <button class="delete-button" data-id="${player.id}">Delete</button>
        `;
        console.log(playerElement);
      });

       // delete player
       const deleteButton = playerElement.querySelector('.delete-button');
       deleteButton.addEventListener('click', async (event) => {
        // event.preventDefault();
        // deletePlayer(player.id);
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
    const puppy = await getPlayerById(id);

    const playersResponse = await fetch(`${PLAYERS_API_URL}/player/${id}`);
    const players = await playersResponse.json();

    // create new HTML element to display player details
    const playerDetailsElement = document.createElement('div');
    playerDetailsElement.classList.add('player-details');
    playerDetailsElement.innerHTML = `
            <h2>${players.name}</h2>
            <p>${players.imageUrl}</p>
            <p>${players.breed}</p>
            <p>${players.status}</p>
            <p>${players.createdAt}</p>
            <p>${players.updatedAt}</p>
            <p>${players.teamId}</p>
            <p>${players.cohortId}</p>
        `;
    playerContainer.appendChild(playerDetailsElement); 

    // add event listener to close button
    const closeButton = playerDetailsElement.querySelector('.close-button');
    closeButton.addEventListener('click', () => {
      playerDetailsElement.remove();
    });

    } catch (error) {
    console.error(error);
  }
};

/**
 * Fills in `<form id="new-player-form">` with the appropriate inputs and a submit button.
 * When the form is submitted, it should call `addNewPlayer`, fetch all players,
 * and then render all players to the DOM.
 */

  const renderNewPlayerForm = () => {
    try {
      const container = document.getElementById('newPlayerFormContainer');

      if (container) {
       
        container.innerHTML = '';

        const form = document.createElement('form');
        form.setAttribute('id', 'newPlayerForm');

        // Name field
        const nameLabel = document.createElement('label');
        nameLabel.setAttribute('for', 'name');
        nameLabel.innerText = 'Name:';
        form.appendChild(nameLabel);

        const nameInput = document.createElement('input');
        nameInput.setAttribute('type', 'text');
        nameInput.setAttribute('id', 'name');
        nameInput.setAttribute('name', 'name');
        nameInput.required = true;
        form.appendChild(nameInput);

        // Submit button
        const submitButton = document.createElement('button');
        submitButton.setAttribute('type', 'submit');
        submitButton.innerText = 'Submit';
        form.appendChild(submitButton);

        container.appendChild(form);
      }
    } catch (err) {
      console.error('Uh oh, trouble rendering the new player form!', err);
    }
  };

/**
 * Initializes the app by fetching all players and rendering them to the DOM.
 */
const init = async () => {
  const players = await fetchAllPlayers();
  renderAllPlayers(players);

  //renderNewPlayerForm();
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













