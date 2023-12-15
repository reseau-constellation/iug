import{w as F}from"./index-KabREhd-.js";import{w as H,A as z}from"./const-eGFksW06.js";import{w as V}from"./index-ayBDLvyF.js";import{w as X}from"./index-K4ZanX_b.js";import{D as Y,a2 as K,a as Z,a3 as _,m as C,S,a4 as T,r as ee,i as te}from"./index-WgrZNOeu.js";var I={exports:{}},W={exports:{}},x={};const J="/home/runner/work/iug/iug/node_modules/electron",ne=Y(K);var E={};const k=Z,$=ne,L=$.join(J,"path.txt");function ie(){let l;if(k.existsSync(L)&&(l=k.readFileSync(L,"utf-8")),E.ELECTRON_OVERRIDE_DIST_PATH)return $.join(E.ELECTRON_OVERRIDE_DIST_PATH,l||"electron");if(l)return $.join(J,"dist",l);throw new Error("Electron failed to install correctly, please delete node_modules/electron and try installing again")}var j=ie(),R={};Object.defineProperty(R,"__esModule",{value:!0});R.getRelayWindow=void 0;const re=(l,n)=>`
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
  `;R.getRelayWindow=re;Object.defineProperty(x,"__esModule",{value:!0});const M=j,se=R,oe=_,f=oe("electron-webrtc-relay:ResourceManager");class ae{constructor(n,r){this.maxWindows=1,this.windowIDtoStatsMap=new Map,this.referenceToWindowMap=new Map,this.rollingCounter={i:0,length:0},this.internalWindowCounter=0,this.internalWindowQueueBuffer=0,this.opts=n,typeof this.opts.maxWindows>"u"&&(this.opts.maxWindows=1),this.maxWindows=this.opts.maxWindows,this.opts.debug&&(f.enabled=!0),this.registerListener(),this.openWindow(r)}openWindow(n){if(f("trying to create window"),this.internalWindowQueueBuffer+=15,this.internalWindowCounter>=this.maxWindows)return!1;const r=this.internalWindowCounter.toString();this.internalWindowCounter++,f(`creating window: ${r}`);const a=new M.BrowserWindow({title:"WRTC Relay",width:this.opts.debug?900:0,height:this.opts.debug?750:0,transparent:!this.opts.debug,frame:this.opts.debug,alwaysOnTop:!1,skipTaskbar:!0,center:!0,show:!0,webPreferences:{nodeIntegration:typeof this.opts.preload!="string",contextIsolation:typeof this.opts.preload=="string",webSecurity:!0,preload:typeof this.opts.preload=="string"?this.opts.preload:"",devTools:!!this.opts.debug}});this.opts.debug&&a.webContents.openDevTools(),a.webContents.setWebRTCIPHandlingPolicy(typeof this.opts.webrtcPolicy=="string"?this.opts.webrtcPolicy:"default");const c="data:text/html;charset=UTF-8,"+encodeURIComponent((0,se.getRelayWindow)(typeof this.opts.preload=="string",typeof this.opts.debug<"u"&&this.opts.debug));return a.loadURL(c),a.on("ready-to-show",()=>{a.webContents.send("WRTCRelayData",{id:"relayInit",code:`window.windowID = ${r}
                       window.conns = {}`}),this.windowIDtoStatsMap.set(r,{handler:0,window:a}),this.rollingCounter.length++,this.internalWindowQueueBuffer-=15,typeof n=="function"&&n()}),!0}registerListener(){M.ipcMain.on("WRTCRelayStats",(n,r)=>{try{if(!this.windowIDtoStatsMap.has(r.id.toString())){f(`Resource Manager can not find stats of window: ${r.id}`);return}const a=this.windowIDtoStatsMap.get(r.id.toString());if(typeof a>"u")return;a.handler=r.handler,f(`webrtc window: ${r.id} has ${r.handler} open handler`)}catch(a){f(a)}}),M.ipcMain.on("WRTCRelayClose",(n,r)=>{try{this.referenceToWindowMap.delete(r.id.toString())}catch(a){f(a)}})}getStringID(){return this.rollingCounter.i.toString()}eval(n,r,a){var c,h,t,s,d;if(this.referenceToWindowMap.has(n)&&this.windowIDtoStatsMap.has(this.referenceToWindowMap.get(n))){f(`window with id: ${this.referenceToWindowMap.get(n)} handling reference: ${n}`),(c=this.windowIDtoStatsMap.get(this.referenceToWindowMap.get(n)))===null||c===void 0||c.window.webContents.send("WRTCRelayData",{id:r,code:a});return}if(this.rollingCounter.i++,this.rollingCounter.i>=this.rollingCounter.length&&(this.rollingCounter.i=0),!this.windowIDtoStatsMap.has(this.getStringID())){f(`window with id: ${this.rollingCounter.i} does not exist`);return}if(((t=(h=this===null||this===void 0?void 0:this.windowIDtoStatsMap)===null||h===void 0?void 0:h.get(this.getStringID()))===null||t===void 0?void 0:t.handler)<300+this.internalWindowQueueBuffer){f(`window with id: ${this.getStringID()} handling new reference: ${n}`),(d=(s=this===null||this===void 0?void 0:this.windowIDtoStatsMap)===null||s===void 0?void 0:s.get(this.getStringID()))===null||d===void 0||d.window.webContents.send("WRTCRelayData",{id:r,code:a}),this.referenceToWindowMap.set(n,this.getStringID());return}let e;if(this.windowIDtoStatsMap.forEach((i,o)=>{(typeof e>"u"||i.handler<e.handler)&&(e={handler:i.handler,window:i.window,id:o})}),typeof e>"u"){f("failed to find lowestQueue");return}e.handler>250+this.internalWindowQueueBuffer&&this.openWindow(),e.window.webContents.send("WRTCRelayData",{id:r,code:a}),this.referenceToWindowMap.set(n,e.id),f(`window with id, selected by enumeration: ${e.id} handling new reference: ${n}`)}}x.default=ae;var de=W.exports,ce=C&&C.__importDefault||function(l){return l&&l.__esModule?l:{default:l}};Object.defineProperty(de,"__esModule",{value:!0});const le=ce(x),{ipcMain:ue}=j,he=_,fe=S,b=he("electron-webrtc-relay:Bridge");W.exports=class extends fe{constructor(n){super(),this.i=0,this.queue=[],this.ready=!1,this.closing=!1,this.opts={debug:!1},this.resourceManager=void 0,typeof n>"u"&&(n={debug:!1}),this.opts=n,n.debug&&(b.enabled=!0)}_debug(n){this.opts.debug&&b(n)}init(){this._debug(`Initializing Relay: ${JSON.stringify(this.opts)}`),this.resourceManager=new le.default(this.opts,()=>{b("Bridge ready"),this.ready=!0,this._queue()}),ue.on("WRTCRelayData",(n,r)=>{typeof r=="object"&&(b(`Received: ${JSON.stringify(r)}`),this.emit(r[0],r[1]))})}_queue(){this.queue.forEach(n=>{this.resourceManager&&this.resourceManager.eval(n.reference,n.id,n.code)}),this.queue=[]}eval(n,r,a={},c){const h=!this.ready;typeof a=="function"&&(c=a,a={}),this._debug(`opts: ${JSON.stringify(a)} eval: ${JSON.stringify(r)}, BrowserWindow active: ${!h}`);const t=(this.i++).toString(36);if(this.once(t,s=>{let d=null;if(s.err&&(d=new Error(`Error evaluating "${r}" ${s.err}`),d.original=s.err),c)return d?c(d):c(null,s.res);d&&console.error(d)}),h){this.queue.push({id:t,code:r,reference:n});return}this.resourceManager&&this.resourceManager.eval(n,t,r)}close(){}};var pe=W.exports,v={exports:{}},m={exports:{}},ge=m.exports,A;function Q(){if(A)return m.exports;A=1,Object.defineProperty(ge,"__esModule",{value:!0});const l=S,n=_("RTCDC");m.exports=function(a,c){return class extends l.EventEmitter{constructor(t,s,d){super(),this.protocol="",this.addEventListener=this.addListener,typeof t=="object"?this._wrap(t):this._create(t,s,d)}_create(t,s,d){d=d||{},this._pcId=t,this.label=s,this.ordered=null,this.protocol="",this.id=this.stream=null,this.readyState="connecting",this.bufferedAmount=0,this._bufferedAmountLowThreshold=0,this._binaryType="blob",this.maxPacketLifeType=null,this.maxRetransmits=null,this.negotiated=!1,this.reliable=typeof d.reliable=="boolean"?d.reliable:!0,this.on("error",e=>c.emit("error",e,this)),a.eval(JSON.stringify(t),`
        var pc = conns[${JSON.stringify(t)}]
        var dc = pc.createDataChannel(
          ${JSON.stringify(s)}, ${JSON.stringify(d)})
        pc.dataChannels[dc.id] = dc
        // Queues messages that have been recieved before the message listener has been added
        dc.msgQueue = []
        dc.onmessage = function (eMsg) {
          dc.msgQueue.push(eMsg)
        }
        dc.id
      `,(e,i)=>{if(e)return console.error(e);this.id=this.stream=i,this._registerListeners(),this.emit("init")})}_wrap(t){for(let s in t)this[s]=t[s];this.stream=this.id,this._registerListeners(),this.on("error",s=>c.emit("error",s,this))}_registerListeners(t){a.on(`dc:${this._pcId}:${this.id}`,this.onMessage.bind(this)),this._eval(`
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
      `,t||(s=>{s&&console.error(s)}))}onMessage(t){const s=this["on"+t.type],d=t.event||{};switch(n("<<",this.id,t.type,t,!!s),t.type){case"open":this.readyState="open";break;case"message":if(t.dataType==="binary"){const e=new T(d.data,"base64");d.data=e.buffer.slice(e.byteOffset,e.byteOffset+e.byteLength)}break;case"close":this.readyState="closed";break}this.emit(t.type,d),s&&s(d)}close(){this.readyState="closing",this._eval("if (dc) dc.close()",t=>{t&&console.error(t)})}send(t){let s="";(t instanceof ArrayBuffer||t instanceof Uint8Array)&&(t=r(t)),t instanceof T&&(t=t.toString("base64"),s="data = base64ToArrayBuffer(data)"),this._eval(`
        if (dc.readyState === 'open') {
          var data = ${JSON.stringify(t)}
          ${s}
          dc.send(data)
        }
        dc.bufferedAmount
      `,(d,e)=>{if(d)return console.error(d);this.bufferedAmount=e})}_eval(t,s){if(!(typeof this._pcId>"u"))return a.eval(JSON.stringify(this._pcId),`
        var pc = conns[${JSON.stringify(this._pcId)}]
        var dc = pc.dataChannels[${JSON.stringify(this.id)}]
      `+t,s||(d=>{d&&console.error(d)}))}_setProp(t,s){return this.id==null?this.once("init",()=>this._setProp(t,s)):this._eval(`dc["${t}"] = ${JSON.stringify(s)}`)}get bufferedAmountLowThreshold(){return this._bufferedAmountLowThreshold}set bufferedAmountLowThreshold(t){this._bufferedAmountLowThreshold=t,this._setProp("bufferedAmountLowThreshold",t)}get binaryType(){return this._binaryType}set binaryType(t){this._binaryType=t,this._setProp("binaryType",t)}}};function r(a){const c=new T(a.byteLength),h=new Uint8Array(a);for(let t=0;t<c.length;++t)c[t]=h[t];return c}return m.exports}var we=v.exports,P;function ye(){if(P)return v.exports;P=1;var l=C&&C.__importDefault||function(c){return c&&c.__esModule?c:{default:c}};Object.defineProperty(we,"__esModule",{value:!0});const n=S,r=l(ee()),a=_("RTCPC");return v.exports=function(c,h){const t=Q()(c,h);let s=0;return class extends n.EventEmitter{constructor(e){if(super(),this.addEventListener=this.addListener,c.closing)throw new Error("Cannot create RTCPeerConnection, the electron-webrtc daemon has been closed");this._id=(s++).toString(36),this._dataChannels=new Map,this._offer=null,this._answer=null,this.iceConnectionState="new",this.iceGatheringState="new",this.localDescription=null,this.peerIdentity={catch:i=>{console.error(i)}},this.remoteDescription=null,this.signalingState="stable",c.on(`pc:${this._id}`,this.onMessage.bind(this)),c.eval(JSON.stringify(this._id),`
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
      `,i=>{i&&h.emit("error",i,this)})}onMessage(e){const i=this["on"+e.type],o=e.event||{};switch(a(this._id+"<<",e.type,e,!!i),e.type){case"addstream":break;case"datachannel":e.channel._pcId=this._id,o.channel=new t(e.channel),this._dataChannels.set(o.channel.id,o.channel);break;case"icecandidate":this.iceGatheringState=e.iceGatheringState,e.offer&&(this._offer=Object.assign(this._offer||{},e.offer));break;case"iceconnectionstatechange":this.iceConnectionState=e.iceConnectionState;break;case"removestream":break;case"signalingstatechange":this.signalingState=e.signalingState;break}this.emit(e.type,o),i&&i(o)}createDataChannel(e,i){const o=new t(this._id,e,i);return o.once("init",()=>this._dataChannels.set(o.id,o)),o}_getCreateArgs(e,i,o){return e&&i?{cb:e,errCb:i,options:o}:{options:e}}createOffer(e,i,o){let{cb:u,errCb:g,options:y}=this._getCreateArgs(e,i,o);return this._offer&&(u&&u(this._offer),Promise.resolve(this._offer)),this._callRemote("createOffer",`onSuccess, onFailure, ${JSON.stringify(y)}`,w=>{this._offer=w,u&&u(w)},g)}createAnswer(e,i,o){let{cb:u,errCb:g,options:y}=this._getCreateArgs(e,i,o);return this._answer&&(u&&u(this._answer),Promise.resolve(this._answer)),this._callRemote("createAnswer",`onSuccess, onFailure, ${JSON.stringify(y)}`,w=>{this._answer=w,u&&u(w)},g)}setLocalDescription(e,i,o){return this.localDescription=e,this._callRemote("setLocalDescription",`new RTCSessionDescription(${JSON.stringify(e)}), onSuccess, onFailure`,i,o)}setRemoteDescription(e,i,o){return this.remoteDescription=e,this._callRemote("setRemoteDescription",`new RTCSessionDescription(${JSON.stringify(e)}), onSuccess, onFailure`,i,o)}addIceCandidate(e,i,o){return this._callRemote("addIceCandidate",`new RTCIceCandidate(${JSON.stringify(e)}), onSuccess, onFailure`,i,o)}close(){this._eval(`
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
      `,i=>{for(let o of i){let u=o.stats;delete o.stats,o.names=()=>Object.keys(u),o.stat=g=>u[g]}e({result:()=>i})})}_eval(e,i,o){let u,g;const y=new Promise((p,U)=>{u=p,g=U}),w=r.default.randomBytes(16).toString("hex");return c.once(w,p=>{p.err?(o&&o(p.err),g(p.err)):(i&&i(p.res),u(p.res))}),c.eval(JSON.stringify(this._id),`
        (function () {
          var id = ${JSON.stringify(this._id)}
          var reqId = ${JSON.stringify(w)}
          var pc = conns[id]
          var onSuccess = function (res) {
            send(reqId, { res: res && res.toJSON ? res.toJSON() : res })
          }
          var onFailure = function (err) {
            send(reqId, { err: err })
          }
          ${e}
        })()
      `,p=>{p&&h.emit("error",p,this)}),y}_callRemote(e,i,o,u){return this._eval(`pc.${e}(${i||""})`,o,u)}}},v.exports}var D,N;function be(){return N||(N=1,D=class{constructor(n){this.type=n.type,this.sdp=n.sdp}toJSON(){return this}}),D}var O,q;function ve(){return q||(q=1,O=class{constructor(n){this.candidate=n.candidate,this.sdpMid=n.sdpMid,this.sdpMLineIndex=n.sdpMLineIndex}}),O}var me=I.exports;Object.defineProperty(me,"__esModule",{value:!0});const Ce=S,_e=pe;I.exports=function(l){const n=new _e(l),r=new Ce.EventEmitter;return Object.assign(r,{close:n.close.bind(n),electronDaemon:n,init:n.init.bind(n),RTCPeerConnection:ye()(n,r),RTCSessionDescription:be(),RTCIceCandidate:ve(),RTCDataChannel:Q()(n,r)})};var Se=I.exports;const Re=te(Se),G=Re();G.init();const B=V({wrtc:G}),Le={libp2p:{transports:[X(),F(),B.transport,H()],peerDiscovery:[B.discovery],addresses:{listen:z}}};export{Le as default};
//# sourceMappingURL=configÉlectronPrincipal-3UbzFUB4.js.map
