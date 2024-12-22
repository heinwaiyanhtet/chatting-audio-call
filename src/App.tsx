import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import {
  StreamVideo,
  StreamCall,
  StreamTheme,
  ParticipantView,
  StreamVideoClient,
  useCallStateHooks,
  CallingState,
} from '@stream-io/video-react-sdk';

// Updated Constants
const apiKey = 'dz5f4d5kzrue';
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZ2VudGxlLWRldy00IiwiZXhwIjoxNzM0ODk1NzM2fQ.nneU6_qq1GAV2mUxlGmKj0PrnminqQ2DBajDVsfHm14';
const userId = 'gentle-dew-4';
const callId = 'yj0SzmiPfhan';

// Main App Component
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Join />} />
        <Route path="/call" element={<Call />} />
      </Routes>
    </Router>
  );
}

// Join Screen Component
const Join = () => {
  const navigate = useNavigate();

  const handleJoin = () => {
    navigate('/call');
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h2>Join a Call</h2>
      <p>
        This is a hardcoded setup. Click "Join Call" to directly enter the call with pre-configured details.
      </p>
      <button
        onClick={handleJoin}
        style={{
          width: '100%',
          padding: '10px',
          backgroundColor: '#007BFF',
          color: '#FFF',
          border: 'none',
          cursor: 'pointer',
          marginTop: '10px',
        }}
      >
        Join Call
      </button>
    </div>
  );
};

// Call Screen Component
const Call = () => {
  const client = new StreamVideoClient({
    apiKey,
    user: {
      id: userId,
      name: 'gentle',
      image: `https://getstream.io/random_svg/?id=${userId}&name=gentle`,
    },
    token,
  });

  const call = client.call('default', callId);

  call.join().catch((err) => console.error('Error joining call:', err));

  return (
    <StreamVideo client={client}>
      <StreamCall call={call}>
        <CallUI />
      </StreamCall>
    </StreamVideo>
  );
};

// Call UI Component
const CallUI = () => {
  const { useCallCallingState, useLocalParticipant, useRemoteParticipants } =
    useCallStateHooks();
  const callingState = useCallCallingState();
  const localParticipant = useLocalParticipant();
  const remoteParticipants = useRemoteParticipants();

  if (callingState !== CallingState.JOINED) {
    return <div>Connecting...</div>;
  }

  return (
    <StreamTheme>
      <div style={{ display: 'flex', flexDirection: 'row', gap: '10px', padding: '10px' }}>
        {remoteParticipants.map((participant) => (
          <ParticipantView
            key={participant.sessionId}
            participant={participant}
            muteAudio={false}
          />
        ))}
      </div>
      <div style={{ position: 'absolute', bottom: '10px', right: '10px' }}>
        {localParticipant && (
          <ParticipantView
            participant={localParticipant}
            muteAudio={false}
          />
        )}
      </div>
    </StreamTheme>
  );
};
