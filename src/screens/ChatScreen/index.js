import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, View, Platform, Button } from 'react-native';
import WebRTC from 'react-native-webrtc';
const {
  //RTCPeerConnection,
  //RTCIceCandidate,
  //RTCSessionDescription,
  RTCView,
  //t nati,
  MediaStreamTrack,
  getUserMedia,
} = WebRTC;

let localStream;

class ChatScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      frontCam: true,
      status: 'init',
      localSrc: null
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
   });
 }

 componentDidMount() {
   const self = this;
   getLocalStream(true, stream => {
     localStream = stream;
     self.setState({ localSrc: stream.toURL(), status: 'ready' });
   });
 }

  render() {
    const { status, localSrc } = this.state;
    return (
      <View style={styles.container}>
        <Button
          title="Switch camera"
          onPress={() => this._switchCamera()}
        />
        <Text>Chat screen</Text>
        <Text>State: {status}</Text>

        <RTCView streamURL={localSrc} style={styles.selfView} />
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
      console.log("sourceInfos: ", sourceInfos);

      for (let i = 0; i < sourceInfos.length; i++) {
        const sourceInfo = sourceInfos[i];
        if(sourceInfo.kind == "video" && sourceInfo.facing == (isFront ? "front" : "back")) {
          videoSourceId = sourceInfo.id;
        }
      }
    });
  }
  getUserMedia({
    audio: true,
    video: {
      mandatory: {
        minWidth: 640, // Provide your own width, height and frame rate here
        minHeight: 360,
        minFrameRate: 30,
      },
      facingMode: (isFront ? "user" : "environment"),
      optional: (videoSourceId ? [{sourceId: videoSourceId}] : []),
    }
  }, (stream) => {
    console.log('getUserMedia success', stream);
    callback(stream);
  }, (err) => console.error(err));
}


export default connect()(ChatScreen);


const styles = StyleSheet.create({
  selfView: {
    width: '100%',
    height: '70%',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    backgroundColor: '#fff',
    width: '100%'
  }
});
