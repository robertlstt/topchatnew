function splitBadge(message) {
    if (message.event == "PRIVMSG") {
        let sub = message.tags.badgeInfo;
        if (sub != "" || sub != undefined) {
            sub = sub.split(",").map(sub => sub.split('/'));
            for (i = 0; i < sub.length; i++) {
                let subCheck = sub[i]
                if (subCheck[0] == "subscriber") {
                    subNum = subCheck[1];
                } else {
                    subNum = 0; return
                }
            }
        } else {
            subNum = 0; return
        }
    }
};

function newChatter(chatters, message) {
    if (!chatters[message.tags.userId]) {
        chatters[message.tags.userId] = {
            id: message.tags.userId,
            displayName: message.tags.displayName,
            color: message.tags.color,
            gift: message.tags.badges.subGifter,
            subLength: subNum,
            mod: message.tags.mod
        }; return
    }
};

function newPrivateMessage(chatMessage, message) {
    if (message.event == "PRIVMSG") {
        if (chatMessage.length > 500) {
            chatMessage.shift();
        }
        chatMessage.push({
            id: message.tags.userId,
            color: message.tags.color,
            displayName: message.tags.displayName,
            event: message.event,
            messageTime: message.timestamp.toJSON(),
            message: message.message,
            messageLength: message.message.length
        }); return
    }
};

function filterBy(filter, array, x, chatters) {
    for (const userId in chatters) {
        if (chatters[userId][filter] >= x) {
            array.push(chatters[userId].id);
        }
    } return
};

function filterIdList(...args) {
    filterIds = []
    filterIds = Array.from(new Set(filterIds.concat(...args))); return
};

//if no one applies to filter, filter goes to 0, goes back to "normal" logic

function appendMessage(message, filterIds) {
    if (message.tags.displayName != undefined) {
        if (filterIds.includes(message.tags.userId) == 1) {
            const appMessage = document.createElement('div');
            const nameSpan = document.createElement('span');
            const messageText = document.createElement('span');

            app.appendChild(appMessage)

            nameSpan.innerText = message.tags.displayName;
            nameSpan.style.color = message.tags.color;
            appMessage.appendChild(nameSpan);

            messageText.innerText = ': ' + message.message || "";
            appMessage.appendChild(messageText);
        } else if (filterIds == 0) {
            const appMessage = document.createElement('div');
            const nameSpan = document.createElement('span');
            const messageText = document.createElement('span');

            app.appendChild(appMessage)

            nameSpan.innerText = message.tags.displayName;
            nameSpan.style.color = message.tags.color;
            appMessage.appendChild(nameSpan);

            messageText.innerText = ': ' + message.message || "";
            appMessage.appendChild(messageText);
        }

    } return
};

function redrawMessages(chatMessage, filterIds) {
    app.innerHTML = '';
    for (i = 0; i < chatMessage.length; i++) {
        if (filterIds.includes(chatMessage[i].id) == 1) {
            const appMessage = document.createElement('div');
            const nameSpan = document.createElement('span');
            const messageText = document.createElement('span');

            app.appendChild(appMessage)

            nameSpan.innerText = chatMessage[i].displayName;
            nameSpan.style.color = chatMessage[i].color;
            appMessage.appendChild(nameSpan);

            messageText.innerText = ': ' + chatMessage[i].message || "";
            appMessage.appendChild(messageText);
        } else if (filterIds.length == 0) {
            const appMessage = document.createElement('div');
            const nameSpan = document.createElement('span');
            const messageText = document.createElement('span');

            app.appendChild(appMessage)

            nameSpan.innerText = chatMessage[i].displayName;
            nameSpan.style.color = chatMessage[i].color;
            appMessage.appendChild(nameSpan);

            messageText.innerText = ': ' + chatMessage[i].message || "";
            appMessage.appendChild(messageText);

        }
    } return
};