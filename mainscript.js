// putting json into easily callable variable
import layouts from './json_stuff/layouts.json' assert {type: 'json'};
import dialouges from './json_stuff/dialogue.json' assert {type: 'json'};

// declaring variables
let body = document.querySelector("body");
let headTitle = document.querySelector("title");
let message_area = document.querySelector('.message-area');
let input_area = document.querySelector('.input-area');
let container = document.querySelector(".container");
let currentID = 0;
let previousID = 0;
let depth = 1;
let nextID = 0;
let ending_reached = false;

// declaring functions
function sleep(s) 
{
    return new Promise(resolve => setTimeout(resolve, (s*1000) ));
}

async function runScript(startat=0)
{
    currentID = startat;
    while (ending_reached != true)
    {
        // specific events before progressing
        switch(currentID)
        {
            case 0:
                await sleep(4);
                break;
            case 6:
                await sleep(3);
                break;
            case 14:
                await sleep(5);
                break;
            case 23:
                await sleep(3);
                break;
            case 27:
                await sleep(3);
                break;
            case 28:
                await sleep(3);
                break;
            case 93:
                await sleep(3);
                break;
            case 96:
                await sleep(4);
                await screenShake();
                console.log("Dude, you're alright?");
                break;
            case 98:
                await sleep(4);
                await screenShake(2, 2);
                break;
            case 124:
                await sleep(3);
                await screenShake(1, 2);
                console.log("It's alright. We're here for you.")
                await sleep(3);
                break;
            case 125:
                await sleep(2);
                break;
            case 0.9:
                await sleep(3);
                break;
        }

        // after the specific events, continue story
        if (currentID > 1 && getTheThing(previousID).Type != "choice")
        {
            if (depth == 1 || depth == 2 || depth == 3)
            { 
                await sleep(4); 
            }
            else if (currentID == 96 || currentID == 98)
            {}
            else 
            {
                await sleep(2.5);
            }
        }
        await progressStory(currentID);
    }
    
}

function progressStory(id) // depth and id where you want to bring out the message (increase/reset depth & id first, then we use progressStory)
{
    return new Promise(async endProgram => {

        // noting previous ID
        previousID = id;

        // get the whole message data
        let the_thing = getTheThing(currentID);

        if (the_thing.Type == "dialogue")
        {
            // check for depth change
            if (the_thing.DepthChange == true)
            {
                depth++;
                await changeLayout(depth);
            }

            handleDialogue(the_thing);
            currentID = the_thing.NextID;
        }
        else if (the_thing.Type == "choice")
        {
            let options = the_thing.Options;
            await handleChoice(options);
        }
        else if (the_thing.Type == "ending") 
        {
            handleEnding(the_thing);
            ending_reached = true;
            return endProgram();
        }

        endProgram();

    });
}


function getTheThing(id)
{
    return dialouges.filter(dialogue => dialogue.ID == id)[0];
}


async function handleChoice(options)
{
    return new Promise(async choiceHandled => 
        {
            input_area = document.querySelector('.input-area');
            input_area.innerHTML = "";

            // create and add options
            for (let option of options)
            {
                input_area = document.querySelector('.input-area');
                let newoption = createChoice(option.Class, option.Text, option.NextID);
                input_area.innerHTML += newoption;
            }
            await sleep(0.5);

            // addEventListener and wait for answer
            let all_options = document.querySelectorAll(".option")
            nextID = 0;
            addClickers(all_options);

            // remove options
            input_area = document.querySelector('.input-area');
            //setTimeout(() => {console.log("bruh you're so indecisive. Imma just break the program")}, 864000000);
            await forAnswer();

            currentID = nextID;
            input_area.innerHTML = "";
            choiceHandled();
        });
}


function handleDialogue(dialogue)
{
    message_area = document.querySelector('.message-area');
    let message = createMessage(dialogue);

    message_area.innerHTML += message;
    message_area.scrollTo(0, message_area.scrollHeight);
}


async function handleEnding(ending)
{

    // change to ending page
    if (ending.ID == 0.9)
    {
        await changeLayout(0.01, true);
    }
    else
    {
        await changeLayout(0, true);
    }

    // refresh all the things needed to be refreshed
    headTitle = document.querySelector("title");
    body = document.querySelector("body");

    // check for exceptions
    if (ending.ID == 0.9)
    {
        headTitle.innerHTML = "The Beginning";
        body = document.querySelector("body");
        let notebutton = document.getElementById("notes");
        notebutton.addEventListener("click", () => changeLayout(402))
    }

    // write ending text
    document.getElementById("endingtext").innerHTML = ending.Text;

    ending_reached = true;
}


function createChoice(type, text, nextID)
{
    return `<button class='${type}' value='${nextID}'>${text}</button>`;
}


function createMessage(dialogue) 
{
    return `<li class='entry ${dialogue.Speaker}'>
                <p class='name'>${dialogue.SpeakerName}</p>
                <p class="message">${dialogue.Text}</p>
            </li>`;
}


function addClickers(options) 
{
    for (let option of options) 
    {
        let answer = option.value;
        option.addEventListener("click", () => nextID = answer);
        if (option.classList == "option eject")
        {
            option.addEventListener("mouseover", () => option.innerHTML = "INJECT");
            option.addEventListener("mouseout", () => option.innerHTML = "EJECT");
        }
    }
    if (currentID == 67)
    {
        let thoughtoption = document.querySelector(".thought");
        let thoughtanswer = thoughtoption.value;
        thoughtoption.addEventListener("click", () => nextID = thoughtanswer);
    }
}


function forAnswer()
{
    return new Promise(answered =>
    {
        let waiting = setInterval(() => 
        {
            if (nextID != 0)
            {
                clearInterval(waiting);
                answered();
            }
        }, 1000);
    });
}


function changeLayout(depth, fade=false) 
{
    return new Promise(async changed =>
    {

        if (fade)
        {
            body.innerHTML += layouts.filter(layout => layout.Depth == 10010)[0].Body;
            message_area = document.querySelector('.message-area');
            message_area.scrollTo(0, message_area.scrollHeight);
            headTitle.innerHTML = layouts.filter(layout => layout.Depth == 10010)[0].Title;
        }
        else if (!fade)
        {
            body.innerHTML = "";
            headTitle.innerHTML = "⠀";
        }

        if (currentID == 0.2)
        {
            await sleep(5);
        }

        await sleep(4);
        body.innerHTML = layouts.filter(layout => layout.Depth == depth)[0].Body;
        headTitle.innerHTML = layouts.filter(layout => layout.Depth == depth)[0].Title;
        changed();
    });
}

function screenShake(amount=1, intensity=1)
{
    return new Promise(async shakeDone => 
    {
        if (amount == 1)
        {
            container = document.querySelector(".container");
            container.classList.add(`screenshake${intensity}`);
            await sleep(0.5);
            container.classList.remove(`screenshake${intensity}`);
        }
        else if (amount == 2)
        {
        
            container = document.querySelector(".container");
            container.classList.add(`screenshake${intensity}`);
            await sleep(0.5);
            console.log("It's not your fault.");
            container.classList.remove(`screenshake${intensity}`);
            await sleep(1);
            container = document.querySelector(".container");
            container.classList.add(`screenshake${intensity}`);
            await sleep(0.5);
            console.log("You can talk to us, man.");
            container.classList.remove(`screenshake${intensity}`);
        }
        shakeDone();
    });
}


document.addEventListener('DOMContentLoaded', async function() 
{
    await changeLayout(depth);
    runScript();
});
