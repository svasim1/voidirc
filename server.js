const Koa = require('koa');
const app = new Koa();

// HTTP Status codes

const HTTP_OK       = 200;
const HTTP_INVALID  = 400;
const HTTP_NOTFOUND = 404;
const HTTP_INTERNAL = 500;
// Startup/shutdown of server
const port          = 8080;
const serverstarttime = Date.now();
let server          = null;
// API Handler functions

async function errorPage(ctx)
{
    
    ctx.status  = 404
    ctx.body    = "Page not found"
}

// dontCrashOnError: Catch error and display in web browser
async function dontCrashOnError(ctx, next) 
{
    // Set to true in productioncode so we do not display internal error to customers
    productionCode = false; 
    try 
    { 
        await next(); 
    } 
    catch (err) 
    {
        if(!productionCode)
        {
            ctx.status  = err.status || HTTP_INVALID; 
            ctx.body    = { message: err.message }; 
        }
        else
        { 
            errorPage(ctx);
        }
    } 
 } 

// accessLogger: Log all requests; with method and URL
async function accessLogger(simplectx,next)
{
  const t   = Date.now();
  console.log(`${t-serverstarttime}(ms): ${simplectx.method} ${simplectx.url}`);
  // After loggin, send it to the real handler. 
  if(next)
    await next(); 
}

// helloWorld: Greet the user
async function helloWorld(ctx,next)
{
   ctx.body = 'Hello World!';
   if (next) await next(); 
}


// API Definition
app.use(accessLogger);
app.use(helloWorld);

// Startup/shutdown of server

function shutdownServer() {
    console.log('\nReceived SIGINT. Initiating server closing...');
    
    // Anachronic:Can't await on server close
    server.close(onServerClose);
}

function onServerClose() 
{
    accessLogger({ method:"STOP", url:"Server shutdown at localhost:"+port }, null )
    process.exit(0);
}



async function startServer() 
{
    try 
    {
        accessLogger({ method:"START", url:"Server at localhost:"+port }, null )
        server = await app.listen(port);
        process.once('SIGINT', shutdownServer); 
        
    } 
    finally 
    {
        // dontCrashOnError({ method:"START", url:"Server at localhost:"+port },null);
        // shutdownServer();
    }
}
startServer();