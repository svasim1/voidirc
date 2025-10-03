import Koa from 'koa';
import websocket from 'koa-websocket';
import serve from 'koa-static';
import handleNick from './handlers/nick.js';
import handleJoin from './handlers/join.js';
import handleMsg from './handlers/msg.js';

const koa = new Koa();
const app = websocket(koa);

// HTTP status codes
const HTTP_OK       = 200;
const HTTP_INVALID  = 400;
const HTTP_NOTFOUND = 404;
const HTTP_INTERNAL= 500;

// startup/shutdown of server
const port = 8080;
const serverstarttime = Date.now();
let server = null;

// in-memory storage for users and rooms
const users = new Map();
const rooms = new Map(); 

// serve error page
async function errorPage(ctx) {
    ctx.redirect('/error.html');
}

// serve index page
koa.use(async (ctx, next) => {
    if (ctx.path === '/') {
        ctx.redirect('/index.html');
    } else {
        await next();
    }
});

// serve static pages
koa.use(serve('./static'));

// 404 handler
koa.use(async (ctx) => {
    await errorPage(ctx);
});

server = koa.listen(port, '0.0.0.0');
console.log(`Server started on http://0.0.0.0:${port}`);


// websocket
app.ws.use(async(ctx) => {
    console.log('WebSocket connection established');
    
    // initialize user tracking
    users.set(ctx.websocket, {nick: null, room: null});

    // handle messages
    ctx.websocket.on('message', (message) => {
        let parsed;

        // parse JSON message
        try {
        parsed = JSON.parse(message);
        console.log("Parsed message:", parsed);
        } catch (error) {
            console.error('Error parsing WebSocket message:', error);
        }

        if (parsed.type === 'NICK') // {"type": "NICK", "data": "<name>"}
            handleNick(ctx, parsed, users);
        else if (parsed.type === 'JOIN') // {"type": "JOIN", "data": "<room>"}
            handleJoin(ctx, parsed, rooms);
        else if (parsed.type === 'MSG') // {"type": "MSG", "data": "<message>"}
            handleMsg(ctx, parsed, rooms);
        else if (parsed.type === 'LIST')
            ctx.websocket.send(JSON.stringify({ type: 'LIST', rooms: Array.from(rooms.keys()) }));
        else if (parsed.type === 'QUIT') // {"type": "QUIT"}
            ctx.websocket.close();
    });
});