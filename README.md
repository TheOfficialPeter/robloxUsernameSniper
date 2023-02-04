# robloxUsernameSniper

This repository is a server-based roblox username sniper. It has to be run on a server becuase of the web scraping techniques.


## Installation

Firstly you need to have Puppeteer installed which you can do so [here](https://www.tutorialspoint.com/puppeteer/puppeteer_installation.htm).
Therafter you can download and extract the repository or download the `main.js` file.

## Using

To run the program use the `node [FILENAME]` command in terminal. It should look like:

`node main.js`

The server will start listening on port 8080 on your 'local' server/pc. Visit the ip of the machine you are running this on as follows:

`http://IPHERE:8080/?amount=10&count=2&wlength=5`

Typing the url you have different option as well. The first option is `amount` this is the amount of username you would like to generate. `count` is the amount of word that are used to create a username (default is 2 to keep it short). `wlength` is used to filter out the huge list of english words to use only the ones that are as long as you want (default is 4-5 to keep it short)
