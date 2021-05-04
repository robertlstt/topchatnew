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

function makeFilter({ type, filterFor, filterName, min, max, step, start, blop }, onChange) {

    const filterDiv = document.createElement('div');
    const checkBox = document.createElement('input');
    const fName = document.createElement('span');


    filterDiv.appendChild(checkBox);
    filterDiv.appendChild(fName);

    filterDiv.className = 'checkboxouter';
    checkBox.type = 'checkbox'
    fName.innerText = filterName;

    if (type === 0) {
        const inputBox = document.createElement('input');
        const slider = document.createElement('input');
        filterDiv.appendChild(inputBox);
        filterDiv.appendChild(slider);
        inputBox.style.width = '29px';
        inputBox.value = start;
        slider.type = 'range';
        slider.min = min;
        slider.max = max;
        slider.step = step;
        slider.value = start;

        slider.addEventListener('change', () => {
            inputBox.value = slider.value;
            onChange(checkBox.checked, parseInt(slider.value));
        });


        inputBox.addEventListener('change', () => {
            let value = parseInt(inputBox.value);
            if (!isNaN(value)) {
                slider.value = inputBox.value;
                onChange(checkBox.checked, parseInt(slider.value));
            }
        });

        checkBox.addEventListener('change', () => {
            onChange(checkBox.checked, parseInt(slider.value));
        });
    }
    if (type === 1) {
        checkBox.addEventListener('change', () => {
            onChange(checkBox.checked, 1);
        })
    }
    return filterDiv;
}

// function makeFilter({ type, filterName, min, max, step, start, blop }, onChange)
const Filters = [
    { type: 0, filterFor: 'subLength', filterName:' Sub Length ' ,min: 1, max: 60, step: 1, start: 6 },
    { type: 0, filterFor: 'gift', filterName: ' Gifted Subs ',min: 5, max: 150, step: 5, start: 5 },
    { type: 0, filterFor: 'bits', filterName: ' Bit Badge ',min: 100, max: 5000, step: 100, start: 100 },
    { type: 1, filterFor: 'mod', filterName: ' Mod '}
];

const usersByFilterName = {};

Filters.forEach(Filter => {
    const onChange = (checked, value) => {
        Filter.checked = checked;
        Filter.value = value
        if (checked) {
            usersByFilterName[Filter.filterFor] = filterBy(Filter.filterFor, value, chatters);
        } else {
            usersByFilterName[Filter.filterFor] = [];
        }
        filterIdList(Object.values(usersByFilterName));
        redrawMessages(chatMessages, filterIds);
    };
    document.getElementById('filters').appendChild(makeFilter(Filter, onChange));
})

const run = async (channel) => {
    chat = new Chat({
        username,
        token,
        log: { level: "warn" }
    });
    chat.on("*", (message) => {

        splitBadge(message);

        newChatter(chatters, message);

        newPrivateMessage(chatMessages, message);

        Filters.forEach(Filter => {
            if (Filter.checked) {
                usersByFilterName[Filter.filterFor] = filterBy(Filter.filterFor, Filter.value, chatters);
            } else {
                usersByFilterName[Filter.filterFor] = [];
            }
            filterIdList(Object.values(usersByFilterName));
        })

        appendMessage(message, filterIds);

        // message.event "CHEER"
        // const event = message.event || message.command;
        // const receiver = message.parameters.recipientDisplayName;
        // message.event == "SUBSCRIPTION" || message.event == "RESUBSCRIPTION"  || message.event == "SUBSCRIPTION_GIFT"
    })
    await chat.connect();
    const Connecting = document.createElement('span');
    Connecting.innerText = 'Connecting....'
    app.appendChild(Connecting);
    chatMessages = [];
    await chat.join(channel);

};

// run();