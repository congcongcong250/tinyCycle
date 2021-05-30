// Logic
function main() {
    return {
        DOM: xs.periodic(1000)
            .fold(prev => prev + 1, 0)
            .map(i => `Seconds elapsed: ${i}`),
        log: xs.periodic(2000)
            .fold(prev => prev + 1, 0)
    }
}

// Effects
function domDriver(text$) {
    text$.subscribe({
        next: str => {
            const el = document.querySelector('#app');
            el.textContent = str;
        }
    })
}

function logDriver(msg$) {
    msg$.subscribe({
        next: msg => {
            console.log(msg);
        }
    });
}

function run(mainFn, drivers) {
    // A one-way flow sink
    const sink = mainFn();
    Object.keys(sink).forEach(k => {
        drivers[k](sink[k]);
    })
}

run(main, {
    DOM: domDriver,
    log: logDriver
})