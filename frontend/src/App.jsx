import React, { useState, useEffect } from 'react'
import axios from 'axios'

const BACKEND_URL = '/api';

const App = () => {
  const [joke, setJoke] = useState(null);

  const getJoke = async () => {
    try {
      const { data } = await axios.get(`${BACKEND_URL}/joke`);
      setJoke(data);
    } catch (error) {
      console.error("Error fetching joke");
    };
  };

  const vote = async (emoji) => {
    if (!joke) return;

    setJoke(prev => ({
      ...prev,
      votes: { ...prev.votes, [emoji]: prev.votes[emoji] + 1 }
    }));

    try {
      const { data } = await axios.post(`${BACKEND_URL}/joke/vote`, {
        jokeID: joke.jokeID,
        emoji
      });
      setJoke(data);
    } catch (error) {
      console.error("Error voting");
    }
  };

  useEffect(() => { getJoke(); }, []);

  return (
    <div>
      <h2>{joke?.question}</h2>
      <p>{joke?.answer}</p>
      {Object.entries(joke?.votes || {}).map(([emoji, count]) => (
        <button key={emoji} onClick={() => vote(emoji)}>
          {emoji} {count}
        </button>
      ))}
      <button onClick={getJoke}>Next Joke</button>
    </div>
  );
}


export default App
