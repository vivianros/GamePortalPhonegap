var webRTC;

function main(webRTC, iosrtc) {
    function db() {
        return firebase.database();
    }

    function messaging() {
        return firebase.messaging();
    }

    function prettyJson(obj) {
        return JSON.stringify(obj, null, '  ');
    }

    function writeDebug(val) {
        document.getElementById('debug').innerHTML += val;
    }

    function dbSet(ref, writeVal) {
        let writeValJson = prettyJson(writeVal);
        ref.set(writeVal);
    }

    let uid = null;

    function writeUser() {
        let myUserPath = `/users/${uid}`;
        dbSet(db().ref(myUserPath), {
            publicFields: {
                avatarImageUrl: `https://foo.bar/avatar`,
                displayName: `Yoav Ziii`,
                isConnected: true,
                lastSeen: firebase.database.ServerValue.TIMESTAMP,
            },
            privateFields: {
                email: `yoav.zibin@yooo.goo`,
                createdOn: firebase.database.ServerValue.TIMESTAMP,
                phoneNumber: ``,
                facebookId: ``,
                googleId: ``,
                twitterId: ``,
                githubId: ``,
            },
        });
    }

    function writeUserIfNeeded() {
        uid = firebase.auth().currentUser.uid;
        listenToMessages();
        document.getElementById('myUserId').value = uid;
        let myUserPath = `/users/${uid}`;
        db().ref(myUserPath).once('value').then((snap) => {
            let myUserInfo = snap.val();
            if (!myUserInfo) {
                writeUser();
                return;
            }
        });
    }

    function firebaseLogin() {
        firebase.auth().signInAnonymously()
            .then(function (result) {
                console.info(result);
                writeUserIfNeeded();
            }).catch(function (error) {
                console.error(`Failed auth: `, error);
            });
    }

    function init() {
        // Initialize Firebase
        let config = {
            apiKey: "AIzaSyDA5tCzxNzykHgaSv1640GanShQze3UK-M",
            authDomain: "universalgamemaker.firebaseapp.com",
            databaseURL: "https://universalgamemaker.firebaseio.com",
            projectId: "universalgamemaker",
            storageBucket: "universalgamemaker.appspot.com",
            messagingSenderId: "144595629077"
        };
        firebase.initializeApp(config);
        firebaseLogin();
    }

    function sendMessage(signalType, signalData) {
        if (!targetUserId) {
            throw new Error("Missing targetUserId");
        }
        let ref = db().ref(`users/${targetUserId}/privateButAddable/signal`).push();
        let signalMsg = {
            addedByUid: uid,
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            signalData: JSON.stringify(signalData),
            signalType: signalType,
        };
        dbSet(ref, signalMsg);
    }

    function listenToMessages() {
        let path = `users/${uid}/privateButAddable/signal`;
        db().ref(path).on('value', (snap) => {
            let signals = snap.val();
            console.log("Got signals=", signals);
            if (!signals)
                return;
            let signalIds = Object.keys(signals);
            signalIds.sort((signalId1, signalId2) => signals[signalId1].timestamp - signals[signalId2].timestamp); // oldest entries are at the beginning
            let updates = {};
            for (let signalId of signalIds) {
                updates[signalId] = null;
                receivedMessage(signals[signalId]);
            }
            db().ref(path).update(updates);
        });
    }

    function callUser() {
        targetUserId = document.getElementById('targetUserId').value;
        console.log("Calling targetUserId=", targetUserId);
        start(true);
    }
    let pc = null;
    let targetUserId = null;
    const configuration = {
        'iceServers': [{
            'urls': 'stun:stun.l.google.com:19302'
        }]
    };
    const offerOptions = {
        offerToReceiveAudio: 1,
        offerToReceiveVideo: 1
    };
    let nav = navigator;
    navigator.getUserMedia = nav.getUserMedia || nav.webkitGetUserMedia || nav.mozGetUserMedia;

    function setVideoStream(isLocal, stream) {
        let video = document.getElementById(isLocal ? 'localvideo' : 'remotevideo');
        if ('srcObject' in video) {
            video.srcObject = stream;
        } else if (window.URL) {
            video.src = window.URL.createObjectURL(stream);
        } else {
            video.src = stream;
        }
    }
    // Code from:
    // https://www.html5rocks.com/en/tutorials/webrtc/basics/
    function gotDescription(desc) {
        console.log("gotDescription: ", desc);
        pc.setLocalDescription(desc);
        sendMessage("sdp", desc);
    }
    // run start(true) to initiate a call
    function start(isCaller) {
        console.log("start: isCaller=", isCaller);
        pc = new cordova.plugins.iosrtc.RTCPeerConnection(configuration);
        // send any ice candidates to the other peer
        pc.onicecandidate = function (evt) {
            console.log("onicecandidate: ", evt);
            if (evt.candidate) {
                sendMessage("candidate", evt.candidate);
            }
        };
        // once remote stream arrives, show it in the remote video element
        pc.onaddstream = function (evt) {
            console.log("onaddstream: ", evt);
            setVideoStream(false, evt.stream);
        };
        // get the local stream, show it in the local video element and send it
        console.log('Requesting getUserMedia...');
        cordova.plugins.iosrtc.getUserMedia({
            "audio": true,
            "video": true
        }, function (stream) {
            console.log("getUserMedia response: ", stream);
            setVideoStream(true, stream);
            stream.getTracks().forEach(track => pc.addTrack(track, stream));
            if (isCaller) {
                pc.createOffer(offerOptions).then(gotDescription, (err) => {
                    console.error("Error in createOffer: ", err);
                    writeDebug("Error in createOffer");
                });
            } else {
                pc.createAnswer().then(gotDescription, (err) => {
                    console.error("Error in createAnswer: ", err);
                    writeDebug("Error in createAnswer");
                });
            }
        }, function (err) {
            console.error("Error in getUserMedia: ", err);
            writeDebug("Error in getUserMedia");
        });
    }
    const ONE_MINUTE_MILLIS = 60 * 1000;

    function receivedMessage(signalMsg) {
        console.log("receivedMessage signalMsg=", signalMsg);
        writeDebug("receivedMessage");

        const now = new Date().getTime();
        if (now - ONE_MINUTE_MILLIS > signalMsg.timestamp) {
            console.warn("Ignoring signal because it's more than a minute old");
            return;
        }
        if (!pc) {
            targetUserId = signalMsg.addedByUid;
            start(false);
        }
        let signalType = signalMsg.signalType;
        let signalData = JSON.parse(signalMsg.signalData);
        if (signalType == "sdp") {
            pc.setRemoteDescription(new cordova.plugins.iosrtc.RTCSessionDescription(signalData)).then(() => {
                console.log("setRemoteDescription success");
            }, (err) => {
                console.error("Error in setRemoteDescription: ", err);
            });
        } else if (signalType == "candidate") {
            pc.addIceCandidate(new cordova.plugins.iosrtc.RTCIceCandidate(signalData)).then(() => {
                console.log("addIceCandidate success");
            }, (err) => {
                console.error("Error in addIceCandidate: ", err);
            });
        }
    }
    init();
    document.getElementById('callUser').onclick = callUser;
};

document.addEventListener('DOMContentLoaded', function () {
    main();
});