import React, { useState, useEffect } from 'react';

const AudioPlayer = ({ audioUrl }) => {
    console.log("Getting audion blob url",audioUrl)
  const [audio, setAudio] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (audioUrl) {
      const audioElement = new Audio(audioUrl);
      audioElement.onerror = () => {
        setError('Error: Failed to load audio');
        console.error('Failed to load audio:', audioUrl);
      };
      setAudio(audioElement);

      // Cleanup function to revoke the Blob URL when the component unmounts
      return () => {
        audioElement.pause();
        URL.revokeObjectURL(audioUrl);
      };
    }
  }, [audioUrl]);

  const handlePlay = () => {
    if (audio) {
      audio.play();
    }
  };

  const handlePause = () => {
    if (audio) {
      audio.pause();
    }
  };

  return (
    <div>
      {error ? (
        <p>{error}</p>
      ) : (
        <>
          <button onClick={handlePlay}>Play</button>
          <button onClick={handlePause}>Pause</button>
        </>
      )}
    </div>
  );
};

export default AudioPlayer;
