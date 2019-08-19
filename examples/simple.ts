// Can choose where you configs are loaded
import { InMemoryPeers } from '../packages/rafiki-core/src/services/peers'
import { InMemoryRouter } from '../packages/rafiki-core/src/services/router'
import { createApp, getBearerToken, RafikiContext, RafikiMiddleware } from '../packages/rafiki-core/src'
import { pino } from '../packages/rafiki-logger-pino'

// Setup minimum required setup
const peers = new InMemoryPeers()
peers.add({
  id: 'alice',
  relation: 'child',
  defaultAccountId : 'test',
  isCcpReceiver: false,
  isCcpSender: false
})

const router = new InMemoryRouter(peers, {
  globalPrefix: 'test',
  ilpAddress: 'test.bob'
})

// Define a custom auth function
const auth: RafikiMiddleware = async (ctx: RafikiContext, next: () => Promise<any>) => {
  const token = getBearerToken(ctx)
  if (token === 'alice') {
    ctx.state.user = {
      active: true,
      sub: 'alice'
    }
  } else if (token === 'bob') {
    ctx.state.user = {
      active: true,
      sub: 'bob'
    }
  } else {
    throw new Error('cant auth token')
  }
  await next()
}

// Create Rafiki and set out to look for alice an bob peers
const app = createApp({
  auth,
  peers,
  router,
  logger: pino()
},
  (ctx: RafikiContext) => {
    ctx.ilp.respond({
      fulfillment: Buffer.alloc(32),
      data: Buffer.alloc(0)
    })
  }
)

// app.on('info', console.log)
// app.on('warn', console.log)
// app.on('error', console.error)
// app.on('debug', console.log)

app.listen(3000)
