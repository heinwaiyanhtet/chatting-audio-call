import { CallingState, ParticipantView, StreamCall, StreamTheme, StreamVideo, StreamVideoClient, StreamVideoParticipant, useCall, useCallStateHooks, User } from '@stream-io/video-react-sdk';

const apiKey = 'mmhfdzb5evj2';
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL3Byb250by5nZXRzdHJlYW0uaW8iLCJzdWIiOiJ1c2VyL0dlbmVyYWxfRG9kb25uYSIsInVzZXJfaWQiOiJHZW5lcmFsX0RvZG9ubmEiLCJ2YWxpZGl0eV9pbl9zZWNvbmRzIjo2MDQ4MDAsImlhdCI6MTczNDAyODA5NCwiZXhwIjoxNzM0NjMyODk0fQ.SPmzOEvfAnIXxlFlTxocrv-_Gdm4ezdmVXAn1S58QqM';
const userId = 'General_Dodonna';
const callId = 'yj0SzmiPfhan';

// set up the user object

const user: User = {
  id: userId,
  name: 'Oliver',
  image: 'https://getstream.io/random_svg/?id=oliver&name=Oliver',
};


const client = new StreamVideoClient({ apiKey, user, token });
const call = client.call('default', callId);
call.join({ create: true });

export const MyUILayout = () => {
  const call = useCall();
  console.log(call?.id);
  const { useCallCallingState, useParticipantCount,useLocalParticipant,useRemoteParticipants } = useCallStateHooks();
  const callingState = useCallCallingState();
  const localParticipant =  useLocalParticipant();
  const remoteParticipant =  useRemoteParticipants();

  if (callingState !== CallingState.JOINED) 
  {
    return <div>Loading...</div>;
  }

  return (
      <StreamTheme style={{ position: 'relative' }}>
      <MyParticipantList participants={remoteParticipant} />
      <MyFloatingLocalParticipant participant={localParticipant} />
    </StreamTheme>
  );
};


export const MyParticipantList = (props: {
  participants: StreamVideoParticipant[];
}) => {
  const { participants } = props;
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        gap: '8px',
        width: '100vw',
      }}
    >
      {participants.map((participant) => (
        <div
          style={{ width: '100%', aspectRatio: '3 / 2' }}
          key={participant.sessionId}
        >
          <ParticipantView
            muteAudio
            participant={participant}
            key={participant.sessionId}
          />
        </div>
      ))}
    </div>
  );
};

export const MyFloatingLocalParticipant = (props: {
  participant?: StreamVideoParticipant;
}) => {
  const { participant } = props;
  return (
    <div
      style={{
        position: 'absolute',
        top: '15px',
        left: '15px',
        width: '240px',
        height: '135px',
        boxShadow: 'rgba(0, 0, 0, 0.1) 0px 0px 10px 3px',
        borderRadius: '12px',
      }}
    >
      {participant && (
        <ParticipantView muteAudio participant={participant} />
      )}
    </div>
  );
};


export default function App() {
  return (
    <StreamVideo client={client}>
      <StreamCall call={call}>
        <MyUILayout />
      </StreamCall>
    </StreamVideo>
  );
}