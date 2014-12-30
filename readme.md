# fantasy-league-service

The api layer collects data from fantasy.premierleague.com

## Set up

	$ npm install
	$ grunt
	
## End points

The different endpoints available for the application.

### Fixtures

	/fantasy/fixtures/gameweek

Will return the latest gameweek fixtures.

	/fantasy/fixtures/gameweek/:int

Set the gameweek you want to look up (normally 1-38) then it will return either the fixtures or the result.

## Leagues

	/fantasy/league/:int/overview

Return the league name, teams and their positional data.

## Manager

	/fantasy/manager/:int/overview

Return an overview of the managers career, team name, value, leagues, points and season history.

	/fantasy/manager/:int/transfers

Return an indepth look into the managers transfer history for the current season.

	/fantasy/manager/:int/gameweek/:int

Return all the information about a managers team for a selected gameweek, includes each players performance breakdown.

## Premier league

	/fantasy/premier-league/form/all

Get the form chart of the premier league and also the teams current league position.