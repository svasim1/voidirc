export default function handleJoin(ctx, parsed, activeRooms) {
    const room = Array.isArray(parsed.data) ? parsed.data[0] : parsed.data;

    if (!room) {
        ctx.websocket.send(JSON.stringify({ 
            type: 'ERROR', 
            message: 'Room name required.' 
        }));
        return;
    }

    // Lägg till ctx i rummet
    if (!activeRooms.has(room)) {
        activeRooms.set(room, new Set());
    }

    activeRooms.get(room).add(ctx);
    ctx.room = room;

    ctx.websocket.send(JSON.stringify({
        type: 'JOIN',
        message: `Joined room ${room}`
    }));

    console.log(`${ctx.nick || "Anonymous"} joined room ${room}`);
};
