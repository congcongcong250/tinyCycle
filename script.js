// Logic
function main(){
    return {
        DOM: xs.periodic(1000)
            .fold(prev => prev + 1, 0)
            .map(i => `Seconds elapsed: ${i}`),
        log: xs.periodic(2000)
            .fold(prev => prev + 1, 0)
    }
}

// Effects
function domDriver(text$){   
    text$.subscribe({
        next: str => {
            const el = document.querySelector('#app');
            el.textContent = str;
        }
    })
}

function logDriver(msg$){
    msg$.subscribe({
        next: msg => {
            console.log(msg);
        }
    });
}

// A one-way flow sink
const sink = main();
domDriver(sink.DOM);
logDriver(sink.log);