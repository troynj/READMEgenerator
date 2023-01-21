# READMEgenerator

# **Table of Contents**
1. [Description](#description)
2. [Features](#features)
3. [Usage](#usage)
4. [Technology](#technology)
5. [About](#about)
6. [License](#license)

[Deployed site](https://bradcoleman60.github.io/GitYourGameOn/)

# **Description**

Our site provides users with information about upcoming NBA games and has a useful interface to find upcoming games and a link to the page at TicketMaster.com where tickets can be purchased.  Additionally, our site provides the user with the current season statistics of three of the top players on each team, for the game that they select.  Lastly, our site provides the user the ability to search a database provided by ballDontLie.io for player information and current season statistics.  

When our site is loaded into to a browser, a grid of NBA teams is presented.  The tiles, representing each of the 30 NBA teams are 'clickable', and when clicked, the user is presented with a list of 30 upcoming games for the selected team.  This list is dynamically generated through a fetch call to the TicketMaster.com (TM) API.  See below for an image of our home page.

![Screenshot](./assets/demoGifs/homeScreen.gif)

Using the TM API, we are able to search events by NBA team.  This required us to use  selection criteria, including the use of regx syntax to obtain the correct games form the TM API.  One challenge that we faced was that the string we had to search by, within the TM API data structure, for games that matched the user-selected team, varied in length and content.  For example, some games were listed in the TM API as "home team v away team", "home team vs. away team", "home team v. away team", or "home team vs away team". See below for image of the game listing page.

![Screenshot](./assets/demoGifs/gameView.gif)

From the list of upcoming games presented, the user can select a specific game.  Upon the selection of a game, our JavaScript fetches data from an API of NBA statistics, BallDoneLie.io.  Noteworthy, is that we fetch the statistics of three top players for BOTH the team that our user selected and the opponent in the game that our user selected.  The user is then presented wth the statistics of current season statistics (average points, average rebounds, field goal percentage and assists).  On this page, after the user can review these statistics, the user can chose to select a link to TicketMaster.com, and suck link takes the user directly to the game for available tickets. See below for an image of this player statistics page. 

![Screenshot](./assets/demoGifs/detailsView.gif)

Our site also provides the user the ability to search all other players in the NBA.  This is accomplished by the use of a pop up modal that prompts the user to select an NBA team from a drop down list, and enter a player name within a text box.  Upon the submission of this form, our site fetches the player information and current season averages for the selected player, if a player is found in the BallDontLie API. This information then presented in the modal.  The user can choose to save this player (in local storage).  See below for an image of the modal below.   

![Screenshot](./assets/image/screen_shot_4.png)

Lastly, the user can use the "favorites" button on the navigation bar to view the previously saved players. 


# **Highlighted Code Example**

The following is code that we would like to highlight.   

The following code snippet is the main  api call to TicketMaster.com.

```
function tmBasketball(userSelection) {
  // console.log(userSelection);
  var apiKey = `apikey=XXXXXXXXXXXXXXXXXXXXXXXXXXXX`;
  var baseUrl = `https://app.ticketmaster.com/`;
  var searchBy = `discovery/v2/events.json`;
  var subGenreId = `subGenreId=KZazBEonSMnZfZ7vFJA`;
  var keywordStr = `keyword="${userSelection}"`;
  var reqUrl = `${baseUrl}${searchBy}?${apiKey}&${keywordStr}&${subGenreId}`;

  
  fetch(reqUrl)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      var gameListEl = $("#initInfo");
      gameListEl.addClass("gamesContainer");

      data._embedded.events.forEach((el, i) => {
        //create
        var gameEl = $("<div>");
        gameEl.addClass("uk-flex-center");
        gameEl.addClass("uk-card");
        gameEl.css("background-color", "#ffffffd9");
        gameEl.css("margin", "10px 0px");
        var selectBtnEl = $("<button>");
        selectBtnEl.addClass("uk-button uk-button-secondary mask");
        //array deconstructor assigned values by splitting value from click event with regex
        
        var [home, away] = setTeamNames(data._embedded.events[i].name);

        home = home?.trim();
        away = away?.trim();
        //home
        var homeIcon = setIcon(
          data._embedded.events[i]._embedded.attractions[0].images
        );
        //away
        var awayIcon = setIcon(
          data._embedded.events[i]._embedded.attractions[1].images
        );
        //Gets the Link to the game selected
        var gameLink = data._embedded.events[i].url;
        var gameName = data._embedded.events[i].name;
        var time = data._embedded.events[i].dates.start.localTime;
        var gameTime = setGameTime(time);
        
        var nameContainer = $("<p>");
        nameContainer.addClass("uk-flex-inline");
        

        gameEl.append(nameContainer);
        //set
        nameContainer.text(gameName);
        nameContainer.css({
          "font-size": "40px",
          color: "black",
        });
        gameEl.append(nameContainer);

        gameEl.attr("jumpto", "details");
        gameEl.attr("jumpfrom", "games");
        //Cannot read properties of undefined (reading 'trim')
        gameEl.attr("homeTeam", home);
        //Cannot read properties of undefined (reading 'trim')
        gameEl.attr("awayTeam", away);
        gameEl.attr("homeIcon", homeIcon);
        gameEl.attr("awayIcon", awayIcon);

        gameEl.click((event) => {
          
          navigate(
            event.currentTarget.attributes[0].value,
            event.currentTarget.attributes[1].value
          );
          $("#games").empty();
          getTeamStats(home, homeIcon);
          getTeamStats(away, awayIcon);
          displayGameInfo(gameDate, gameTime, gameLink);
          
        });
        selectBtnEl.css("float", "right");
        selectBtnEl.text("Select");

        //append
        $("#games").append(gameListEl);
        gameListEl.append(gameEl);
        gameEl.append(selectBtnEl);

        // adds game date to games page
        var gameDate = data._embedded.events[i].dates.start.localDate;
        gameEl.append(gameDate);
      });
    });
}
```
This code performs two separate fetches to two different API endpoints and combines the objects retrieved.  

```
//This fetch request retrieves the 3 player stats for the selected NBA team
function bdlStatsApi(playerId, playerStatsType, favShortcut) {
  console.log("favShortcut", favShortcut);
  // console.log(playerId, '==========');
  var requestUrl = `https://www.balldontlie.io/api/v1/season_averages?player_ids[]=${playerId}`;

  fetch(requestUrl)
    .then((response) => {
      return response.json();
    })
    .then((stats) => {
      /*After the fetch for player stats is completed, a second fetch command and this passes
     the data from the first API request on to the second API request for names*/
      bdlNamesApi(playerId, stats.data[0], playerStatsType, favShortcut);
    });
}
// This function fetched the player names and combine player stats
function bdlNamesApi(playerId, playerStats, playerStatsType, favShortcut) {
    var requestUrl = `https://www.balldontlie.io/api/v1/players/${playerId}`;

    fetch(requestUrl)
    .then((response) => {
      return response.json();
    })
    .then((stats) => {
      // console.log(stats);
      //This method merges player stats from Fetch(bdlStatApi) with the stats from Fetch(bdlNamesApi)
      $.extend(playerStats, stats);
      console.log(playerStats)
      var allPlayerStats = allPlayerStats.push($.extend(playerStats, stats))
      console.log(allPlayerStats)
      //Passes player stats to the displayPlayerStats function
      if (playerStatsType == "short") {
        displayPlayerStats(getPlayerStats(playerStats));
      } else {
        if (favShortcut) {
          addLocalStorage(setPlayerProfile(playerStats));
          console.log("CORRECT IF CONDITION")
        } else {
          displayPlayerProfile(setPlayerProfile(playerStats));
        }
      }
    });
}

```

# **Testing User Acceptance** 

To test to ensure the code rendered the desired output I iterated a series of tests to ensure that all acceptance criteria were met and documented completion below:

1. WHEN I load the page I am presented with clickable boxes that correspond to the 30 NBA teams.  I also see three navigation buttons to search players, view favorite platers and home.

 - **Completed**.  The page loads with a grid of 30 teams that are clickable.  There is also a nav bar that includes Home, Search and Favorites. 

2. WHEN I click a team I am presented with a list of upcoming games for my team with the opponent and the date of the game.  These games are clickable.

 - **Completed**.  When a team is selected, a list of current games is presented that are clickable.

3. WHEN I click a game, I am presented with the current season averages of three players on both the team I selected and the opponent.  I am also present with a clickable button that sends me to TicketMaster where I can purchase tickets to my selected game.  

 - **Completed**.  When a team is selected data for 3 players is presented and a button that is linked to the TicketMaster.com.   

4. WHEN I view any page I see a navigation buttons for Home, Search Players and Favorites.  

 - **Completed**.  On ever page there is a Home, Search and Favorites nav buttons.   

5. WHEN i click the Home button I am directed back to the home page. 

 - **Completed**.  The Home button always returns to the home page.  

6. WHEN I click the Search button a modal is displayed so I can select an NBA team and enter a player's name and hit submit.  When I hit submit, if a player is found in our API, player information and player statistics are displayed in the modal.  From there, I can also add the player and associated information and statistics to localStorage for retrieval later.  

 - **Completed**.  The modal appears that prompts the user to enter a player name and select a team.  If a player is found, the player profile is  displayed.  

7. WHEN i click the Favorites button I am directed to a page that has the players that I have searched previously, along with their information and statistics. 

 - **Completed**.  The favorites page appears when the button is selected.  

# **Other Project Requirements** 

| Other Requirements  | Resolution/ Comments   | 
| ------------- |:-------------| 
| 1. Must use a CSS framework other than Bootstrap | Met. We used UI Kit |
| 2. Must be Deployed (GitHub Pages) | Met.  Our site has been deployed on GitHub pages |
| 3. Must be interactive (i.e: accept and respond to user input)  | Met. We have two main user input that contain responses from our javaScript and APIS.  Search Games by Team and Search Player Information and Statistic |
| 4. Must have User Input Validation | Pending |
| 5. Must use at least two server-side APIs | Met.  We have used TicketMaster.com and BallDontLie.io |
| 6. Must have some sort of repeating element (table, columns, etc) | Met.  Our game listing and player statistics information utilize repeating elements |
| 7. Does not use alerts, confirms, or prompts (use modals). | Met. We used a modal to allow the user to search for player information and statistics |
| 8. Must utilize at least one new library or technology that we haven’t discussed | Met.  We used UI Kit |
| 9. Must have a polished frontend / UI | Pending. |
| 10. Must meet good quality coding standards (indentation, scoping, naming) | Met.  We have formatted our code according to quality coding standards |
| 11. Be responsive. | Met. Inputs are responded to |
| 12. Use client-side storage to store persistent data. | Met. We save favorite player information and statistics in localStorage.|
| 13. Have a clean repository that meets quality coding standards (file structure, naming conventions, follows best practices for class/id naming conventions, indentation, quality comments, etc.). | Met.  We have employed standard conventions for structure, naming conventions, class/is and indentations |
| 14. Must utilize Git Branching / Merging. Git Branches based on Feature Built / GitHub Project Card, minimum of 30 meaningful commits per contributor. | Partial Met/ Met. We used branching and made several quality commits. |
| 15. Have a quality README (with unique name, description, technologies used, screenshot, and link to deployed application). | Pending. |

# **Technology Used and Credits**

| Technology Used | Resource URL | 
| ------------- |:-------------| 
| Git | [https://git-scm.com/](https://git-scm.com/) |   
| HTML | [https://developer.mozilla.org/en-US/docs/Web/HTML](https://developer.mozilla.org/en-US/docs/Web/HTML) | 
| CSS | [https://developer.mozilla.org/en-US/docs/Web/CSS](https://developer.mozilla.org/en-US/docs/Web/CSS) |   
| JavaScript | [https://developer.mozilla.org/en-US/docs/Learn/JavaScript](https://developer.mozilla.org/en-US/docs/Learn/JavaScript) |
| UI Kit | [https://getuikit.com/docs/introduction](https://getuikit.com/docs/introduction) |
| jQuery API | [https://api.jquery.com/](https://api.jquery.com/) |
| Web APIs | [https://developer.mozilla.org/en-US/docs/Web/API](https://developer.mozilla.org/en-US/docs/Web/API) |


# **About the Authors**

**Troy Johnson**

- [GitHub Repos](https://github.com/troynj)

**Daniele Bensan** 

- [GitHub Repos](https://github.com/DBBENSAN)

**Brad Coleman**

- [Linkedin Profile](https://www.linkedin.com/in/brad-coleman-109529/)
- [GitHub Repos](https://github.com/bradcoleman60?tab=repositories)


# **License**

MIT License

Copyright (c) 2022 Brad Coleman

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.



