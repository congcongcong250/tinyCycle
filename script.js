// Logic
function main(){
    return xs.periodic(1000)
        .fold(prev => prev + 1, 0)
        .map(i => `Seconds elapsed: ${i}`);
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
domDriver(sink);
logDriver(sink);