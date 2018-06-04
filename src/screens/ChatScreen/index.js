import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, View, Platform, Dimensions } from 'react-native';
//import InCallManager from 'react-native-incall-manager';
//import UserList from '../../components/UserList';
import TopBar from '../../components/TopBar';
import BottomBar from '../../components/BottomBar';
import IncomingCall from '../../components/IncomingCall';
//import { Icon } from 'react-native-elements';
import WebRTC from 'react-native-webrtc';
import {
  callToPeer,
  answerToPeer,
  sendCandidate,
  leavePeer
} from '../../actions/signal';
const {
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  RTCView,
  MediaStreamTrack,
  getUserMedia,
} = WebRTC;

let localStream;
let pc;

class ChatScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isFront: true,
      status: 'init',
      localSrc: null,
      remoteSrc: null,
      showUsers: false,
      candidates: [],
      answer: false
    };
  }

  _switchCamera() {
    const isFront = !this.state.isFront;
    const self = this;
    this.setState({ isFront });
    getLocalStream(isFront, stream => {
      if (localStream) {
        pc.removeStream(localStream);
        localStream.release();
      }
      localStream = stream;
      self.setState({ localSrc: stream.toURL()});
      pc.addStream(localStream);
    });
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { signal: { iceCandidates, call: { peer: { answer }} }} = nextProps;
    if (iceCandidates && iceCandidates.length > prevState.candidates.length) {
      pc.addIceCandidate(new RTCIceCandidate(iceCandidates[iceCandidates.length - 1]));
      return { candidates: iceCandidates };
    }
    if (answer && !prevState.answer) {
      pc.setRemoteDescription(new RTCSessionDescription(answer));
      return { answer: true };
    }
    return null;
  }

  componentDidMount() {
    this._initPeerConnection();
  }

  componentWillUnmount() {
    this._closeConnection();
  }

  _onCloseChat() {
    // TODO: Manage webrtc connection etc.
    this._closeConnection();
    this.props.navigation.navigate('App');
  }

  render() {
    const { localSrc, remoteSrc } = this.state;
    const { signal: { users, call: { peer: { offer, answer, username }, amICaller, state } }, session: { user } } = this.props;
    return (
      <View style={styles.container}>
        <TopBar
          users={users}
          user={user}
          onCallToUser={(u) => this._onCallToUser(u)}
          onSwitchCamera={() => this._switchCamera()}
        />
        {
          (offer && !answer && !amICaller) &&
          <IncomingCall
            style={styles.popUp}
            username={username}
            onAnswer={() => this._onAnswer()}
            onDecline={() => this._onDecline()}
          />
        }

        <RTCView streamURL={localSrc} style={remoteSrc ? styles.smallView : styles.fullView} />
        {
          remoteSrc &&
          <RTCView streamURL={remoteSrc} style={styles.fullView} />
        }
        <BottomBar inCall={state === 'CONNECTED'}  onClose={() => this._onCloseChat()} />
      </View>
    );
  }

  _closeConnection() {
    this.props.dispatch(leavePeer());
    if (pc && localStream) {
      pc.removeStream(localStream);
    }
    pc.close();
  }

  _initPeerConnection() {
    const self = this;
    getLocalStream(true, stream => {
      localStream = stream;
      self.setState({ localSrc: stream.toURL(), status: 'ready' });
      let configuration = {
            'iceServers': [
              { url: 'stun:stun2.1.google.com:19302' },
              { url: 'stun:stun1.l.google.com:19302' },
              { url: 'stun:stun1.voiceeclipse.net:3478' },
              { url: 'stun:stun2.l.google.com:19302' },
              { url: 'stun:stun3.l.google.com:19302' },
              { url: 'stun:stun4.l.google.com:19302' }
            ]
          };
      pc = new RTCPeerConnection(configuration);
      pc.onicecandidate = e => {
        const sym = Object.getOwnPropertySymbols(e).find((s) => String(s) === 'Symbol(original_event)');
        if (sym && e[sym].candidate) self._onIceCandidate(e[sym].candidate.toJSON());
      };

      pc.oniceconnectionstatechange = () => {
        // If remote user has disconnected
        if (pc.iceConnectionState === 'disconnected') {
          // TODO: Inform user about lost connection
          self.setState({ localSrc: null, remoteSrc: null });
          self._initPeerConnection();
        }
      };

      pc.onremovestream = () => {
        console.log('Stream removed');
      };

      pc.onaddstream = e => {
        self.setState({ remoteSrc: e.stream.toURL() });
        //InCallManager.start({media: 'video'});
        //InCallManager.requestRecordPermission();
        //InCallManager.requestCameraPermission();
        //InCallManager.setSpeakerphoneOn();
      };

      pc.addStream(localStream);
      //InCallManager.setForceSpeakerphoneOn( true );
      //InCallManager.start({media: 'video'});
      //InCallManager.requestRecordPermission();
      //InCallManager.requestCameraPermission();
      //InCallManager.setSpeakerphoneOn();
    });
  }

  _onIceCandidate(candidate) {
    const { dispatch, signal: { call: { peer: { username }}}} = this.props;
    dispatch(sendCandidate(username, candidate));
  }

  _onCallToUser(username) {
    const { dispatch } = this.props;
    pc.createOffer()
      .then(offer => {
        dispatch(callToPeer(username, offer));
        pc.setLocalDescription(offer);
      })
      .catch(err => console.error(err));
  }

  _onAnswer() {
    const { dispatch, signal: { call: { peer: { username, offer }}}} = this.props;
    pc.setRemoteDescription(new RTCSessionDescription(offer));
    pc.createAnswer(answer => {
      pc.setLocalDescription(answer);
      dispatch(answerToPeer(username, answer.toJSON()));
    }, (error) => console.error(error));

  }

  _onDecline() {
    const { signal: { call: { peer: { username }}}, dispatch } = this.props;
    dispatch(answerToPeer(username, false));
  }
}

function getLocalStream(isFront, callback) {

  let videoSourceId;

  // on android, you don't have to specify sourceId manually, just use facingMode
  // uncomment it if you want to specify
  if (Platform.OS === 'ios') {
    MediaStreamTrack.getSources(sourceInfos => {
      for (let i = 0; i < sourceInfos.length; i++) {
        const sourceInfo = sourceInfos[i];
        if (sourceInfo.kind == "video" && sourceInfo.facing == (isFront ? "front" : "back")) {
          videoSourceId = sourceInfo.id;
        }
      }
    });
  }
  const dimensions = Dimensions.get('screen');
  getUserMedia({
    audio: true,
    video: {
      mandatory: {
        minWidth: dimensions.height,
        minHeight: dimensions.width,
        minFrameRate: 30,
      },
      facingMode: (isFront ? "user" : "environment"),
      optional: (videoSourceId ? [{sourceId: videoSourceId}] : []),
    }
  },
  (stream) => callback(stream),
  (err) => console.error(err)
  );
}

const selector = (state) => {
  const { signal, session } = state;
  return { signal, session };
}


export default connect(selector)(ChatScreen);


const styles = StyleSheet.create({
  fullView: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: '#000000'
  },
  smallView: {
    width: '40%',
    height: '60%',
    position: 'absolute',
    top: 20,
    right: 0
  },
  container: {
    height: '100%',
    backgroundColor: '#000000',
    width: '100%'
  },
  popUp: {
    zIndex: 110
  }
});
