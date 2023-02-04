import puppeteer from "puppeteer";
import * as http from "http";
import url from "url";

var amountToGenerate = 10;
var wordCount = 2;
var wordLength = 4;
var scrapedWords = [];
var amountAvailable = 0;

const server = http
    .createServer((req, res) => {
        const reqUrl = url.parse(req.url).pathname;
        const queryObject = url.parse(req.url, true).query;
        if (
            req.method == "GET" &&
            reqUrl == "/" &&
            queryObject.amount != null &&
            queryObject.count !== null &&
            queryObject.wlength !== null
        ) {
            amountToGenerate = queryObject.amount;
            wordCount = queryObject.count;
            wordLength = queryObject.wlength;

            function generateUsername(wordCount) {
                var finalUsername = "";
                for (let i = 0; i < wordCount; i++) {
                    finalUsername =
                        finalUsername +
                        scrapedWords[
                            Math.floor(Math.random() * scrapedWords.length)
                        ];
                }
                return finalUsername;
            }

            (async () => {
                const browser = await puppeteer.launch({ headless: true });
                const page = await browser.newPage();

                // Grab list of random words

                await page.goto(
                    "http://www.mieliestronk.com/corncob_lowercase.txt"
                );
                const body = await page.$("body");
                const listOfWords = await body.evaluate((el) => el.textContent);

                const arrayOfWords = listOfWords.split("\n");

                function addToList(word) {
                    if (word.length <= wordLength) {
                        scrapedWords.push(word);
                    }
                }
                arrayOfWords.forEach(addToList);

                // Generate 5 2-word usernames

                for (let i = 0; i < amountToGenerate; i++) {
                    var username = generateUsername(wordCount);

                    // Check for username availability on Roblox
                    await page.goto(
                        "https://www.roblox.com/search/users?keyword=" +
                            username,
                        { waitUntil: "networkidle0" }
                    );

                    var robloxName = await page.$("div.avatar-card-label");
                    if (robloxName !== null) {
                        var rawRobloxName = await page.evaluate(
                            (el) => el.textContent,
                            robloxName
                        );

                        //console.log("Roblox results: " + rawRobloxName.slice(1))
                        if (
                            rawRobloxName.toLowerCase().trim().slice(1) !==
                            username.toLowerCase()
                        ) {
                            res.write("Username available: " + username + '\n');
                            amountAvailable += 1;
                        } else {
                            res.write("Username taken: " + username + '\n');
                        }
                    } else {
                        res.write("Username available: " + username + '\n');
                        amountAvailable += 1;
                    }
                }
                res.write(
                    "\n\nNames available: " +
                        amountAvailable +
                        "/" +
                        amountToGenerate
                );
                await browser.close();
                res.end('\n\nResponse status: 200')
            })();
        }
    })
    .listen(8080);
