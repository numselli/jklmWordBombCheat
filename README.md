# jklmWordBombCheat

## I do not condone cheating, please do not use it in public games.
I made this for use in private games to mess with friends. 

## To run:
1. Clone this repo 
2. Run `npm i` in the dir
3. edit the top of `index.mjs`
    1. edit `gameID` to the game id, can be found in the url of the game
    2. set `userName` to your desired username
    3. set `userToken` to your user token, to get this open up word bomb, open inspect element (network tab, filter to ws), join a game, look at the ws messages, find one starting with `420["joinRoom` and you should see `userToken` copy that value. 
4. Run `node index.mjs`
