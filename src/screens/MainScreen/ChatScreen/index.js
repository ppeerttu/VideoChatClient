import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, View, Platform, Dimensions } from 'react-native';
import UserList from '../../../components/UserList';
import IncomingCall from '../../../components/IncomingCall';
import { Icon } from 'react-native-elements';
import WebRTC from 'react-native-webrtc';
import {
  callToPeer,
  answerToPeer,
  sendCandidate
} from '../../../actions/signal';
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
      candidates: []
    };
  }

  _switchCamera() {
    const isFront = !this.state.isFront;
    const self = this;
    this.setState({isFront});
    getLocalStream(isFront, (stream) => {
      if (localStream) {
        /*
        for (const id in pcPeers) {
          const pc = pcPeers[id];
          pc && pc.removeStream(localStream);
        }
        */
        pc.removeStream(localStream);

        localStream.release();
      }
      localStream = stream;
      self.setState({ localSrc: stream.toURL()});

      /*
      for (const id in pcPeers) {
        const pc = pcPeers[id];
        pc && pc.addStream(localStream);
      }
      */
      pc.addStream(localStream);
    });
  }

  getDerivedStateFromProps(nextProps, prevState) {
    const { signal: { iceCandidates }} = nextProps;
    if (iceCandidates && iceCandidates.length > prevState.candidates.length) {
      pc.addIceCandidate(new RTCIceCandidate(iceCandidates[iceCandidates.length - 1]));
      this.setState({ candidates: iceCandidates });

    }
  }

  componentDidMount() {
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
        if (e.candidate) self._onIceCandidate(e.candidate);
      };

      pc.onaddstream = e => {
        self.setState({ remoteSrc: e.stream.toURL() });
      };
      pc.addStream(localStream);
    });
  }

  _onIceCandidate(candidate) {
    const { dispatch, signal: { call: { peer: { username }}}} = this.props;
    console.log('sending candidate to ', username);
    dispatch(sendCandidate(username, candidate));
  }

  _onShowUsers() {
    this.setState({ showUsers: !this.state.showUsers });
  }

  _onCallToUser(username) {
    const { dispatch } = this.props;
    console.log('call to ', username);
    pc.createOffer()
      .then(offer => {
        dispatch(callToPeer(username, offer));
        pc.setLocalDescription(offer);
      })
      .catch(err => console.error(err));
  }

  _onAnswer() {
    const { dispatch, signal: { call: { peer: { username, offer }}}} = this.props;
    console.log('Going to answer to ' + username);

    pc.setRemoteDescription(new RTCSessionDescription(offer));

    pc.createAnswer(answer => {
      pc.setLocalDescription(answer);
      console.log(answer.toJSON());
      dispatch(answerToPeer(username, answer.toJSON()));
    }, (error) => console.error(error));

  }

  _onDecline() {
    const { signal: { call: { peer: { username }}}} = this.props;
    console.log('Going to decline the call to ' + username);
    dispatch(answerToPeer(username, false));
  }


  render() {
    const { localSrc, remoteSrc, showUsers } = this.state;
    const { signal: { users, call: { peer: { offer, answer, username }, amICaller } }, session: { user } } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.usersContainer}>
          <Icon
            name="users"
            type="font-awesome"
            containerStyle={styles.usersIcon}
            onPress={() => this._onShowUsers()}
            size={30}
            color="#fff"
          />
          {
            showUsers &&
            <UserList
              users={users}
              user={user}
              onPress={(username) => this._onCallToUser(username)}
            />
          }
        </View>
        {
          (offer && !answer && !amICaller) &&
          <IncomingCall
            username={username}
            onAnswer={() => this._onAnswer()}
            onDecline={() => this._onDecline()}
          />
        }
        <Icon
          name="camera"
          type="font-awesome"
          containerStyle={styles.cameraIcon}
          onPress={() => this._switchCamera()}
          size={30}
          color="#fff"
        />


        <RTCView streamURL={localSrc} style={styles.smallView} />
        {
          remoteSrc &&
          <RTCView streamURL={remoteSrc} style={styles.fullView} />
        }
      </View>
    );
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
        if(sourceInfo.kind == "video" && sourceInfo.facing == (isFront ? "front" : "back")) {
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
  cameraIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 100
  },
  usersContainer: {
    position: 'absolute',
    paddingTop: 40,
    top: 0,
    left: 0,
    zIndex: 90,
    width: 300
  },
  usersIcon: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 100
  },
  container: {
    height: '100%',
    backgroundColor: '#000000',
    width: '100%'
  }
});
