export default function handleNick(ctx, parsed, users) {
    const nick = Array.isArray(parsed.data) ? parsed.data[0] : parsed.data;

    if (!nick) {
        ctx.websocket.send(JSON.stringify({ 
            type: 'ERROR', 
            message: 'Nick cannot be empty.' 
        }));
        return;
    }

    for (const user of users.values()) {
        if (user.nick && user.nick.toLowerCase() === nick.toLowerCase()) {
            ctx.websocket.send(JSON.stringify({ 
            type: 'ERROR', 
            message: 'Nick cannot be the same as somene else.' 
            }));
            return;
        }
    }

    // update in both ctx and map
    ctx.nick = nick;
    const user = users.get(ctx.websocket);
    if (user) {
        user.nick = nick;
    }
    
    ctx.websocket.send(JSON.stringify({
        type: 'NICK',
        message: `Nickname set to ${nick}`
    }));

    console.log(`User set nickname: ${nick}`);
};
