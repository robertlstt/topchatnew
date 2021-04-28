// import "./styles.css";

// Provide your token, username and channel. You can generate a token here:
// https://twitchtokengenerator.com
const username = undefined;
const token = undefined;

let chat;

const streamerEntryForm = document.getElementById('streamerEntryForm')
streamerEntryForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const streamerName = document.getElementById('streamerEntry');
  if (chat) {
    chat.disconnect();
    app.innerHTML = '';
  }
  run(streamerName.value);

});

const { Chat } = window.TwitchJs;

const chatDiv = document.getElementById("chat");

let chatters = {};
let chatMessages = [];
let subscribed = [];
let gifted = [];
let mod = [];
let filterIds = new Set;




// function makeFilter(name) {
//   const nameSlider = document.getElementById('[name]Slider');
//   const nameBox = document.getElementById('[name]Box');
//   const nameCheck = document.getElementById('[name]Check');
// }

// makeFilter(sub)

const subSlider = document.getElementById('subSlider')
const subBox = document.getElementById('subBox')
const subCheck = document.getElementById('subCheck')

subSlider.addEventListener('change', () => {
  subBox.value = subSlider.value;
  subscribed = filterBy('subLength', subSlider.value, chatters);
  if (subCheck.checked == 1) {
    filterIdList(subscribed, gifted, mod);
    redrawMessages(chatMessages, filterIds);
  }
});


subBox.addEventListener('change', () => {
  let subBoxValue = parseInt(subBox.value);
  if (!isNaN(subBoxValue)) {
    subSlider.value = subBoxValue;
    subscribed = filterBy('subLength', subSlider.value, chatters);
    if (subCheck.checked == 1) {
      filterIdList(subscribed, gifted, mod);
      redrawMessages(chatMessages, filterIds);
    }
  }
});

subCheck.addEventListener('change', () => {
  subscribed = filterBy('subLength', subSlider.value, chatters);
  if (subCheck.checked == 0) {
    subscribed = [];
  }
  filterIdList(subscribed, gifted, mod);
  redrawMessages(chatMessages, filterIds);
});



const giftSlider = document.getElementById('giftSlider')
const giftBox = document.getElementById('giftBox')
const giftCheck = document.getElementById('giftCheck')

giftSlider.addEventListener('change', () => {
  giftBox.value = giftSlider.value;
  gifted = filterBy('gift', giftSlider.value, chatters);
  if (giftCheck.checked == 1) {
    filterIdList(subscribed, gifted, mod);
    redrawMessages(chatMessages, filterIds);
  }
});

giftBox.addEventListener('change', () => {
  let giftBoxValue = parseInt(giftBox.value);
  if (!isNaN(giftBoxValue)) {
    giftSlider.value = giftBoxValue;
    gifted = filterBy('gift', giftSlider.value, chatters);
    if (giftCheck.checked == 1) {
      filterIdList(subscribed, gifted, mod);
      redrawMessages(chatMessages, filterIds);
    }
  }
});

giftCheck.addEventListener('change', () => {
  gifted = filterBy('gift', giftSlider.value, chatters);
  if (giftCheck.checked == 0) {
    gifted = [];
  }
  filterIdList(subscribed, gifted, mod);
  redrawMessages(chatMessages, filterIds);
});




const modCheck = document.getElementById('modCheck')
modCheck.addEventListener('change', () => {
  mod = filterBy('mod', 1, chatters);
  if (modCheck.checked == 0) {
    mod = [];
  }
  filterIdList(subscribed, gifted, mod);
  redrawMessages(chatMessages, filterIds);
});




const run = async (channel) => {
  chat = new Chat({
    username,
    token,
    log: { level: "warn" }
  });
  chat.on("*", (message) => {

    //function to check messages to see if they work,
    //if false, return

    // console.log(message)
    splitBadge(message);

    newChatter(chatters, message);

    newPrivateMessage(chatMessages, message);
    // if(message.event != "PRIVMSG"){

    if (subCheck.checked == 1) {
      subscribed = filterBy('subLength', subSlider.value, chatters);
    } else { subscribed = []; }

    if (giftCheck.checked == 1) {
      gifted = filterBy('gift', giftSlider.value, chatters);
    } else { gifted = []; }

    if (modCheck.checked == 1) {
      mod = filterBy('mod', 1, chatters);
    } else { mod = []; }

    filterIdList(subscribed, gifted, mod);

    appendMessage(message, filterIds);

    // console.log(filterIds.length, chatters);
    // if (chatMessages.length > 10) {
    // redrawMessages(chatMessages, filterIds);
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

// run();
