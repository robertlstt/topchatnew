// import "./styles.css";

// Provide your token, username and channel. You can generate a token here:
// https://twitchtokengenerator.com
const username = undefined;
const token = undefined;


const streamerEntry = document.getElementById('streamerEntry')
streamerEntry.addEventListener('change', () => {
  //  channel = streamerEntry.value;
});
let channel = "timthetatman";

const { Chat } = window.TwitchJs;

const app = document.getElementById("app");

const appMessage = document.createElement('div');
app.appendChild(appMessage);

const chatDiv = document.getElementById("chat");

let chatters = {};
let chatMessage = [];
let subscribed = [];
let gifted = [];
let mod = [];
let filterIds = []





const subSlider = document.getElementById('subSlider')
const subBox = document.getElementById('subBox')
const subCheck = document.getElementById('subCheck')

subSlider.addEventListener('change', () => {
  subBox.value = subSlider.value;
  subscribed = [];
  filterBy('subLength', subscribed, subSlider.value, chatters);
  if (subCheck.checked == 1) {
    filterIdList(subscribed, gifted, mod);
    redrawMessages(chatMessage, filterIds);
  }
});

subBox.addEventListener('change', () => {
  let subBoxValue = parseInt(subBox.value);
  if (!isNaN(subBoxValue)) {
    subSlider.value = subBoxValue;
    subscribed = [];
    filterBy('subLength', subscribed, subSlider.value, chatters);
    if (subCheck.checked == 1) {
      filterIdList(subscribed, gifted, mod);
      redrawMessages(chatMessage, filterIds);
    }
  }
});

subCheck.addEventListener('change', () => {
  console.log(subCheck.checked);
    subscribed = [];
    filterBy('subLength', subscribed, subSlider.value, chatters);
    if (subCheck.checked == 0){
      subscribed = [];
    }
    filterIdList(subscribed, gifted, mod);
    redrawMessages(chatMessage, filterIds);
});



const giftSlider = document.getElementById('giftSlider')
const giftBox = document.getElementById('giftBox')
const giftCheck = document.getElementById('giftCheck')

giftSlider.addEventListener('change', () => {
  giftBox.value = giftSlider.value;
  gifted = [];
  filterBy('gift', gifted, giftSlider.value, chatters);
  if (giftCheck.checked == 1) {
    filterIdList(subscribed, gifted, mod);
    redrawMessages(chatMessage, filterIds);
  }
});

giftBox.addEventListener('change', () => {
  let giftBoxValue = parseInt(giftBox.value);
  if (!isNaN(giftBoxValue)) {
    giftSlider.value = giftBoxValue;
    gifted = [];
    filterBy('gift', gifted, giftSlider.value, chatters);
    if (giftCheck.checked == 1) {
      filterIdList(subscribed, gifted, mod);
      redrawMessages(chatMessage, filterIds);
    }
  }
});

giftCheck.addEventListener('change', () => {
  console.log(giftCheck.checked);
  gifted = [];
  filterBy('gift', gifted, giftSlider.value, chatters);
  if (giftCheck.checked == 0){
    gifted = [];
  }
  filterIdList(subscribed, gifted, mod);
  redrawMessages(chatMessage, filterIds);
});




const modCheck = document.getElementById('modCheck')
modCheck.addEventListener('change', () => {
  console.log(modCheck.checked);
  mod = [];
  filterBy('mod', mod, 1, chatters);
  if (modCheck.checked == 0){
    mod = [];
  }
  filterIdList(subscribed, gifted, mod);
  redrawMessages(chatMessage, filterIds);
});




const run = async () => {
  const chat = new Chat({
    username,
    token,
    log: { level: "warn" }
  });
  console.log("here");
  chat.on("*", (message) => {

//function to check messages to see if they work,
//if false, return

    console.log(message)
    splitBadge(message);

    newChatter(chatters, message);

    newPrivateMessage(chatMessage, message);
    // if(message.event != "PRIVMSG"){

    if (subCheck.checked == 1) {
      subscribed = [];
      filterBy('subLength', subscribed, subSlider.value, chatters);
    } else { subscribed = []; }

    if (giftCheck.checked == 1) {
      gifted = [];
      filterBy('gift', gifted, giftSlider.value, chatters);
    } else { gifted = []; }

    if (modCheck.checked == 1) {
      mod = [];
      filterBy('mod', mod, 1, chatters);
    } else { mod = []; }

    filterIdList(subscribed, gifted, mod);

    appendMessage(message, filterIds);

    // console.log(filterIds.length, chatters);
    // if (chatMessage.length > 10) {
    // redrawMessages(chatMessage, filterIds);
    // }


    // message.event "CHEER"
    // message.tags.bits
    // const time = new Date(message.timestamp).toTimeString();
    // const event = message.event || message.command;
    // const channel = message.channel;
    // const msg = message.message || "";
    // const name = message.tags.displayName;
    // const receiver = message.parameters.recipientDisplayName;
    // const color = message.tags.color;
    // const gifted = message.tags.badges.subGifter;
    // const subscription = message.event;
    // message.event == "SUBSCRIPTION" || message.event == "RESUBSCRIPTION"  || message.event == "SUBSCRIPTION_GIFT"
  })
  await chat.connect();
  await chat.join(channel);
};

run();