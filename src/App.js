import { useEffect, useState, useRef } from 'react';
import { Configuration, OpenAIApi } from "openai";
import { Widget, addResponseMessage } from 'react-chat-widget';

import logo from './logo.svg';
import avatar from './alfred.png';

import './styles/App.css';
import './styles/Chat.css';

const config = new Configuration({
  apiKey: process.env.REACT_APP_OPENAI_API,
});

const openai = new OpenAIApi(config);

const greetingMessage = "Hi, My Name is Alfred, a Chat-GPT Artificial Intelegence personal assistant"

function App() {
  const [loading, setLoading] = useState(false);
  const mounted = useRef(false);


  const getFeedback = async (message) => {
    if (loading) {
      return;
    }
    if (mounted.current) {
      setLoading(true);
    }

    try {
      const completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: message,
        temperature: 0.8,
        max_tokens: 2048,
      });

      if (mounted.current) {
        setLoading(false);
      }

      return completion.data.choices[0].text;
    } catch (error) {
      return error.response;
    }
  };

  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);

  useEffect(() => {
    addResponseMessage(
      greetingMessage
    );
  }, []);

  const handleNewUserMessage = async (newMessage) => {
    const result = await getFeedback(newMessage);

    console.log(result)
    addResponseMessage(result);
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p
          className="App-link"
        >
          Chat-GPT Personal Assistant
        </p>
      </header>
      <Widget
        handleNewUserMessage={handleNewUserMessage}
        toggleMsgLoader={true}
        profileAvatar={avatar}
        ful
        title="Alfred AI"
        subtitle="Powered by Chat-GPT"
      />
    </div>
  );
}

export default App;
