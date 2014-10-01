[ ![Codeship Status for thearegee/fantasy-football-service](https://www.codeship.io/projects/e13fce40-2b75-0132-8128-0ebbb5ae3d93/status)](https://www.codeship.io/projects/38552)

# fantasy-league-service

## ABOUT

A simple service to collect a fantasy.premierleague.com league table.

## Set up

Install npms

    $ npm install

## RUN

	$ grunt

## API

## League

	/fantasy/league/:leagueCode/:responseType

- leagueCode: Enter the league code found in the URL - http://fantasy.premierleague.com/my-leagues/:leagueCode/standings/
- responseType: return the data in three different ways, api, html, gecko

## Manager

	/fantasy/league/:teamCode/overview

- teamCode: Enter the team code found in the URL - http://fantasy.premierleague.com/entry/:teamCode/history/
- responseType: currently only support overview