// ==UserScript==
// @name         AutoCliker
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       Achaak & Raphael0010
// @match        https://www.pokeclicker.com//
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pokeclicker.com
// @grant        none
// @updateURL    https://raw.githubusercontent.com/Achaak/AutoPokeClicker/main/autoPokeClicker.js
// @downloadURL  https://raw.githubusercontent.com/Achaak/AutoPokeClicker/main/autoPokeClicker.js
// ==/UserScript==

(function () {
  "use strict";

  // Auto Click
  const handleStartAutoClicker = () => {
    window.autoClickInterval = setInterval(() => {
      const clickableZone = $(".battle-view .clickable");
      if(!clickableZone) return

      const dataBind = clickableZone.attr('data-bind')
      if(!dataBind) return

      if(dataBind.includes("Battle.clickAttack")) {
        Battle.clickAttack()
      }
      else if(dataBind.includes("DungeonRunner.handleClick")) {
        DungeonRunner.handleClick()
      }
      else if(dataBind.includes("GymBattle.clickAttack")) {
        GymBattle.clickAttack()
      }
    }, 50);

    const element = $("#btn-autoClicker");
    element.html("Stop");
    element.addClass("btn-danger").removeClass("btn-success");
    element.attr("onclick", "handleStopAutoClicker()");
  };
  window.handleStartAutoClicker = handleStartAutoClicker;

  const handleStopAutoClicker = () => {
    clearInterval(window.autoClickInterval);

    const element = $("#btn-autoClicker");
    element.html("Start");
    element.addClass("btn-success").removeClass("btn-danger");
    element.attr("onclick", "handleStartAutoClicker()");
  };
  window.handleStopAutoClicker = handleStopAutoClicker;

  // Auto Hatchery
  const handleStartAutoHatchery = () => {
    window.autoHatcheryInterval = setInterval(() => {
      // Je clique sur les 4 slots d'oeufs
      for (let index = 0; index < 4; index++) {
        App.game.breeding.hatchPokemonEgg(index);
      }

      const pokemons = PartyController.getSortedList()
        .filter((p) => p.breeding === false && p.level === 100)
        .slice(0, 4);
      for (const pok of pokemons) {
        if (App.game.breeding.hasFreeEggSlot()) {
          App.game.breeding.addPokemonToHatchery(pok);
        }
      }
    }, 1000);

    const element = $("#btn-autoHatchery");
    element.html("Stop");
    element.addClass("btn-danger").removeClass("btn-success");
    element.attr("onclick", "handleStopAutoHatchery()");
  };
  window.handleStartAutoHatchery = handleStartAutoHatchery;

  const handleStopAutoHatchery = () => {
    clearInterval(window.autoHatcheryInterval);

    const element = $("#btn-autoHatchery");
    element.html("Start");
    element.addClass("btn-success").removeClass("btn-danger");
    element.clic.attr("onclick", "handleStartAutoHatchery()");
  };
  window.handleStopAutoHatchery = handleStopAutoHatchery;

  // Auto Arena
  const handleStartAutoArena = () => {
    window.autoArenaInterval = setInterval(() => {
      const element = $('button:contains("gym")');

      if (element) {
        element.click();
      }
    }, 1000);

    const element = $("#btn-autoArena");
    element.html("Stop");
    element.addClass("btn-danger").removeClass("btn-success");
    element.attr("onclick", "handleStopAutoArena()");
  };
  window.handleStartAutoArena = handleStartAutoArena;

  const handleStopAutoArena = () => {
    clearInterval(window.autoArenaInterval);

    const element = $("#btn-autoArena");
    element.html("Start");
    element.addClass("btn-success").removeClass("btn-danger");
    element.attr("onclick", "handleStartAutoArena()");
  };
  window.handleStopAutoArena = handleStopAutoArena;

  // Auto Dungeon
  const handleStartAutoDungeon = () => {
    window.autoDungeonInterval = setInterval(() => {
      const element = $('button[onclick*="initializeDungeon"]');

      if (element) {
        element.click();
      }
    }, 1000);

    const element = $("#btn-autoDungeon");
    element.html("Stop");
    element.addClass("btn-danger").removeClass("btn-success");
    element.attr("onclick", "handleStopAutoDungeon()");
  };
  window.handleStartAutoDungeon = handleStartAutoDungeon;

  const handleStopAutoDungeon = () => {
    clearInterval(window.autoDungeonInterval);

    const element = $("#btn-autoDungeon");
    element.html("Start");
    element.addClass("btn-success").removeClass("btn-danger");
    element.attr("onclick", "handleStartAutoDungeon()");
  };
  window.handleStopAutoDungeon = handleStopAutoDungeon;

  // All Items
  const handleAddAllItems = () => {
    for (let index = 0; index < App.game.oakItems.itemList.length; index++) {
      const item = App.game.oakItems.itemList[index];

      if (item.purchased !== false) {
        item.isActive = true;
      }
    }

    const element = $("#btn-allItems");
    element.html("Unactive");
    element.addClass("btn-danger").removeClass("btn-success");
    element.attr("onclick", "handleRemoveAllItems()");
  };
  window.handleAddAllItems = handleAddAllItems;

  const handleRemoveAllItems = () => {
    for (let index = 0; index < App.game.oakItems.itemList.length; index++) {
      const item = App.game.oakItems.itemList[index];

      item.isActive = false;
    }

    const element = $("#btn-allItems");
    element.html("Active");
    element.addClass("btn-success").removeClass("btn-danger");
    element.attr("onclick", "handleAddAllItems()");
  };
  window.handleRemoveAllItems = handleRemoveAllItems;

  // Auto Bomb
  const handleStartAutoBomb = () => {
    window.autoBombInterval = setInterval(() => {
      if (App.game.underground.energy >= 30) {
        Mine.bomb();
      }
    }, 1000);

    const element = $("#btn-autoBomb");
    element.html("Stop");
    element.addClass("btn-danger").removeClass("btn-success");
    element.attr("onclick", "handleStopAutoBomb()");
  };
  window.handleStartAutoBomb = handleStartAutoBomb;

  const handleStopAutoBomb = () => {
    clearInterval(window.autoBombInterval);

    const element = $("#btn-autoBomb");
    element.html("Start");
    element.addClass("btn-success").removeClass("btn-danger");
    element.attr("onclick", "handleStartAutoBomb()");
  };
  window.handleStopAutoBomb = handleStopAutoBomb;

  const tool = document.createElement("div");
  tool.className = "card sortable border-secondary mb-3";
  tool.innerHTML = `
    <div class="card-header p-0" data-toggle="collapse"><span>PokeTools</span></div>
    <div class="card-body p-0 show table-responsive">
      <table class="table table-striped table-hover table-sm m-0">
        <tbody>
          <tr>
            <td>
              Auto Clicker
            </td>
            <td>
              <button id="btn-autoClicker" class="btn btn-success btn-sm btn-block p-0" onClick="handleStartAutoClicker()">Start</button>
            </td>
          </tr>
          <tr>
            <td>
              Auto Arena
            </td>
            <td>
              <button id="btn-autoArena" class="btn btn-success btn-sm btn-block p-0" onClick="handleStartAutoArena()">Start</button>
            </td>
          </tr>
          <tr>
            <td>
              Auto Dungeon
            </td>
            <td>
              <button id="btn-autoDungeon" class="btn btn-success btn-sm btn-block p-0" onClick="handleStartAutoDungeon()">Start</button>
            </td>
          </tr>
          <tr>
            <td>
              Auto Hatchery
            </td>
            <td>
              <button id="btn-autoHatchery" class="btn btn-success btn-sm btn-block p-0" onClick="handleStartAutoHatchery()">Start</button>
            </td>
          </tr>
          <tr>
            <td>
              All Items
            </td>
            <td>
              <button id="btn-allItems" class="btn btn-success btn-sm btn-block p-0" onClick="handleAddAllItems()">Active</button>
            </td>
          </tr>
          <tr>
            <td>
              Auto Bomb
            </td>
            <td>
              <button id="btn-autoBomb" class="btn btn-success btn-sm btn-block p-0" onClick="handleStartAutoBomb()">Active</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    `;

  const leftColumn = $("#left-column");

  leftColumn.append(tool);
})();
// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
})();
