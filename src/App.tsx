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

// Hardcoded constants
const apiKey = 'mmhfdzb5evj2';
const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL3Byb250by5nZXRzdHJlYW0uaW8iLCJzdWIiOiJ1c2VyL0dlbmVyYWxfRG9kb25uYSIsInVzZXJfaWQiOiJHZW5lcmFsX0RvZG9ubmEiLCJ2YWxpZGl0eV9pbl9zZWNvbmRzIjo2MDQ4MDAsImlhdCI6MTczNDAyODA5NCwiZXhwIjoxNzM0NjMyODk0fQ.SPmzOEvfAnIXxlFlTxocrv-_Gdm4ezdmVXAn1S58QqM';
const userId = 'General_Dodonna';
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
    // Navigate directly to the Call screen
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
  // Initialize Stream Video Client
  const client = new StreamVideoClient({
    apiKey,
    user: {
      id: userId,
      name: 'General Dodonna',
      image: `https://getstream.io/random_svg/?id=${userId}&name=General+Dodonna`,
    },
    token,
  });

  // Set up the call object
  const call = client.call('default', callId);

  // Join the call without specifying 'audio' or 'video'
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
            muteAudio={false} // Enable audio for remote participants
          />
        ))}
      </div>
      <div style={{ position: 'absolute', bottom: '10px', right: '10px' }}>
        {localParticipant && (
          <ParticipantView
            participant={localParticipant}
            muteAudio={false} // Enable audio for local participant
          />
        )}
      </div>
    </StreamTheme>
  );
};
