'use strict';

import Draft from './models/Draft.js';
import Continue from './models/Continue.js';
import LocalStorage from './models/LocalStorage.js';
import History from './models/RenderHistory.js';
import LoadEvent from './utils/LoadEvent.js';
import SpeakUtils from './utils/SpeakUtils.js';
import ParentLimit from './utils/ParentLimit.js';

const btnSpeak = document.querySelector('.speak');
const aiResponseParent = document.querySelector('.response-parent');
const historyParent = document.querySelector(
  '.history-content-container'
);

const btnStop = document.querySelector('.stop-generating');

const draftCollections = [];
const continueCollections = [];
let greetings = 'Good';
let continueCounter = localStorage.length;
let questionCounter = localStorage.length;

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const speakUtil = new SpeakUtils();
const loadEvent = new LoadEvent(greetings);
const parentUtil = new ParentLimit(aiResponseParent);
const recognition = new SpeechRecognition();

loadEvent.load();

let storedHistory = [];
let orHis = {};
let historyDataStorage = [];

for (let n of Object.entries(localStorage)) {
  storedHistory.push(n);
}

const orderedHistory = storedHistory.sort(
  (a, b) => Number(a[0].slice(7)) - Number(b[0].slice(7))
);

orderedHistory.forEach((el) => {
  const [key, val] = el;
  Object.assign(orHis, { [`${key}`]: `${val}` });
});

for (let key of Object.values(orHis)) {
  const h = JSON.parse(key);
  const HISTORY = h.history;

  const historyData = new History(
    HISTORY.qNum,
    HISTORY.question,
    HISTORY.q,
    HISTORY.a,
    HISTORY.cont,
    historyDataStorage
  );

  historyData.getLocal();
  historyDataStorage.push(historyData);
}

btnSpeak.addEventListener('click', (e) => {
  e.preventDefault();
  recognition.start();
  recognition.timeout = 5000;

  recognition.onresult = (event) => {
    const current = event.resultIndex;
    const transcript = event.results[current][0].transcript;

    //#region --- api ---
    let data = JSON.stringify({
      q: `${transcript.toLowerCase()}`,
    });

    let config = {
      method: 'post',
      url: 'https://google.serper.dev/search/',
      headers: {
        'X-API-KEY': '71d9d549aeb814fa205100ed9fae50dbb9b603dd',
        'Content-Type': 'application/json',
      },
      data: data,
    };

    axios(config)
      .then((response) => {
        return response.data;
      })
      .then((data) => {
        if (
          transcript.includes('windows') ||
          transcript.includes('computer') ||
          transcript.includes('pc') ||
          transcript.includes('laptop') ||
          transcript.includes('windows') ||
          transcript.includes('virus') ||
          transcript.includes('malware') ||
          transcript.includes('chrome') ||
          transcript.includes('google') ||
          transcript.includes('email') ||
          transcript.includes('facebook') ||
          transcript.includes('gmail') ||
          transcript.includes('instagram') ||
          transcript.includes('twitter') ||
          transcript.includes('youtube') ||
          transcript.includes('corrupted') ||
          transcript.includes('drivers') ||
          transcript.includes('outdated') ||
          transcript.includes('system') ||
          transcript.includes('wifi') ||
          transcript.includes('internet') ||
          transcript.includes('connection') ||
          transcript.includes('blue') ||
          transcript.includes('screen') ||
          transcript.includes('blue-screen') ||
          transcript.includes('graphical') ||
          transcript.includes('error') ||
          transcript.includes('microsoft') ||
          transcript.includes('word') ||
          transcript.includes('excel') ||
          transcript.includes('powerpoint') ||
          transcript.includes('mobile') ||
          transcript.includes('phone') ||
          transcript.includes('tablet') ||
          transcript.includes('update') ||
          transcript.includes('ram') ||
          transcript.includes('power') ||
          transcript.includes('supply') ||
          transcript.includes('motherboard') ||
          transcript.includes('cpu') || // shift + alt + arrow down key
          transcript.includes('cpu') || // shift + alt + arrow down key
          transcript.includes('fix')
        ) {
          if (transcript.includes('time')) {
            parentUtil.limit();
            const time = new Date().toLocaleString(undefined, {
              hour: 'numeric',
              minute: 'numeric',
            });
            const aiResParent = document.querySelector(
              '.response-parent'
            );

            const aiResHTML = `
          <div class="response greet">
             <p class="question-ai">
             ${transcript.toUpperCase()}
             </p>
             <p class="answer">
             The current time right now is ${time}
             </p>
         </div>
          `;
            aiResParent.insertAdjacentHTML('beforeend', aiResHTML);
            speakUtil.speak(`The current time right now is ${time}`);
          } else if (transcript.includes('go offline')) {
            parentUtil.limit();
            const offline =
              'Maiden is shutting down... Closing window in a few second... Maiden going offline...';
            const aiResParent = document.querySelector(
              '.response-parent'
            );

            const aiResHTML = `
          <div class="response greet">
             <p class="question-ai">
             ${transcript.toUpperCase()}
             </p>
             <p class="answer">
             ${offline}
             </p>
         </div>
          `;
            aiResParent.insertAdjacentHTML('beforeend', aiResHTML);
            speakUtil.speak(offline);

            setTimeout(() => {
              document.querySelector('.maiden-link').click();
            }, 7000);
          } else if (transcript.includes('clear chat')) {
            const clearChat = 'Clearing things up for you...';
            const aiResParent = document.querySelector(
              '.response-parent'
            );

            const aiResHTML = `
          <div class="response greet">
             <p class="question-ai">
             ${transcript.toUpperCase()}
             </p>
             <p class="answer">
             ${clearChat}
             </p>
         </div>
          `;
            aiResParent.insertAdjacentHTML('beforeend', aiResHTML);
            speakUtil.speak(clearChat);

            setTimeout(() => {
              while (aiResponseParent.hasChildNodes()) {
                if (aiResponseParent.childElementCount == 0) {
                  return;
                }
                aiResponseParent.removeChild(
                  aiResponseParent.firstChild
                );
              }
            }, 3000);
          } else if (transcript.includes('continue')) {
            console.log(continueCollections);
            continueCounter -= 1;
            console.log(continueCounter);
            const continueTemplate = [
              ...continueCollections[continueCounter].previousData,
            ];

            parentUtil.limit();
            const result =
              'Here is another result for your previous question, ' +
              `${continueTemplate}`;
            const aiResParent = document.querySelector(
              '.response-parent'
            );

            const aiResHTML = `
          <div class="response greet">
             <p class="question-ai">
             ${transcript.toUpperCase()}
             </p>
             <p class="answer">
             ${result}
             </p>
         </div>
          `;
            aiResParent.insertAdjacentHTML('beforeend', aiResHTML);
            speakUtil.speak(`${result}`);
            continueCounter += 1;
          } else {
            const linkParent = document.querySelector(
              '.link-content-container'
            );

            while (linkParent.hasChildNodes()) {
              linkParent.removeChild(linkParent.firstChild);
            }

            const resultData = `${JSON.stringify(
              data.organic[0].snippet
            )}${JSON.stringify(
              data.organic[1].snippet
            )}${JSON.stringify(data.organic[2].snippet)}`;

            const linkStorage = [];

            data.organic.forEach((element) => {
              if (linkStorage.length < 10) {
                linkStorage.push(element.link);
              } else {
                return;
              }
            });

            const draft = new Draft(
              transcript.toUpperCase(),
              resultData,
              questionCounter,
              data.organic[0].link,
              linkStorage,
              draftCollections
            );

            const continueData = new Continue([
              JSON.stringify(data.organic[4].snippet),
              JSON.stringify(data.organic[5].snippet),
              JSON.stringify(data.organic[6].snippet),
            ]);

            draftCollections.push(draft);
            continueCollections.push(continueData);

            parentUtil.limit();

            if (historyParent.childElementCount > 9) {
              historyParent.removeChild(
                historyParent.firstElementChild
              );
            }

            draft.renderContentAI();
            draft.renderContentHistory();
            draft.renderContentLinks();

            const store = new LocalStorage(
              continueCounter + 1,
              transcript.toUpperCase(),
              transcript.toUpperCase(),
              resultData,
              data.organic[0].link
            );

            store.setLocal();
            continueCounter += 1;

            if (
              document.querySelector('.history-content-container')
                .childElementCount > 0
            ) {
              speakUtil.speak(resultData);
              setTimeout(() => {
                speakUtil.speakB(
                  'If you are still having problems, let me know'
                );
              }, 2500);
              questionCounter += 1;
            }
          }
        } else {
          const res =
            "As an AI model designed to provide solutions for software problems, I can't generate an answer to that problem.";

          const aiResParent = document.querySelector(
            '.response-parent'
          );

          const aiResHTML = `
          <div class="response greet" >
             <p class="question-ai" style="color: red !important">
             ${transcript.toUpperCase()}
             </p>
             <p class="answer">
             ${res}
             </p>
         </div>
          `;
          aiResParent.insertAdjacentHTML('beforeend', aiResHTML);
          speakUtil.speak(`${res}`);
        }
      })
      .catch((error) => {
        console.log(error);
      });
    //#endregion
  };
});

btnStop.addEventListener('click', (e) => {
  e.preventDefault();
  window.speechSynthesis.cancel();
});
