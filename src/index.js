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


function makeSliderFilter(filterName, min, max, step, start, blop, onToggle, onChange) {

  const filterDiv = document.createElement('div');
  const checkBox = document.createElement('input');
  const fName = document.createElement('span');
  const inputBox = document.createElement('input');
  const slider = document.createElement('input');

  filterDiv.appendChild(checkBox);
  filterDiv.appendChild(fName);
  filterDiv.appendChild(inputBox);
  filterDiv.appendChild(slider);

  checkBox.type = 'checkbox';
  checkBox.className = 'boxClass';
  fName.innerText = filterName;
  inputBox.style.width = '25px';
  inputBox.value = start;
  slider.type = 'range';
  slider.min = min;
  slider.max = max;
  slider.step = step;
  slider.value = start;

  slider.addEventListener('change', () => {
    inputBox.value = slider.value;
    onChange(slider.value);
  });

  inputBox.addEventListener('change', () => {
    let value = parseInt(inputBox.value);
    if (!isNaN(value)) {
      slider.value = value;
      onChange(slider.value);
    }
  });



  return filterDiv;
}

function makeCheckFilter(filterName, blop, onToggle) {

  const filterDiv = document.createElement('div');
  const checkBox = document.createElement('input');
  const fName = document.createElement('span');

  filterDiv.appendChild(checkBox);
  filterDiv.appendChild(fName);

  checkBox.type = 'checkbox';
  checkBox.className = 'boxClass';
  fName.innerText = filterName;


  return filterDiv;
}


// makefilter (filterName, min, max, step, start, blop)
const Filters = [
  makeSliderFilter(' Length ', 1, 60, 1, 6, 0, () => { }, (value) => {
    subscribed = filterBy('subLength', subSlider.value, chatters);
    if (subCheck.checked == 1) {
      filterIdList(subscribed, gifted, mod);
      redrawMessages(chatMessages, filterIds);
    }
  }),

  makeSliderFilter(' Gifted Subs ', 5, 150, 5, 5, 0, 
  
  () => {
    gifted = filterBy('gift', giftSlider.value, chatters);
    if (giftCheck.checked == 0) {
      gifted = [];
    }
    filterIdList(subscribed, gifted, mod);
    redrawMessages(chatMessages, filterIds);
   },
  
  
  (value) => {
    gifted = filterBy('gift', giftSlider.value, chatters);
    if (giftCheck.checked == 1) {
      filterIdList(subscribed, gifted, mod);
      redrawMessages(chatMessages, filterIds);
    }
  }),

  makeCheckFilter(' Mod ', 0),
]

Filters.forEach(Filter => document.getElementById('filters').appendChild(Filter))

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
