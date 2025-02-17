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

  useEffect(() => { getJoke(); }, []);

  return (
    <div>
      <h2>{joke?.question}</h2>
      <p>{joke?.answer}</p>
      <button onClick={getJoke}>Next Joke</button>
    </div>
  );
}


export default App
