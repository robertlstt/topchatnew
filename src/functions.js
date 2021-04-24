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

function newPrivateMessage(chatMessages, message) {
    if (message.event == "PRIVMSG") {
        if (chatMessages.length > 500) {
            chatMessages.shift();
        }
        chatMessages.push({
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

function filterBy(filter, x, chatters) {
    const myarr = [1];
    for (const userId in chatters) {
        if (Number(chatters[userId][filter]) >= x) {
            myarr.push(chatters[userId].id);
        }
    }
    return myarr
};

function filterIdList(...args) {
    filterIds = []
    filterIds = Array.from(new Set(filterIds.concat(...args))); return
    console.log(filterIds); return
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
        } else if(filterIds == 0) {
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

function redrawMessages(chatMessages, filterIds) {
    app.innerHTML = '';
    for (i = 0; i < chatMessages.length; i++) {
        if (filterIds.includes(chatMessages[i].id) == 1) {
            const appMessage = document.createElement('div');
            const nameSpan = document.createElement('span');
            const messageText = document.createElement('span');

            app.appendChild(appMessage)

            nameSpan.innerText = chatMessages[i].displayName;
            nameSpan.style.color = chatMessages[i].color;
            appMessage.appendChild(nameSpan);

            messageText.innerText = ': ' + chatMessages[i].message || "";
            appMessage.appendChild(messageText);
        }
        else if (filterIds.length == 0) {
            const appMessage = document.createElement('div');
            const nameSpan = document.createElement('span');
            const messageText = document.createElement('span');

            app.appendChild(appMessage)

            nameSpan.innerText = chatMessages[i].displayName;
            nameSpan.style.color = chatMessages[i].color;
            appMessage.appendChild(nameSpan);

            messageText.innerText = ': ' + chatMessages[i].message || "";
            appMessage.appendChild(messageText);

        }
    } return
};