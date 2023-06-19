'use strict';




class SpeakUtils {
  constructor() {}

  speak(sentence) {
    document
      .querySelector('.stop-generating')
      .classList.remove('hidden');

    const text_speak = new SpeechSynthesisUtterance(sentence);
    
    text_speak.rate = 2;
    text_speak.pitch = 1;
    text_speak.voice = window.speechSynthesis.getVoices().filter(voice => voice.name === "Microsoft Hazel").pop();

    window.speechSynthesis.speak(text_speak);

    const n = sentence.length * .65;

    setTimeout(() => {
      document
        .querySelector('.stop-generating')
        .classList.add('hidden');
    }, n * 75);
  }
}

export default SpeakUtils;