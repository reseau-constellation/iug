import{w as pe,__tla as ge}from"./index-xMlaZgtg.js";import{w as ye,A as we,__tla as me}from"./const-UkZJj0SE.js";import{w as be,__tla as _e}from"./index-pLHssmkz.js";import{w as ve,__tla as Se}from"./index-kjy263JT.js";import{a as Ce,e as v,Q as S,a1 as $,r as Re,g as Te,__tla as Me}from"./index-wr59-EDT.js";import{r as Oe,__tla as Ie}from"./path-TnDa5oq_.js";import{b as C,__tla as De}from"./browser-PGHVSA1T.js";let G,$e=Promise.all([(()=>{try{return ge}catch{}})(),(()=>{try{return me}catch{}})(),(()=>{try{return _e}catch{}})(),(()=>{try{return Se}catch{}})(),(()=>{try{return Me}catch{}})(),(()=>{try{return Ie}catch{}})(),(()=>{try{return De}catch{}})()]).then(async()=>{var R={exports:{}},T={exports:{}},M={};const W="/home/runner/work/iug/iug/node_modules/electron";var x={};const L=Ce,O=Oe,k=O.join(W,"path.txt");function U(){let s;if(L.existsSync(k)&&(s=L.readFileSync(k,"utf-8")),x.ELECTRON_OVERRIDE_DIST_PATH)return O.join(x.ELECTRON_OVERRIDE_DIST_PATH,s||"electron");if(s)return O.join(W,"dist",s);throw new Error("Electron failed to install correctly, please delete node_modules/electron and try installing again")}var A=U(),w={};Object.defineProperty(w,"__esModule",{value:!0}),w.getRelayWindow=void 0;const F=(s,n)=>`
   <!DOCTYPE html>
    <html>
      <head></head>
      <body>
      <p>WRTC Relay</p>
        <script>
            window.arrayBufferToBase64 = function (buffer) {
              var binary = ''
              var bytes = new Uint8Array(buffer)
              for (var i = 0; i < bytes.byteLength; i++) {
                binary += String.fromCharCode(bytes[i])
              }
              return window.btoa(binary)
            }
        
            window.base64ToArrayBuffer = function (base64) {
              var binary = window.atob(base64)
              var bytes = new Uint8Array(binary.length)
              for (var i = 0; i < binary.length; i++) {
                bytes[i] = binary.charCodeAt(i)
              }
              return bytes.buffer
            }
        
          // region GLOBALS and INIT
          // maximum amount of open WebRTC handlers, after that queue
          const MAXMESSAGES = 475;
          // Counter for GC
          let i = 1;
            
          const queue = []
          const ipcRenderer = ${s?"window.ipcRenderer":"require('electron').ipcRenderer"}           
          require = null;
          window.require = null;
          // endregion
          
          // region UTILS
          send = window.send = function (event, message) {
            ipcRenderer.send('WRTCRelayData', [ event, message ])
          }
          
          function handlersAtLimit(){
            return typeof conns === "object" && Object.keys(conns).length >= MAXMESSAGES
          }
          
          function workMessage(message){
             let err
             let res 
              try {
                res = eval(message.code)
              } catch (e) {
                err = e.message
                ${n?"console.error(e)":""}
              }
              window.send(message.id, { res: res, err: err })
          }
          
          function invokeGC(){
            console.log(i++);
           
            if (!(i % 5)) {
              // try to invoke GC on each 5ish iteration
              // https://bugs.chromium.org/p/chromium/issues/detail?id=825576 Garbage Collection not deleting closed WebRTC messages
              queueMicrotask(() => { 
                if(typeof conns === "object"){
                  ${n?'console.log("gcing all conns: " + Object.keys(conns).length)':""}
                  Object.keys(conns).forEach((id) => {
                    let tmpPC = conns[id]
                    if(tmpPC?.signalingState === "closed"){
                      tmpPC = null;
                      conns[id] = null;
                      delete conns[id];
                      
                      // remove stats for id
                      ipcRenderer.send('WRTCRelayClose', {id})
                    }
                  })
                  ipcRenderer.send('WRTCRelayStats', {id: window.windowID, handler: Object.keys(conns).length + queue.length})
                }
                let img = document.createElement("img");
                img.src = window.URL.createObjectURL(new Blob([new ArrayBuffer(5e+7)])); // 50Mo or less or more depending as you wish to force/invoke GC cycle run
                img.onerror = function() {
                  window.URL.revokeObjectURL(this.src);
                  img = null
                }
              })
            }
          }
          // endregion
          
          ${n?'console.log("initializing browser " + typeof ipcRenderer)':""}

          // region MAIN LOGIC
          function workQueue(){
            if(queue.length === 0) return;
            if(handlersAtLimit()) return;
            
            // Fixed Queue Overflow
            let message = queue.shift()
            workMessage(message)
            
            // make sure queue Messages do not get lost
            workQueue();
          }
          setInterval(workQueue, 1000);
        
          ipcRenderer.on('WRTCRelayData', function (e, message) {  
            if(handlersAtLimit()) {
              queue.push(message)
              return;
            }
            workMessage(message)
          })
          // endregion
        <\/script>
      </body>
    </html>
  `;w.getRelayWindow=F,Object.defineProperty(M,"__esModule",{value:!0});const I=A,H=w,z=C,u=z("electron-webrtc-relay:ResourceManager");class V{constructor(n,a){this.maxWindows=1,this.windowIDtoStatsMap=new Map,this.referenceToWindowMap=new Map,this.rollingCounter={i:0,length:0},this.internalWindowCounter=0,this.internalWindowQueueBuffer=0,this.opts=n,typeof this.opts.maxWindows>"u"&&(this.opts.maxWindows=1),this.maxWindows=this.opts.maxWindows,this.opts.debug&&(u.enabled=!0),this.registerListener(),this.openWindow(a)}openWindow(n){if(u("trying to create window"),this.internalWindowQueueBuffer+=15,this.internalWindowCounter>=this.maxWindows)return!1;const a=this.internalWindowCounter.toString();this.internalWindowCounter++,u(`creating window: ${a}`);const d=new I.BrowserWindow({title:"WRTC Relay",width:this.opts.debug?900:0,height:this.opts.debug?750:0,transparent:!this.opts.debug,frame:this.opts.debug,alwaysOnTop:!1,skipTaskbar:!0,center:!0,show:!0,webPreferences:{nodeIntegration:typeof this.opts.preload!="string",contextIsolation:typeof this.opts.preload=="string",webSecurity:!0,preload:typeof this.opts.preload=="string"?this.opts.preload:"",devTools:!!this.opts.debug}});this.opts.debug&&d.webContents.openDevTools(),d.webContents.setWebRTCIPHandlingPolicy(typeof this.opts.webrtcPolicy=="string"?this.opts.webrtcPolicy:"default");const l="data:text/html;charset=UTF-8,"+encodeURIComponent((0,H.getRelayWindow)(typeof this.opts.preload=="string",typeof this.opts.debug<"u"&&this.opts.debug));return d.loadURL(l),d.on("ready-to-show",()=>{d.webContents.send("WRTCRelayData",{id:"relayInit",code:`window.windowID = ${a}
                       window.conns = {}`}),this.windowIDtoStatsMap.set(a,{handler:0,window:d}),this.rollingCounter.length++,this.internalWindowQueueBuffer-=15,typeof n=="function"&&n()}),!0}registerListener(){I.ipcMain.on("WRTCRelayStats",(n,a)=>{try{if(!this.windowIDtoStatsMap.has(a.id.toString())){u(`Resource Manager can not find stats of window: ${a.id}`);return}const d=this.windowIDtoStatsMap.get(a.id.toString());if(typeof d>"u")return;d.handler=a.handler,u(`webrtc window: ${a.id} has ${a.handler} open handler`)}catch(d){u(d)}}),I.ipcMain.on("WRTCRelayClose",(n,a)=>{try{this.referenceToWindowMap.delete(a.id.toString())}catch(d){u(d)}})}getStringID(){return this.rollingCounter.i.toString()}eval(n,a,d){var l,e,r,c,t;if(this.referenceToWindowMap.has(n)&&this.windowIDtoStatsMap.has(this.referenceToWindowMap.get(n))){u(`window with id: ${this.referenceToWindowMap.get(n)} handling reference: ${n}`),(l=this.windowIDtoStatsMap.get(this.referenceToWindowMap.get(n)))===null||l===void 0||l.window.webContents.send("WRTCRelayData",{id:a,code:d});return}if(this.rollingCounter.i++,this.rollingCounter.i>=this.rollingCounter.length&&(this.rollingCounter.i=0),!this.windowIDtoStatsMap.has(this.getStringID())){u(`window with id: ${this.rollingCounter.i} does not exist`);return}if(((r=(e=this===null||this===void 0?void 0:this.windowIDtoStatsMap)===null||e===void 0?void 0:e.get(this.getStringID()))===null||r===void 0?void 0:r.handler)<300+this.internalWindowQueueBuffer){u(`window with id: ${this.getStringID()} handling new reference: ${n}`),(t=(c=this===null||this===void 0?void 0:this.windowIDtoStatsMap)===null||c===void 0?void 0:c.get(this.getStringID()))===null||t===void 0||t.window.webContents.send("WRTCRelayData",{id:a,code:d}),this.referenceToWindowMap.set(n,this.getStringID());return}let i;if(this.windowIDtoStatsMap.forEach((o,h)=>{(typeof i>"u"||o.handler<i.handler)&&(i={handler:o.handler,window:o.window,id:h})}),typeof i>"u"){u("failed to find lowestQueue");return}i.handler>250+this.internalWindowQueueBuffer&&this.openWindow(),i.window.webContents.send("WRTCRelayData",{id:a,code:d}),this.referenceToWindowMap.set(n,i.id),u(`window with id, selected by enumeration: ${i.id} handling new reference: ${n}`)}}M.default=V;var X=T.exports,Y=v&&v.__importDefault||function(s){return s&&s.__esModule?s:{default:s}};Object.defineProperty(X,"__esModule",{value:!0});const K=Y(M),{ipcMain:Z}=A,ee=C,te=S,m=ee("electron-webrtc-relay:Bridge");T.exports=class extends te{constructor(s){super(),this.i=0,this.queue=[],this.ready=!1,this.closing=!1,this.opts={debug:!1},this.resourceManager=void 0,typeof s>"u"&&(s={debug:!1}),this.opts=s,s.debug&&(m.enabled=!0)}_debug(s){this.opts.debug&&m(s)}init(){this._debug(`Initializing Relay: ${JSON.stringify(this.opts)}`),this.resourceManager=new K.default(this.opts,()=>{m("Bridge ready"),this.ready=!0,this._queue()}),Z.on("WRTCRelayData",(s,n)=>{typeof n=="object"&&(m(`Received: ${JSON.stringify(n)}`),this.emit(n[0],n[1]))})}_queue(){this.queue.forEach(s=>{this.resourceManager&&this.resourceManager.eval(s.reference,s.id,s.code)}),this.queue=[]}eval(s,n,a={},d){const l=!this.ready;typeof a=="function"&&(d=a,a={}),this._debug(`opts: ${JSON.stringify(a)} eval: ${JSON.stringify(n)}, BrowserWindow active: ${!l}`);const e=(this.i++).toString(36);if(this.once(e,r=>{let c=null;if(r.err&&(c=new Error(`Error evaluating "${n}" ${r.err}`),c.original=r.err),d)return c?d(c):d(null,r.res);c&&console.error(c)}),l){this.queue.push({id:e,code:n,reference:s});return}this.resourceManager&&this.resourceManager.eval(s,e,n)}close(){}};var ne=T.exports,b={exports:{}},_={exports:{}},ie=_.exports,E;function N(){if(E)return _.exports;E=1,Object.defineProperty(ie,"__esModule",{value:!0});const s=S,n=C("RTCDC");_.exports=function(d,l){return class extends s.EventEmitter{constructor(e,r,c){super(),this.protocol="",this.addEventListener=this.addListener,typeof e=="object"?this._wrap(e):this._create(e,r,c)}_create(e,r,c){c=c||{},this._pcId=e,this.label=r,this.ordered=null,this.protocol="",this.id=this.stream=null,this.readyState="connecting",this.bufferedAmount=0,this._bufferedAmountLowThreshold=0,this._binaryType="blob",this.maxPacketLifeType=null,this.maxRetransmits=null,this.negotiated=!1,this.reliable=typeof c.reliable=="boolean"?c.reliable:!0,this.on("error",t=>l.emit("error",t,this)),d.eval(JSON.stringify(e),`
        var pc = conns[${JSON.stringify(e)}]
        var dc = pc.createDataChannel(
          ${JSON.stringify(r)}, ${JSON.stringify(c)})
        pc.dataChannels[dc.id] = dc
        // Queues messages that have been recieved before the message listener has been added
        dc.msgQueue = []
        dc.onmessage = function (eMsg) {
          dc.msgQueue.push(eMsg)
        }
        dc.id
      `,(t,i)=>{if(t)return console.error(t);this.id=this.stream=i,this._registerListeners(),this.emit("init")})}_wrap(e){for(let r in e)this[r]=e[r];this.stream=this.id,this._registerListeners(),this.on("error",r=>l.emit("error",r,this))}_registerListeners(e){d.on(`dc:${this._pcId}:${this.id}`,this.onMessage.bind(this)),this._eval(`
        var id = 'dc:' + ${JSON.stringify(this._pcId)} + ':' + dc.id
        dc.onopen = function () {
          send(id, {
            type: 'open',
            state: {
              ordered: dc.ordered,
              protocol: dc.protocol,
              maxPacketLifeType: dc.maxPacketLifeType,
              maxRetransmits: dc.maxRetransmits,
              negotiated: dc.negotiated,
              reliable: dc.reliable
            }
          })
        }
        dc.onmessage = function (e) {
          send(id, {
            type: 'message',
            event: {
              data: e.data instanceof ArrayBuffer ? arrayBufferToBase64(e.data) : e.data,
              origin: e.origin
            },
            dataType: e.data instanceof ArrayBuffer ? 'binary' : 'string'
          })
        }
        dc.onbufferedamountlow = function () {
          send(id, { type: 'bufferedamountlow' })
        }
        dc.onclose = function () {
          delete pc.dataChannels[dc.id]
          send(id, { type: 'close' })
        }
        dc.onerror = function () {
          send(id, { type: 'error' })
        }
        if (dc.readyState === 'open') dc.onopen()
        for (var i = 0; i < dc.msgQueue.length; i++) {
          dc.onmessage(dc.msgQueue[i])
        }
        dc.msgQueue = null
      `,e||(r=>{r&&console.error(r)}))}onMessage(e){const r=this["on"+e.type],c=e.event||{};switch(n("<<",this.id,e.type,e,!!r),e.type){case"open":this.readyState="open";break;case"message":if(e.dataType==="binary"){const t=new $(c.data,"base64");c.data=t.buffer.slice(t.byteOffset,t.byteOffset+t.byteLength)}break;case"close":this.readyState="closed";break}this.emit(e.type,c),r&&r(c)}close(){this.readyState="closing",this._eval("if (dc) dc.close()",e=>{e&&console.error(e)})}send(e){let r="";(e instanceof ArrayBuffer||e instanceof Uint8Array)&&(e=a(e)),e instanceof $&&(e=e.toString("base64"),r="data = base64ToArrayBuffer(data)"),this._eval(`
        if (dc.readyState === 'open') {
          var data = ${JSON.stringify(e)}
          ${r}
          dc.send(data)
        }
        dc.bufferedAmount
      `,(c,t)=>{if(c)return console.error(c);this.bufferedAmount=t})}_eval(e,r){if(!(typeof this._pcId>"u"))return d.eval(JSON.stringify(this._pcId),`
        var pc = conns[${JSON.stringify(this._pcId)}]
        var dc = pc.dataChannels[${JSON.stringify(this.id)}]
      `+e,r||(c=>{c&&console.error(c)}))}_setProp(e,r){return this.id==null?this.once("init",()=>this._setProp(e,r)):this._eval(`dc["${e}"] = ${JSON.stringify(r)}`)}get bufferedAmountLowThreshold(){return this._bufferedAmountLowThreshold}set bufferedAmountLowThreshold(e){this._bufferedAmountLowThreshold=e,this._setProp("bufferedAmountLowThreshold",e)}get binaryType(){return this._binaryType}set binaryType(e){this._binaryType=e,this._setProp("binaryType",e)}}};function a(d){const l=new $(d.byteLength),e=new Uint8Array(d);for(let r=0;r<l.length;++r)l[r]=e[r];return l}return _.exports}var re=b.exports,P;function se(){if(P)return b.exports;P=1;var s=v&&v.__importDefault||function(l){return l&&l.__esModule?l:{default:l}};Object.defineProperty(re,"__esModule",{value:!0});const n=S,a=s(Re()),d=C("RTCPC");return b.exports=function(l,e){const r=N()(l,e);let c=0;return class extends n.EventEmitter{constructor(t){if(super(),this.addEventListener=this.addListener,l.closing)throw new Error("Cannot create RTCPeerConnection, the electron-webrtc daemon has been closed");this._id=(c++).toString(36),this._dataChannels=new Map,this._offer=null,this._answer=null,this.iceConnectionState="new",this.iceGatheringState="new",this.localDescription=null,this.peerIdentity={catch:i=>{console.error(i)}},this.remoteDescription=null,this.signalingState="stable",l.on(`pc:${this._id}`,this.onMessage.bind(this)),l.eval(JSON.stringify(this._id),`
        (function () {
          var pc = conns[${JSON.stringify(this._id)}] = new webkitRTCPeerConnection(${JSON.stringify(t)})
          pc.dataChannels = {}
          var id = 'pc:' + ${JSON.stringify(this._id)}
          pc.onaddstream = function (e) {
            // TODO: send MediaStream info
            send(id, { type: 'addstream' })
          }
          pc.ondatachannel = function (e) {
            pc.dataChannels[e.channel.id] = e.channel
            var channel = {}
            for (var key in e.channel) {
              if (typeof e.channel[key] === 'function' || e.channel[key] == null) continue
              channel[key] = e.channel[key]
            }
            // Queues messages that have been recieved before the message listener has been added
            e.channel.msgQueue = []
            e.channel.onmessage = function (eMsg) {
              e.channel.msgQueue.push(eMsg)
            }
            send(id, {
              type: 'datachannel',
              channel: channel
            })
          }
          pc.onicecandidate = function (e) {
            var event = {}
            if (e.candidate) {
              event.candidate = {
                candidate: e.candidate.candidate,
                sdpMid: e.candidate.sdpMid,
                sdpMLineIndex: e.candidate.sdpMLineIndex
              }
            }
            var offer, answer
            function sendEvent () {
              send(id, {
                type: 'icecandidate',
                event: event,
                iceGatheringState: pc.iceGatheringState,
                // offer: offer ? offer.toJSON() : null //is already an object?
                offer: offer ? offer : null
              })
            }
            pc.createOffer(function (o) {
              offer = o
              sendEvent()
            }, function () {
              offer = false
              sendEvent()
            })
          }
          pc.oniceconnectionstatechange = function (e) {
            send(id, { type: 'iceconnectionstatechange', iceConnectionState: pc.iceConnectionState })
          }
          pc.onidentityresult = function (e) {
            send(id, { type: 'identityresult', event: {
              assertion: e.assertion
            }})
          }
          pc.onidpassertionerror = function (e) {
            send(id, {
              type: 'idpassertionerror',
              event: {
                idp: e.idp,
                loginUrl: e.loginUrl,
                protocol: e.protocol,
              }
            })
          }
          pc.onidpvalidationerror = function (e) {
            send(id, {
              type: 'idpvalidationerror',
              event: {
                idp: e.idp,
                loginUrl: e.loginUrl,
                protocol: e.protocol,
              }
            })
          }
          pc.onnegotiationneeded = function (e) {
            send(id, { type: 'negotiationneeded' })
          }
          pc.onremovestream = function (e) {
            send(id, {
              type: 'removestream',
              event: { id: e.stream.id }
            })
          }
          pc.onsignalingstatechange = function (e) {
            send(id, {
              type: 'signalingstatechange',
              signalingState: pc.signalingState
            })
          }
          
          invokeGC()
        })()
      `,i=>{i&&e.emit("error",i,this)})}onMessage(t){const i=this["on"+t.type],o=t.event||{};switch(d(this._id+"<<",t.type,t,!!i),t.type){case"addstream":break;case"datachannel":t.channel._pcId=this._id,o.channel=new r(t.channel),this._dataChannels.set(o.channel.id,o.channel);break;case"icecandidate":this.iceGatheringState=t.iceGatheringState,t.offer&&(this._offer=Object.assign(this._offer||{},t.offer));break;case"iceconnectionstatechange":this.iceConnectionState=t.iceConnectionState;break;case"removestream":break;case"signalingstatechange":this.signalingState=t.signalingState;break}this.emit(t.type,o),i&&i(o)}createDataChannel(t,i){const o=new r(this._id,t,i);return o.once("init",()=>this._dataChannels.set(o.id,o)),o}_getCreateArgs(t,i,o){return t&&i?{cb:t,errCb:i,options:o}:{options:t}}createOffer(t,i,o){let{cb:h,errCb:p,options:y}=this._getCreateArgs(t,i,o);return this._offer&&(h&&h(this._offer),Promise.resolve(this._offer)),this._callRemote("createOffer",`onSuccess, onFailure, ${JSON.stringify(y)}`,g=>{this._offer=g,h&&h(g)},p)}createAnswer(t,i,o){let{cb:h,errCb:p,options:y}=this._getCreateArgs(t,i,o);return this._answer&&(h&&h(this._answer),Promise.resolve(this._answer)),this._callRemote("createAnswer",`onSuccess, onFailure, ${JSON.stringify(y)}`,g=>{this._answer=g,h&&h(g)},p)}setLocalDescription(t,i,o){return this.localDescription=t,this._callRemote("setLocalDescription",`new RTCSessionDescription(${JSON.stringify(t)}), onSuccess, onFailure`,i,o)}setRemoteDescription(t,i,o){return this.remoteDescription=t,this._callRemote("setRemoteDescription",`new RTCSessionDescription(${JSON.stringify(t)}), onSuccess, onFailure`,i,o)}addIceCandidate(t,i,o){return this._callRemote("addIceCandidate",`new RTCIceCandidate(${JSON.stringify(t)}), onSuccess, onFailure`,i,o)}close(){this._eval(`
        if (pc && pc.signalingState !== 'closed') pc.close()
        pc = null
      `)}getStats(t){this._callRemote("getStats",`
        function (res) {
          res = res.result()
          var output = res.map(function (res) {
            var item = {
              id: res.id,
              timestamp: res.timestamp,
              type: res.type,
              stats: {}
            }
            res.names().forEach(function (name) {
              item.stats[name] = res.stat(name)
            })
            return item
          })
          onSuccess(output)
        }
      `,i=>{for(let o of i){let h=o.stats;delete o.stats,o.names=()=>Object.keys(h),o.stat=p=>h[p]}t({result:()=>i})})}_eval(t,i,o){let h,p;const y=new Promise((f,fe)=>{h=f,p=fe}),g=a.default.randomBytes(16).toString("hex");return l.once(g,f=>{f.err?(o&&o(f.err),p(f.err)):(i&&i(f.res),h(f.res))}),l.eval(JSON.stringify(this._id),`
        (function () {
          var id = ${JSON.stringify(this._id)}
          var reqId = ${JSON.stringify(g)}
          var pc = conns[id]
          var onSuccess = function (res) {
            send(reqId, { res: res && res.toJSON ? res.toJSON() : res })
          }
          var onFailure = function (err) {
            send(reqId, { err: err })
          }
          ${t}
        })()
      `,f=>{f&&e.emit("error",f,this)}),y}_callRemote(t,i,o,h){return this._eval(`pc.${t}(${i||""})`,o,h)}}},b.exports}var J,j;function oe(){return j||(j=1,J=class{constructor(s){this.type=s.type,this.sdp=s.sdp}toJSON(){return this}}),J}var B,q;function ae(){return q||(q=1,B=class{constructor(s){this.candidate=s.candidate,this.sdpMid=s.sdpMid,this.sdpMLineIndex=s.sdpMLineIndex}}),B}var de=R.exports;Object.defineProperty(de,"__esModule",{value:!0});const ce=S,le=ne;R.exports=function(s){const n=new le(s),a=new ce.EventEmitter;return Object.assign(a,{close:n.close.bind(n),electronDaemon:n,init:n.init.bind(n),RTCPeerConnection:se()(n,a),RTCSessionDescription:oe(),RTCIceCandidate:ae(),RTCDataChannel:N()(n,a)})};var he=R.exports;const ue=Te(he),Q=ue();Q.init();let D;D=be({wrtc:Q}),G={libp2p:{transports:[ve(),pe(),D.transport,ye()],peerDiscovery:[D.discovery],addresses:{listen:we}}}});export{$e as __tla,G as default};
