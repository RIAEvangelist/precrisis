import server from 'node-http-server';

//console.log=()=>{};
const API_DELAY=1000;

const config=new server.Config;

server.maxHeadersCount=20;

config.domain='precrisis.ai';

//setup basic server configs and allow http serving with https serving
config.verbose=false;
config.port=80;
config.root=`${import.meta.url.slice(7,-10)}/`;
config.server.noCache=false;
config.server.index='index.html';

//add ssl certs and set ssl port
config.https.privateKey = '/etc/letsencrypt/live/precrisis.ai/privkey.pem';//`./server.key`;
config.https.certificate= '/etc/letsencrypt/live/precrisis.ai/cert.pem';//`./server.crt`;
config.https.port       = 443;

config.domains={
    'api.precrisis.ai':`${import.meta.url.slice(7,-10)}/`,
    'precrisis.ai':`${import.meta.url.slice(7,-10)}/`
}

config.contentType.mp4='video/mp4';

config.errors.headers['Content-Type']='text/html';
config.errors[301]='Insecure request, redirecting to encrypted channel.';
config.errors[403]=`
<h1>
    403
</h1>
<h2>
    It Is Forbidden.
</h4>
<br>
<a href='https://tenor.com/view/gandalf-gif-21299855'>
    <img src='https://c.tenor.com/Y4R-ZKjyVMIAAAAC/tenor.gif' />
</a>
`;
config.errors[404]=`
<h1>
    404
</h1>
<br>
<a href='https://tenor.com/view/404-error404-http404-http-funny-gif-27148630'>
    <img src='https://c.tenor.com/cllnNS18E0wAAAAd/tenor.gif' />
</a>
`;
config.errors[500]=`
<h1>
    500
</h1>
<h2>
    Huh?
</h4>
<br>
<a href='https://tenor.com/view/mandalorian-stormtrooper-gun-doesnt-work-doesnt-work-jason-sudeikis-gif-15910750'>
    <img src='https://c.tenor.com/9CPjkfAcxLoAAAAd/tenor.gif' />
</a>
`;

const acceptableRoots=[
    '?utm_source=pwa_install'
]

let banList={};

setInterval(
    ()=>{
        banList={};
    },
    1000*60*60
)

async function delay(duration){
  return new Promise((resolve) => setTimeout(resolve, duration));
}

async function ban(request){
    const IP=request.socket.remoteAddress;
    if(!banList[IP]){
        banList[IP]=0;
    }
    banList[IP]++;
    if(banned(request)){
        banHammer(request);
    }
}

function banned(request){
    const IP=request.socket.remoteAddress;
    if(!banList[IP]){
        return false;
    }
    
    if(banList[IP]>2){
        //console.log('banned');
        //console.log(banList)
        return true;
    }
    
    return false;
}

function banHammer(request){
    console.log(`HAMMER DOWN ${request.socket.remoteAddress}`);
    request.destroy();
}

//temp open server


server.deploy(server.config);
