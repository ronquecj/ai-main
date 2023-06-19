'use strict';




class SpeakUtils {
  constructor() {}

  speak(sentence) {
    document
      .querySelector('.stop-generating')
      .classList.remove('hidden');

    const text_speak = new SpeechSynthesisUtterance(sentence);
    let senLen = sentence.length

    text_speak.rate = 2;
    text_speak.pitch = 1;
    text_speak.voice = window.speechSynthesis.getVoices().filter(voice => voice.name === "Microsoft Hazel").pop();

    window.speechSynthesis.speak(text_speak);

    const n = senLen * .65;
    console.log(n * 75)

    setTimeout(() => {
      document
        .querySelector('.stop-generating')
        .classList.add('hidden');
    }, n * 95);
  }
  speakB(sentence) {
    document
      .querySelector('.stop-generating')
      .classList.remove('hidden');

    const text_speak = new SpeechSynthesisUtterance(sentence);

    text_speak.rate = 2;
    text_speak.pitch = 1;
    text_speak.voice = window.speechSynthesis.getVoices().filter(voice => voice.name === "Microsoft Hazel").pop();

    window.speechSynthesis.speak(text_speak);

  }
}

export default SpeakUtils;