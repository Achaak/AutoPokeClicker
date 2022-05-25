// ==UserScript==
// @name         AutoCliker
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       Achaak & Raphael0010
// @match        https://www.pokeclicker.com
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pokeclicker.com
// @grant        none
// @updateURL    https://raw.githubusercontent.com/Achaak/AutoPokeClicker/main/autoPokeClicker.js
// @downloadURL  https://raw.githubusercontent.com/Achaak/AutoPokeClicker/main/autoPokeClicker.js
// ==/UserScript==

(function () {
  "use strict";

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  function keyGen(keyLength) {
    var i,
      key = "",
      characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var charactersLength = characters.length;

    for (i = 0; i < keyLength; i++) {
      key += characters.substr(
        Math.floor(Math.random() * charactersLength + 1),
        1
      );
    }

    return key;
  }

  const createButton = ({ start, stop = () => {}, name }) => {
    const id = keyGen(12);
    const startName = `${id}Start`;
    const stopName = `${id}Stop`;

    window[startName] = () => {
      start();

      const element = $(`#${id}`);
      element.html("Stop");
      element.addClass("btn-danger").removeClass("btn-success");
      element.attr("onclick", `${stopName}()`);
    };

    window[stopName] = () => {
      stop();

      const element = $(`#${id}`);
      element.html("Start");
      element.addClass("btn-success").removeClass("btn-danger");
      element.attr("onclick", `${startName}()`);
    };

    return `
      <tr>
        <td>
          ${name}
        </td>
        <td>
          <button id="${id}" class="btn btn-success btn-sm btn-block p-0" onClick="${startName}()">Start</button>
        </td>
      </tr>`;
  };

  const autoClickerTr = createButton({
    name: "Auto Clicker",
    start: () => {
      window.autoHatcheryInterval = setInterval(() => {
        const clickableZone = $(".battle-view .clickable");
        if (!clickableZone) return;

        const dataBind = clickableZone.attr("data-bind");
        if (!dataBind) return;

        if (dataBind.includes("GymBattle.clickAttack")) {
          GymBattle.clickAttack();
        } else if (dataBind.includes("DungeonRunner.handleClick")) {
          DungeonRunner.handleClick();
        } else if (dataBind.includes("Battle.clickAttack")) {
          Battle.clickAttack();
        }
      }, 50);
    },
    stop: () => {
      clearInterval(window.autoHatcheryInterval);
    },
  });

  const autoHatcheryTr = createButton({
    name: "Auto Hatchery",
    start: () => {
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
    },
    stop: () => {
      clearInterval(window.autoHatcheryInterval);
    },
  });

  const autoGymTr = createButton({
    name: "Auto Gym",
    start: () => {
      window.autoArenaInterval = setInterval(() => {
        const element = $('button:contains("gym")');

        if (element) {
          element.click();
        }
      }, 100);
    },
    stop: () => {
      clearInterval(window.autoArenaInterval);
    },
  });

  const autoDungeonTr = createButton({
    name: "Auto Dungeon",
    start: () => {
      let inProgress = false;

      window.autoLaunchDungeonInterval = setInterval(() => {
        if (App.game.gameState === GameConstants.GameState.dungeon) {
          return;
        }

        const element = $('button[onclick*="initializeDungeon"]');

        if (!element) {
          return;
        }
        inProgress = false;
        element.click();
      }, 1000);

      let bossPos;

      window.autoDungeonInterval = setInterval(async () => {
        // if (DungeonRunner.dungeonFinished()) {
        //   return;
        // }
        if (App.game.gameState !== GameConstants.GameState.dungeon) {
          return;
        }
        if (DungeonRunner.fighting()) {
          DungeonRunner.handleClick();
          return;
        }
        const board = DungeonRunner.map.board();
        const checkHasAllChest = () => {
          for (let j = 0; j < board.length; j++) {
            for (let i = 0; i < board[j].length; i++) {
              if (
                board[j][i].type() == GameConstants.DungeonTile.chest &&
                !board[j][i].isVisited
              ) {
                return false;
              }
            }
          }
          return true;
        };

        const initBoard = () => {
          for (let j = 0; j < board.length; j++) {
            for (let i = 0; i < board[j].length; i++) {
              board[j][i].x = i;
              board[j][i].y = j;
              if (board[j][i].type() == GameConstants.DungeonTile.boss) {
                bossPos = board[j][i];
              }
            }
          }
        };
        if (!inProgress) {
          initBoard();
        }

        const move = () => {
          if (!bossPos.isVisited || !checkHasAllChest()) {
            const tiles = DungeonRunner.map.nearbyTiles(
              DungeonRunner.map.playerPosition()
            );
            const unvisitedTiles = tiles.filter((t) => !t.isVisited);
            if (unvisitedTiles.length > 0) {
              const tile =
                unvisitedTiles[
                  Math.floor(Math.random() * unvisitedTiles.length)
                ];
              DungeonRunner.map.moveToCoordinates(tile.x, tile.y);
            } else {
              const tile = tiles[Math.floor(Math.random() * tiles.length)];
              DungeonRunner.map.moveToCoordinates(tile.x, tile.y);
            }
            return;
          }
          DungeonRunner.map.moveToCoordinates(bossPos.x, bossPos.y);
        };

        switch (DungeonRunner.map.currentTile().type()) {
          case GameConstants.DungeonTile.chest:
            DungeonRunner.handleClick();
            move();
            break;
          case GameConstants.DungeonTile.boss:
            if (!checkHasAllChest()) {
              move();
            }
            DungeonRunner.handleClick();
            break;
          case GameConstants.DungeonTile.enemy:
            move();
            break;
          default:
            move();
            break;
        }
      }, 10);
    },
    stop: () => {
      clearInterval(window.autoLaunchDungeonInterval);
      clearInterval(window.autoDungeonInterval);
    },
  });

  const allTtemsTr = createButton({
    name: "All Items",
    start: () => {
      for (let index = 0; index < App.game.oakItems.itemList.length; index++) {
        const item = App.game.oakItems.itemList[index];

        if (item.purchased !== false) {
          item.isActive = true;
        }
      }
    },
    stop: () => {
      for (let index = 0; index < App.game.oakItems.itemList.length; index++) {
        const item = App.game.oakItems.itemList[index];

        item.isActive = false;
      }
    },
  });

  const autoMineTr = createButton({
    name: "Auto Mine",
    start: () => {
      window.autoMineInterval = setInterval(() => {
        if (Math.floor(App.game.underground.energy) > 0) {
          for (let i = 0; i < Mine.rewardGrid.length; i++) {
            const line = Mine.rewardGrid[i];

            for (let j = 0; j < line.length; j++) {
              const cell = line[j];

              if (cell !== 0 && cell.revealed === 0) {
                Mine.chisel(i, j);
              }
            }
          }
        }
      }, 500);
    },
    stop: () => {
      clearInterval(window.autoMineInterval);
    },
  });

  const autoFarmTr = createButton({
    name: "Auto Farm",
    start: () => {
      const f = () => {
        App.game.farming.harvestAll();
        const berrys = FarmController.getUnlockedBerryList();
        const ber = berrys.map((e) => ({
          id: e,
          count: App.game.farming.berryList[e](),
        }));
        const berry = ber
          .filter((a) => a.count !== 0)
          .sort((a, b) => a.count - b.count)[0];
        App.game.farming.plantAll(berry.id);
      };

      window.autoFarmInterval = setInterval(f, 10000);

      f();
    },
    stop: () => {
      clearInterval(window.autoFarmInterval);
    },
  });

  const autoRouteTr = createButton({
    name: "Auto Route",
    start: () => {
      const f = () => {
        const route = Routes.regionRoutes
          .map((r) => ({
            access: MapHelper.accessToRoute(r.number, r.region),
            isAchievementsComplete: RouteHelper.isAchievementsComplete(
              r.number,
              r.region
            ),
            isComplete: RouteHelper.routeCompleted(
              r.number,
              r.region,
              true,
              true
            ),
            route: r.number,
            region: r.region,
          }))
          .filter(
            (r) => r.access && !(r.isAchievementsComplete && r.isComplete)
          );

        MapHelper.moveToRoute(route[0].route, route[0].region);
      };

      window.autoRouteInterval = setInterval(f, 10000);

      f();
    },
    stop: () => {
      clearInterval(window.autoRouteInterval);
    },
  });

  const tool = document.createElement("div");
  tool.className = "card sortable border-secondary mb-3";
  tool.innerHTML = `
    <div class="card-header p-0" data-toggle="collapse"><span>PokeTools</span></div>
    <div class="card-body p-0 show table-responsive">
      <table class="table table-striped table-hover table-sm m-0">
        <tbody>
          ${autoClickerTr}
          ${autoHatcheryTr}
          ${autoGymTr}
          ${autoDungeonTr}
          ${allTtemsTr}
          ${autoMineTr}
          ${autoFarmTr}
          ${autoRouteTr}
        </tbody>
      </table>
    </div>
    `;

  const leftColumn = $("#left-column");

  leftColumn.append(tool);
})();
