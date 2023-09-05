/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useState, useEffect} from 'react';
import {
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import * as EmblaCore from '@mideind/embla-core';
import {PERMISSIONS, request} from 'react-native-permissions';

const BaseColors = {
  dark_bg: 'dimgray',
  light_bg: 'floralwhite',
  dark_emph: 'darkslategrey',
  light_emph: 'darksalmon',
  dark_fg: 'ghostwhite',
  light_fg: 'darkred',
};
// Ratatoskur instance to communicate with.
const RATATOSKUR_URL = 'http://192.168.1.208:8080';
// const RATATOSKUR_URL = 'https://api.greynir.is';
// Ratatoskur API key
const RATATOSKUR_API_KEY = '<your api key here>';
// If desired, custom implementation for requesting tokens from Ratatoskur
const customTokenFetcher = undefined;

async function reqPerms() {
  await request(
    Platform.OS === 'ios'
      ? PERMISSIONS.IOS.MICROPHONE
      : PERMISSIONS.ANDROID.RECORD_AUDIO,
  ).then(result => {
    console.log('Microphone permission status: ', result);
  });
}

function EmblaButton(): JSX.Element {
  useEffect(() => {
    EmblaCore.EmblaSession.prepare();
    return EmblaCore.RNAudioSetup();
  }, []);
  reqPerms();
  const isDarkMode = useColorScheme() === 'dark';
  const colors = {
    bg: isDarkMode ? BaseColors.dark_bg : BaseColors.light_bg,
    emph: isDarkMode ? BaseColors.dark_emph : BaseColors.light_emph,
    fg: isDarkMode ? BaseColors.dark_fg : BaseColors.light_fg,
  };

  // Output text from ASR
  const [asrText, setAsrText] = useState('<asr output>');
  // Answer to query
  const [answerText, setAnswer] = useState('<query answer>');

  // Keep track of whether session is active or not
  const [sessionActive, setSessionActive] = useState(false);
  let session: EmblaCore.EmblaSession | undefined;

  // Set up config for Embla
  let config = new EmblaCore.EmblaSessionConfig(
    customTokenFetcher,
    RATATOSKUR_URL,
  );
  config.apiKey = RATATOSKUR_API_KEY;
  console.log(config);

  config.onStartStreaming = () => {
    console.log('[ASR] Started streaming audio...');
    // Clear text when we start streaming audio
    setAsrText('');
    setAnswer('');
  };
  config.onSpeechTextReceived = (transcript, isFinal, data) => {
    console.log(
      `[ASR] Transcript: '${transcript}', isFinal: ${isFinal}, alternatives: ${data.alternatives}`,
    );
    setAsrText(transcript);
  };
  config.onStartQuerying = () => {
    console.log('[ASR] Stopped streaming audio.');
    console.log('[QUERY] Sending query...');
  };
  config.onQueryAnswerReceived = qanswer => {
    console.log(`[QUERY] Got query answer: ${qanswer.answer}`);
    if (qanswer.answer) {
      setAnswer(qanswer.answer);
    } else {
      setAnswer('[error, no text answer]');
    }
  };
  config.onStartAnswering = () => {
    console.log('[TTS] Reading answer...');
  };
  config.onDone = () => {
    console.log('Session finished.');
    setSessionActive(false);
  };
  config.onError = error => {
    console.log(`ERROR: ${error}`);
    setSessionActive(false);
  };

  async function toggleSession() {
    if (sessionActive && session !== undefined) {
      await session.stop();
      setSessionActive(false);
      session = undefined;
    } else {
      session = new EmblaCore.EmblaSession(config);
      setSessionActive(true);
      await session.start();
    }
  }

  return (
    <View
      style={{
        ...styles.container,
        backgroundColor: colors.bg,
      }}>
      <Pressable
        onPress={toggleSession}
        style={{
          ...styles.button,
          backgroundColor: colors.emph,
        }}>
        <Text style={{...styles.buttonText, color: colors.fg}}>
          {sessionActive ? 'Cancel' : 'Start recording'}
        </Text>
      </Pressable>
      <Separator />
      <Text style={{...styles.outputText, color: colors.fg}}>{asrText}</Text>
      <Separator />
      <Text style={{...styles.outputText, color: colors.fg}}>{answerText}</Text>
    </View>
  );
}

const Separator = () => <View style={styles.separator} />;

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const colors = {
    bg: isDarkMode ? BaseColors.dark_bg : BaseColors.light_bg,
    fg: isDarkMode ? BaseColors.dark_fg : BaseColors.light_fg,
  };

  return (
    <SafeAreaView style={{...styles.safearea, backgroundColor: colors.bg}}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={colors.bg}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={{backgroundColor: colors.bg}}>
        <EmblaButton />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safearea: {
    flex: 1,
  },
  container: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  separator: {
    marginVertical: 8,
    borderBottomColor: '#737373',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
  },
  buttonText: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
  },
  outputText: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    fontStyle: 'italic',
    letterSpacing: 0.25,
  },
});

export default App;
