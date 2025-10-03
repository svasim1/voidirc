export default function handleJoin(ctx, parsed, rooms) {
    const room = Array.isArray(parsed.data) ? parsed.data[0] : parsed.data;

    if (!room) {
        ctx.websocket.send(JSON.stringify({ 
            type: 'ERROR', 
            message: 'Room name required.' 
        }));
        return;
    }

    // Om användaren redan är i ett rum → ta bort dem därifrån först
    if (ctx.room && rooms.has(ctx.room)) {
        rooms.get(ctx.room).delete(ctx);

        // om rummet nu är tomt → ta bort det helt
        if (rooms.get(ctx.room).size === 0) {
            rooms.delete(ctx.room);
        }
    }

    // Lägg till i nytt rum
    if (!rooms.has(room)) {
        rooms.set(room, new Set());
    }

    rooms.get(room).add(ctx);
    ctx.room = room;

    ctx.websocket.send(JSON.stringify({
        type: 'JOIN',
        message: `Joined room ${room}`
    }));

    console.log(`${ctx.nick || "Anonymous"} joined room ${room}`);
};