import type { Provider } from '@lexical/yjs'
import { WebrtcProvider } from 'y-webrtc'
import * as Y from 'yjs'

let idSuffix = 0 // In React Strict mode "new WebrtcProvider" may be called twice.

/**
 * Peer-to-peer Yjs provider. With no signaling server (production) it falls back
 * to the BroadcastChannel API, so two same-origin tabs/iframes sync live with no
 * server. Locally it can also use a signaling server for cross-browser testing.
 */
export function createWebRTCProvider(
  id: string,
  yjsDocMap: Map<string, Y.Doc>
): Provider {
  const doc = getDocFromMap(id, yjsDocMap)
  const provider = new WebrtcProvider(`${id}/${idSuffix++}`, doc, {
    peerOpts: { reconnectTimer: 100 },
    signaling: window.location.hostname === 'localhost' ? ['ws://localhost:1235'] : [],
  })
  // @ts-expect-error — WebrtcProvider satisfies the Lexical Provider shape.
  return provider
}

function getDocFromMap(id: string, yjsDocMap: Map<string, Y.Doc>): Y.Doc {
  let doc = yjsDocMap.get(id)
  if (doc === undefined) {
    doc = new Y.Doc()
    yjsDocMap.set(id, doc)
  } else {
    doc.load()
  }
  return doc
}
