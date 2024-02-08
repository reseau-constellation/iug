import{r as U,o as C,a as _,q as S,B as T,e as F,f as z}from"./index-IzNfDlSA.js";import{r as H}from"./path-xE4r6fWz.js";function V(l,n){for(var i=0;i<n.length;i++){const r=n[i];if(typeof r!="string"&&!Array.isArray(r)){for(const o in r)if(o!=="default"&&!(o in l)){const u=Object.getOwnPropertyDescriptor(r,o);u&&Object.defineProperty(l,o,u.get?u:{enumerable:!0,get:()=>r[o]})}}}return Object.freeze(Object.defineProperty(l,Symbol.toStringTag,{value:"Module"}))}var I={exports:{}},x={exports:{}},W={};const B="/home/runner/work/iug/iug/node_modules/electron";var E={};const k=U,$=H,L=$.join(B,"path.txt");function X(){let l;if(k.existsSync(L)&&(l=k.readFileSync(L,"utf-8")),E.ELECTRON_OVERRIDE_DIST_PATH)return $.join(E.ELECTRON_OVERRIDE_DIST_PATH,l||"electron");if(l)return $.join(B,"dist",l);throw new Error("Electron failed to install correctly, please delete node_modules/electron and try installing again")}var J=X(),R={};Object.defineProperty(R,"__esModule",{value:!0});R.getRelayWindow=void 0;const Y=(l,n)=>`
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
          const ipcRenderer = ${l?"window.ipcRenderer":"require('electron').ipcRenderer"}           
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
  `;R.getRelayWindow=Y;Object.defineProperty(W,"__esModule",{value:!0});const M=J,K=R,Z=C,f=Z("electron-webrtc-relay:ResourceManager");class ee{constructor(n,i){this.maxWindows=1,this.windowIDtoStatsMap=new Map,this.referenceToWindowMap=new Map,this.rollingCounter={i:0,length:0},this.internalWindowCounter=0,this.internalWindowQueueBuffer=0,this.opts=n,typeof this.opts.maxWindows>"u"&&(this.opts.maxWindows=1),this.maxWindows=this.opts.maxWindows,this.opts.debug&&(f.enabled=!0),this.registerListener(),this.openWindow(i)}openWindow(n){if(f("trying to create window"),this.internalWindowQueueBuffer+=15,this.internalWindowCounter>=this.maxWindows)return!1;const i=this.internalWindowCounter.toString();this.internalWindowCounter++,f(`creating window: ${i}`);const r=new M.BrowserWindow({title:"WRTC Relay",width:this.opts.debug?900:0,height:this.opts.debug?750:0,transparent:!this.opts.debug,frame:this.opts.debug,alwaysOnTop:!1,skipTaskbar:!0,center:!0,show:!0,webPreferences:{nodeIntegration:typeof this.opts.preload!="string",contextIsolation:typeof this.opts.preload=="string",webSecurity:!0,preload:typeof this.opts.preload=="string"?this.opts.preload:"",devTools:!!this.opts.debug}});this.opts.debug&&r.webContents.openDevTools(),r.webContents.setWebRTCIPHandlingPolicy(typeof this.opts.webrtcPolicy=="string"?this.opts.webrtcPolicy:"default");const o="data:text/html;charset=UTF-8,"+encodeURIComponent((0,K.getRelayWindow)(typeof this.opts.preload=="string",typeof this.opts.debug<"u"&&this.opts.debug));return r.loadURL(o),r.on("ready-to-show",()=>{r.webContents.send("WRTCRelayData",{id:"relayInit",code:`window.windowID = ${i}
                       window.conns = {}`}),this.windowIDtoStatsMap.set(i,{handler:0,window:r}),this.rollingCounter.length++,this.internalWindowQueueBuffer-=15,typeof n=="function"&&n()}),!0}registerListener(){M.ipcMain.on("WRTCRelayStats",(n,i)=>{try{if(!this.windowIDtoStatsMap.has(i.id.toString())){f(`Resource Manager can not find stats of window: ${i.id}`);return}const r=this.windowIDtoStatsMap.get(i.id.toString());if(typeof r>"u")return;r.handler=i.handler,f(`webrtc window: ${i.id} has ${i.handler} open handler`)}catch(r){f(r)}}),M.ipcMain.on("WRTCRelayClose",(n,i)=>{try{this.referenceToWindowMap.delete(i.id.toString())}catch(r){f(r)}})}getStringID(){return this.rollingCounter.i.toString()}eval(n,i,r){var o,u,t,a,c;if(this.referenceToWindowMap.has(n)&&this.windowIDtoStatsMap.has(this.referenceToWindowMap.get(n))){f(`window with id: ${this.referenceToWindowMap.get(n)} handling reference: ${n}`),(o=this.windowIDtoStatsMap.get(this.referenceToWindowMap.get(n)))===null||o===void 0||o.window.webContents.send("WRTCRelayData",{id:i,code:r});return}if(this.rollingCounter.i++,this.rollingCounter.i>=this.rollingCounter.length&&(this.rollingCounter.i=0),!this.windowIDtoStatsMap.has(this.getStringID())){f(`window with id: ${this.rollingCounter.i} does not exist`);return}if(((t=(u=this===null||this===void 0?void 0:this.windowIDtoStatsMap)===null||u===void 0?void 0:u.get(this.getStringID()))===null||t===void 0?void 0:t.handler)<300+this.internalWindowQueueBuffer){f(`window with id: ${this.getStringID()} handling new reference: ${n}`),(c=(a=this===null||this===void 0?void 0:this.windowIDtoStatsMap)===null||a===void 0?void 0:a.get(this.getStringID()))===null||c===void 0||c.window.webContents.send("WRTCRelayData",{id:i,code:r}),this.referenceToWindowMap.set(n,this.getStringID());return}let e;if(this.windowIDtoStatsMap.forEach((s,d)=>{(typeof e>"u"||s.handler<e.handler)&&(e={handler:s.handler,window:s.window,id:d})}),typeof e>"u"){f("failed to find lowestQueue");return}e.handler>250+this.internalWindowQueueBuffer&&this.openWindow(),e.window.webContents.send("WRTCRelayData",{id:i,code:r}),this.referenceToWindowMap.set(n,e.id),f(`window with id, selected by enumeration: ${e.id} handling new reference: ${n}`)}}W.default=ee;var te=x.exports,ne=_&&_.__importDefault||function(l){return l&&l.__esModule?l:{default:l}};Object.defineProperty(te,"__esModule",{value:!0});const ie=ne(W),{ipcMain:re}=J,se=C,oe=S,v=se("electron-webrtc-relay:Bridge");x.exports=class extends oe{constructor(n){super(),this.i=0,this.queue=[],this.ready=!1,this.closing=!1,this.opts={debug:!1},this.resourceManager=void 0,typeof n>"u"&&(n={debug:!1}),this.opts=n,n.debug&&(v.enabled=!0)}_debug(n){this.opts.debug&&v(n)}init(){this._debug(`Initializing Relay: ${JSON.stringify(this.opts)}`),this.resourceManager=new ie.default(this.opts,()=>{v("Bridge ready"),this.ready=!0,this._queue()}),re.on("WRTCRelayData",(n,i)=>{typeof i=="object"&&(v(`Received: ${JSON.stringify(i)}`),this.emit(i[0],i[1]))})}_queue(){this.queue.forEach(n=>{this.resourceManager&&this.resourceManager.eval(n.reference,n.id,n.code)}),this.queue=[]}eval(n,i,r={},o){const u=!this.ready;typeof r=="function"&&(o=r,r={}),this._debug(`opts: ${JSON.stringify(r)} eval: ${JSON.stringify(i)}, BrowserWindow active: ${!u}`);const t=(this.i++).toString(36);if(this.once(t,a=>{let c=null;if(a.err&&(c=new Error(`Error evaluating "${i}" ${a.err}`),c.original=a.err),o)return c?o(c):o(null,a.res);c&&console.error(c)}),u){this.queue.push({id:t,code:i,reference:n});return}this.resourceManager&&this.resourceManager.eval(n,t,i)}close(){}};var ae=x.exports,b={exports:{}},m={exports:{}},de=m.exports,P;function j(){if(P)return m.exports;P=1,Object.defineProperty(de,"__esModule",{value:!0});const l=S,n=C("RTCDC");m.exports=function(r,o){return class extends l.EventEmitter{constructor(t,a,c){super(),this.protocol="",this.addEventListener=this.addListener,typeof t=="object"?this._wrap(t):this._create(t,a,c)}_create(t,a,c){c=c||{},this._pcId=t,this.label=a,this.ordered=null,this.protocol="",this.id=this.stream=null,this.readyState="connecting",this.bufferedAmount=0,this._bufferedAmountLowThreshold=0,this._binaryType="blob",this.maxPacketLifeType=null,this.maxRetransmits=null,this.negotiated=!1,this.reliable=typeof c.reliable=="boolean"?c.reliable:!0,this.on("error",e=>o.emit("error",e,this)),r.eval(JSON.stringify(t),`
        var pc = conns[${JSON.stringify(t)}]
        var dc = pc.createDataChannel(
          ${JSON.stringify(a)}, ${JSON.stringify(c)})
        pc.dataChannels[dc.id] = dc
        // Queues messages that have been recieved before the message listener has been added
        dc.msgQueue = []
        dc.onmessage = function (eMsg) {
          dc.msgQueue.push(eMsg)
        }
        dc.id
      `,(e,s)=>{if(e)return console.error(e);this.id=this.stream=s,this._registerListeners(),this.emit("init")})}_wrap(t){for(let a in t)this[a]=t[a];this.stream=this.id,this._registerListeners(),this.on("error",a=>o.emit("error",a,this))}_registerListeners(t){r.on(`dc:${this._pcId}:${this.id}`,this.onMessage.bind(this)),this._eval(`
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
      `,t||(a=>{a&&console.error(a)}))}onMessage(t){const a=this["on"+t.type],c=t.event||{};switch(n("<<",this.id,t.type,t,!!a),t.type){case"open":this.readyState="open";break;case"message":if(t.dataType==="binary"){const e=new T(c.data,"base64");c.data=e.buffer.slice(e.byteOffset,e.byteOffset+e.byteLength)}break;case"close":this.readyState="closed";break}this.emit(t.type,c),a&&a(c)}close(){this.readyState="closing",this._eval("if (dc) dc.close()",t=>{t&&console.error(t)})}send(t){let a="";(t instanceof ArrayBuffer||t instanceof Uint8Array)&&(t=i(t)),t instanceof T&&(t=t.toString("base64"),a="data = base64ToArrayBuffer(data)"),this._eval(`
        if (dc.readyState === 'open') {
          var data = ${JSON.stringify(t)}
          ${a}
          dc.send(data)
        }
        dc.bufferedAmount
      `,(c,e)=>{if(c)return console.error(c);this.bufferedAmount=e})}_eval(t,a){if(!(typeof this._pcId>"u"))return r.eval(JSON.stringify(this._pcId),`
        var pc = conns[${JSON.stringify(this._pcId)}]
        var dc = pc.dataChannels[${JSON.stringify(this.id)}]
      `+t,a||(c=>{c&&console.error(c)}))}_setProp(t,a){return this.id==null?this.once("init",()=>this._setProp(t,a)):this._eval(`dc["${t}"] = ${JSON.stringify(a)}`)}get bufferedAmountLowThreshold(){return this._bufferedAmountLowThreshold}set bufferedAmountLowThreshold(t){this._bufferedAmountLowThreshold=t,this._setProp("bufferedAmountLowThreshold",t)}get binaryType(){return this._binaryType}set binaryType(t){this._binaryType=t,this._setProp("binaryType",t)}}};function i(r){const o=new T(r.byteLength),u=new Uint8Array(r);for(let t=0;t<o.length;++t)o[t]=u[t];return o}return m.exports}var ce=b.exports,A;function le(){if(A)return b.exports;A=1;var l=_&&_.__importDefault||function(o){return o&&o.__esModule?o:{default:o}};Object.defineProperty(ce,"__esModule",{value:!0});const n=S,i=l(F()),r=C("RTCPC");return b.exports=function(o,u){const t=j()(o,u);let a=0;return class extends n.EventEmitter{constructor(e){if(super(),this.addEventListener=this.addListener,o.closing)throw new Error("Cannot create RTCPeerConnection, the electron-webrtc daemon has been closed");this._id=(a++).toString(36),this._dataChannels=new Map,this._offer=null,this._answer=null,this.iceConnectionState="new",this.iceGatheringState="new",this.localDescription=null,this.peerIdentity={catch:s=>{console.error(s)}},this.remoteDescription=null,this.signalingState="stable",o.on(`pc:${this._id}`,this.onMessage.bind(this)),o.eval(JSON.stringify(this._id),`
        (function () {
          var pc = conns[${JSON.stringify(this._id)}] = new webkitRTCPeerConnection(${JSON.stringify(e)})
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
      `,s=>{s&&u.emit("error",s,this)})}onMessage(e){const s=this["on"+e.type],d=e.event||{};switch(r(this._id+"<<",e.type,e,!!s),e.type){case"addstream":break;case"datachannel":e.channel._pcId=this._id,d.channel=new t(e.channel),this._dataChannels.set(d.channel.id,d.channel);break;case"icecandidate":this.iceGatheringState=e.iceGatheringState,e.offer&&(this._offer=Object.assign(this._offer||{},e.offer));break;case"iceconnectionstatechange":this.iceConnectionState=e.iceConnectionState;break;case"removestream":break;case"signalingstatechange":this.signalingState=e.signalingState;break}this.emit(e.type,d),s&&s(d)}createDataChannel(e,s){const d=new t(this._id,e,s);return d.once("init",()=>this._dataChannels.set(d.id,d)),d}_getCreateArgs(e,s,d){return e&&s?{cb:e,errCb:s,options:d}:{options:e}}createOffer(e,s,d){let{cb:h,errCb:g,options:w}=this._getCreateArgs(e,s,d);return this._offer&&(h&&h(this._offer),Promise.resolve(this._offer)),this._callRemote("createOffer",`onSuccess, onFailure, ${JSON.stringify(w)}`,y=>{this._offer=y,h&&h(y)},g)}createAnswer(e,s,d){let{cb:h,errCb:g,options:w}=this._getCreateArgs(e,s,d);return this._answer&&(h&&h(this._answer),Promise.resolve(this._answer)),this._callRemote("createAnswer",`onSuccess, onFailure, ${JSON.stringify(w)}`,y=>{this._answer=y,h&&h(y)},g)}setLocalDescription(e,s,d){return this.localDescription=e,this._callRemote("setLocalDescription",`new RTCSessionDescription(${JSON.stringify(e)}), onSuccess, onFailure`,s,d)}setRemoteDescription(e,s,d){return this.remoteDescription=e,this._callRemote("setRemoteDescription",`new RTCSessionDescription(${JSON.stringify(e)}), onSuccess, onFailure`,s,d)}addIceCandidate(e,s,d){return this._callRemote("addIceCandidate",`new RTCIceCandidate(${JSON.stringify(e)}), onSuccess, onFailure`,s,d)}close(){this._eval(`
        if (pc && pc.signalingState !== 'closed') pc.close()
        pc = null
      `)}getStats(e){this._callRemote("getStats",`
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
      `,s=>{for(let d of s){let h=d.stats;delete d.stats,d.names=()=>Object.keys(h),d.stat=g=>h[g]}e({result:()=>s})})}_eval(e,s,d){let h,g;const w=new Promise((p,G)=>{h=p,g=G}),y=i.default.randomBytes(16).toString("hex");return o.once(y,p=>{p.err?(d&&d(p.err),g(p.err)):(s&&s(p.res),h(p.res))}),o.eval(JSON.stringify(this._id),`
        (function () {
          var id = ${JSON.stringify(this._id)}
          var reqId = ${JSON.stringify(y)}
          var pc = conns[id]
          var onSuccess = function (res) {
            send(reqId, { res: res && res.toJSON ? res.toJSON() : res })
          }
          var onFailure = function (err) {
            send(reqId, { err: err })
          }
          ${e}
        })()
      `,p=>{p&&u.emit("error",p,this)}),w}_callRemote(e,s,d,h){return this._eval(`pc.${e}(${s||""})`,d,h)}}},b.exports}var O,N;function ue(){return N||(N=1,O=class{constructor(n){this.type=n.type,this.sdp=n.sdp}toJSON(){return this}}),O}var D,q;function he(){return q||(q=1,D=class{constructor(n){this.candidate=n.candidate,this.sdpMid=n.sdpMid,this.sdpMLineIndex=n.sdpMLineIndex}}),D}var fe=I.exports;Object.defineProperty(fe,"__esModule",{value:!0});const pe=S,ge=ae;I.exports=function(l){const n=new ge(l),i=new pe.EventEmitter;return Object.assign(i,{close:n.close.bind(n),electronDaemon:n,init:n.init.bind(n),RTCPeerConnection:le()(n,i),RTCSessionDescription:ue(),RTCIceCandidate:he(),RTCDataChannel:j()(n,i)})};var Q=I.exports;const ye=z(Q),Re=V({__proto__:null,default:ye},[Q]);export{Re as i};
//# sourceMappingURL=index-p0qmk8k9.js.map
