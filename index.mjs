import WebSocket from 'ws';

const min = 1;
const max = Infinity;

const gameID = "JWJP";
const userName = "UserName";
const userToken = "UserToken";

const wordListRaw = await fetch("https://random-word-api.herokuapp.com/all?lang=en");
const wordListJSON = await wordListRaw.json();
const library = wordListJSON.filter((el) => el.length >= min && el.length <= max);

// phoenix
const ws = new WebSocket('wss://falcon.jklm.fun/socket.io/?EIO=4&transport=websocket', {
  perMessageDeflate: false
});

const usedWords = [];
let userid;

const newWord = data => library.find((el) => el.toLowerCase().includes(data[2]) && !usedWords.includes(el));
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const extractJSON = async data => {
    try {
        return await JSON.parse(data.replace(/^[0-9]+/g, ''));
    } catch (error) {
        return {};
    }
}

const sendWord = async data => {
    await sleep(500);
    let letters = data.split("");
    let string = '';
    
    letters.map(async (letter, index)=>{
        string+=letter;
        ws.send(`42["setWord","${string}", ${index === (letters.length-1)}]`);
        await sleep(500);
    })
}

ws.on("message", async d =>{
    const data = d.toString();
    const jsonData = await extractJSON(data);
    if (Object.keys(jsonData).length === 0) return;

    if (data[0] === "0") return ws.send("40");
    if (data[0] === "4" && data[1] === "0") return ws.send(`42["joinGame","bombparty","${gameID}","${userToken}"]`);
    if (jsonData[0] === "setup") return ws.send(`42["joinRound"]`);
    if (jsonData[0] === "addPlayer" && jsonData[1].profile.nickname === userName) return userid = jsonData[1].profile.peerId;
    if (data[0] === "2") return ws.send("3");

    if (Object.keys(jsonData).length === 0) return;
    
    if (jsonData[0] === "setMilestone") {
        return sendWord(newWord(jsonData[1].syllable));
    }
    if (jsonData[0] === "nextTurn" && jsonData[1] == userid) {
        sendWord(newWord(jsonData));
    }
})
