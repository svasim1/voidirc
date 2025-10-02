module.exports = function handleNick(ctx, parsed) {
    const nick = parsed.data;

    if (!nick) {
        ctx.websocket.send(JSON.stringify({ 
            type: 'ERROR', 
            message: 'Nick cannot be empty.' 
        }));
        return;
    }

    ctx.nick = nick; // Spara nick i ctx
    ctx.websocket.send(JSON.stringify({
        type: 'NICK',
        message: `Nickname set to ${nick}`
    }));

    console.log(`User set nickname: ${nick}`);
};
