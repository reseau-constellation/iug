import{l as b,a as A,i as O,m as L,E as y,e as w,C as u,c as $,d as P,f as D,A as k,r as W,W as U,h as M,p as N,j as x}from"./index--LyCsnpX.js";import{p as G,t as H}from"./index-seMQp4q3.js";const I=421,F=290,B=2e3,f=b("libp2p:webrtc-star:socket");function C(o,e){const{sink:t,source:s}=o,n={remoteAddr:e.remoteAddr,async sink(r){e.signal!=null&&(r=A(r,e.signal));try{await t(r)}catch(l){l.type!=="aborted"&&f.error(l)}},source:e.signal!=null?A(s,e.signal):s,timeline:{open:Date.now()},async close(){if(o.closed)return;const r=Date.now(),l=setTimeout(()=>{if(n.remoteAddr!=null){const{host:i,port:a}=n.remoteAddr.toOptions();f("timeout closing socket to %s:%s after %dms, destroying it manually",i,a,Date.now()-r)}o.closed||o.close().catch(i=>{f.error("could not close socket",i)})},B);try{await o.close()}finally{clearTimeout(l)}}};return o.addEventListener("close",()=>{n.timeline.close==null&&(n.timeline.close=Date.now())},{once:!0}),n}function R(o){const e=o.toString().split("/"),t=o.protos()[1].name,s=o.protos()[2].name,n=o.stringTuples()[1][1];if(t!=="tcp"||s!=="ws"&&s!=="wss")throw new Error(`invalid multiaddr: ${o.toString()}`);if(!O(o))return`http://${e[2]}:${e[4]}`;if(s==="ws")return`http://${e[2]}${n==null||n==="80"?"":`:${n}`}`;if(s==="wss")return`https://${e[2]}${n==null||n==="443"?"":`:${n}`}`;throw new Error("invalid multiaddr: "+o.toString())}function j(o){const e="/libp2p-webrtc-star";if(o.startsWith(e)){o=o.substring(e.length,o.length);let t=L(o);const s=t.stringTuples().filter(n=>n[0]===421)[0];if(s[1]==null)throw new Error("invalid multiaddr: "+o);t=t.decapsulate("p2p"),t=t.encapsulate("/p2p-webrtc-star"),t=t.encapsulate(`/p2p/${s[1]}`),o=t.toString()}return o}const c=b("libp2p:webrtc-star:listener"),K={transports:["websocket"],path:"/socket.io-next/"};class V extends y{constructor(e,t,s,n,r){super(),this.signallingAddr=t,this.socket=$(e,K),this.connections=[],this.channels=new Map,this.pendingSignals=new Map,this.upgrader=s,this.handler=n,this.channelOptions=r,this.handleWsHandshake=this.handleWsHandshake.bind(this);let l=!1;this.socket.on("connect_error",i=>{l&&i.type==="TransportError"||this.dispatchEvent(new u("error",{detail:i}))}),this.socket.on("error",i=>{this.dispatchEvent(new u("error",{detail:i}))}),this.socket.on("ws-handshake",this.handleWsHandshake),this.socket.on("ws-peer",i=>{this.dispatchEvent(new u("peer",{detail:i}))}),this.socket.on("connect",()=>{this.socket.emit("ss-join",this.signallingAddr.toString()),l&&this.dispatchEvent(new u("reconnect"))}),this.socket.once("connect",()=>{l=!0,this.dispatchEvent(new u("listening"))}),this.socket.on("disconnect",()=>{this.dispatchEvent(new u("disconnect"))})}_createChannel(e,t,s){const n={...this.channelOptions},r=new P(n),l=i=>{const a=i.detail;c.error("incoming connection errored",a)};return r.addEventListener("error",l),r.addEventListener("close",()=>{r.removeEventListener("error",l)},{once:!0}),r.addEventListener("signal",i=>{const a=i.detail;this.socket.emit("ss-handshake",{intentId:e,srcMultiaddr:t,dstMultiaddr:s,answer:!0,signal:a})}),r.addEventListener("ready",()=>{const i=C(r,{remoteAddr:this.signallingAddr});c("new inbound connection %s",i.remoteAddr);try{this.upgrader.upgradeInbound(i).then(a=>{c("inbound connection %s upgraded",i.remoteAddr),this.connections.push(i);const g=()=>{this.connections=this.connections.filter(h=>h!==i),this.channels.delete(e),this.pendingSignals.delete(e)};r.addEventListener("close",g,{once:!0}),this.dispatchEvent(new u("connection",{detail:a})),this.handler(a)}).catch(a=>{c.error("inbound connection failed to upgrade",a),i.close().catch(g=>{c.error("inbound connection failed to close after failing to upgrade",g)})})}catch(a){c.error("inbound connection failed to upgrade",a),i.close().catch(g=>{c.error("inbound connection failed to close after failing to upgrade",g)})}},{once:!0}),r}handleWsHandshake(e){if(c('incoming handshake. signal type "%s" is answer %s',e.signal.type,e.answer),e.answer===!0||e.err!=null||e.intentId==null)return;const t=e.intentId;let s=this.pendingSignals.get(t);s==null&&(s=[],this.pendingSignals.set(t,s)),s.push(e);let n=this.channels.get(t);if(n==null){if(e.signal.type!=="offer"){c("handshake is not an offer and channel does not exist, buffering until we receive an offer");return}c("creating new channel to handle offer handshake"),n=this._createChannel(e.intentId,e.srcMultiaddr,e.dstMultiaddr),this.channels.set(t,n)}else c("channel already exists, using it to handle handshake");for(;s.length>0;){const r=s.shift();r?.signal!=null&&n.handleSignal(r.signal)}}async close(){this.socket.emit("ss-leave",this.signallingAddr.toString()),this.socket.removeAllListeners(),this.socket.close(),await Promise.all([...this.connections.map(async e=>{await e.close()}),...Array.from(this.channels.values()).map(async e=>{await e.close()})]),this.dispatchEvent(new u("close"))}}class Y extends y{constructor(e,t,s,n,r){super(),this.upgrader=e,this.handler=t,this.peerId=s,this.transport=n,this.options=r}async listen(e){if(this.listeningAddr!=null)throw w(new Error("listener already in use"),"ERR_ALREADY_LISTENING");const t=G();this.listeningAddr=e;let s;e.protoCodes().includes(I)?s=e:s=e.encapsulate(`/p2p/${this.peerId.toString()}`);const n=this.signallingUrl=R(e);c("connecting to signalling server on: %s",this.signallingUrl);const r=new V(this.signallingUrl,s,this.upgrader,this.handler,this.options.channelOptions);r.addEventListener("error",l=>{const i=l.detail;c("error connecting to signalling server %o",i),r.close().catch(a=>{c.error("error closing server after error",a)}),t.reject(i)}),r.addEventListener("listening",()=>{c("connected to signalling server"),this.dispatchEvent(new u("listening")),t.resolve()}),r.addEventListener("peer",l=>{this.transport.peerDiscovered(l.detail)}),r.addEventListener("connection",l=>{const i=l.detail;if(i.remoteAddr==null)try{i.remoteAddr=e.decapsulateCode(I).encapsulate(`/p2p/${i.remotePeer.toString()}`)}catch(a){c.error("could not determine remote address",a)}this.dispatchEvent(new u("connection",{detail:i}))}),r.addEventListener("disconnect",()=>{this.transport.sigServers.delete(n)}),r.addEventListener("reconnect",()=>{this.transport.sigServers.set(n,r)}),this.transport.sigServers.set(this.signallingUrl,r),await t.promise}async close(){if(this.signallingUrl!=null){const e=this.transport.sigServers.get(this.signallingUrl);e!=null&&(await e.close(),this.transport.sigServers.delete(this.signallingUrl))}this.dispatchEvent(new u("close")),this.listeningAddr=void 0}getAddrs(){return this.listeningAddr!=null?[this.listeningAddr]:[]}}function q(o,e,t,s,n){return new Y(o,e,t,s,n)}const z="RTCPeerConnection"in globalThis,p=b("libp2p:webrtc-star"),J=()=>{};class Q extends y{constructor(){super(...arguments),this.started=!1}get[x](){return!0}get[Symbol.toStringTag](){return"@libp2p/webrtc-star-discovery"}isStarted(){return this.started}async start(){this.started=!0}async stop(){this.started=!1}dispatchEvent(e){return this.isStarted()?super.dispatchEvent(e):!1}}class X{constructor(e){e?.wrtc!=null&&(this.wrtc=e.wrtc),this.sigServers=new Map,this._discovery=new Q,this.discovery=()=>this._discovery,this.peerDiscovered=this.peerDiscovered.bind(this)}get[D](){return!0}get[Symbol.toStringTag](){return"@libp2p/webrtc-star"}async dial(e,t){const s=await this._connect(e,t),n=C(s,{remoteAddr:e,signal:t.signal});p("new outbound connection %s",n.remoteAddr);const r=await t.upgrader.upgradeOutbound(n);return p("outbound connection %s upgraded",n.remoteAddr),r}async _connect(e,t){if(t.signal?.aborted===!0)throw new k;const s={...t.channelOptions??{}};this.wrtc!=null&&(s.wrtc=this.wrtc);const n=e.toOptions(),r=H(W(36),"hex");return await new Promise((l,i)=>{const a=this.sigServers.get(R(e));if(a?.socket==null){i(w(new Error("unknown signal server to use"),"ERR_UNKNOWN_SIGNAL_SERVER"));return}let g=!1;p("dialing %s:%s",n.host,n.port);const h=new U(s),_=d=>{const v=d.detail;if(!g){const T=`connection error ${n.host}:${n.port}: ${v.message}`;p.error(T),E(v)}},m=()=>{g=!0,p("connection opened %s:%s",n.host,n.port),E()},S=()=>{p.error("connection aborted %s:%s",n.host,n.port),h.close().finally(()=>{E(new k)})},E=d=>{h.removeEventListener("ready",m),t.signal?.removeEventListener("abort",S),d==null?l(h):i(d)};h.addEventListener("ready",m,{once:!0}),h.addEventListener("close",()=>{h.removeEventListener("error",_)}),t.signal?.addEventListener("abort",S),h.addEventListener("signal",d=>{const v=d.detail;a.socket.emit("ss-handshake",{intentId:r,srcMultiaddr:a.signallingAddr.toString(),dstMultiaddr:e.toString(),signal:v})}),a.socket.on("ws-handshake",d=>{d.intentId===r&&d.err!=null&&h.close().finally(()=>{i(w(new Error(d.err),"ERR_SIGNALLING_FAILED"))}),!(d.intentId!==r||d.answer==null||h.closed)&&h.handleSignal(d.signal)})})}createListener(e){if(!z&&this.wrtc==null)throw w(new Error("no WebRTC support"),"ERR_NO_WEBRTC_SUPPORT");if(e.channelOptions=e.channelOptions??{},this.wrtc!=null&&(e.channelOptions.wrtc=this.wrtc),this.peerId==null)throw w(new Error("PeerId not set"),"ERR_MISSING_PEER_ID");return q(e.upgrader,e.handler??J,this.peerId,this,e)}filter(e){return e=Array.isArray(e)?e:[e],e.filter(t=>t.protoCodes().includes(F)?!1:M.matches(t))}peerDiscovered(e){p("peer discovered: %s",e),e=j(e);const t=L(e),s=t.getPeerId();if(s==null)return;const n=N(s);this._discovery.dispatchEvent(new u("peer",{detail:{id:n,multiaddrs:[t],protocols:[]}}))}}function te(o={}){const e=new X(o);return{transport:t=>(e.peerId=t.peerId,e),discovery:e.discovery}}export{te as w};
//# sourceMappingURL=index-jCJ-Oi1N.js.map