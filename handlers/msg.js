export default function handleMsg(ctx, parsed, activeRooms) {
    const message = Array.isArray(parsed.data) ? parsed.data.join(' ') : parsed.data; 
    const room = ctx.room;
    const nick = ctx.nick || "Anonymous";

    if (!room) {
        ctx.websocket.send(JSON.stringify({ 
            type: 'ERROR', 
            message: 'You must join a room before sending messages.' 
        }));
        return;
    }

    // Broadcast till alla i rummet
    for (const clientCtx of activeRooms.get(room)) {
        if (clientCtx.websocket.readyState === 1) { // 1 = OPEN
            clientCtx.websocket.send(JSON.stringify({
                type: 'MSG',
                from: nick,
                data: message,
                room: room
            }));
        }
    }

    console.log(`[${room}] ${nick}: ${message}`);
};
