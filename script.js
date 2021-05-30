// Logic
function main(sources) {
    const click$ = sources.DOM;
    return {
        DOM: click$.startWith(null)
            .map(() =>
                xs.periodic(1000)
                    .fold(prev => prev + 1, 0)
            )
            .flatten()
            .map(i => `Seconds elapsed: ${i}`),
        log: xs.periodic(2000)
    }
}

// source = input (read) effect
// sink = output (write) effect

// Effects
function domDriver(text$) {
    text$.subscribe({
        next: str => {
            const el = document.querySelector('#app');
            el.textContent = str;
        }
    })

    const domSource = fromEvent(document, 'click');
    return domSource;
}

function logDriver(msg$) {
    msg$.subscribe({
        next: msg => {
            console.log(msg);
        }
    });
}

// Bootstrap
function run(mainFn, drivers) {
    // cycleJS
    // b = f(a)
    // a = g(b)
    // const sink = mainFn(domSource);
    // const domSource = domDriver(sink.DOM);

    // fakeA = ...
    // b = f(fakeA)
    // a = g(b)
    // fakeA.behaveLike(a);
    // const fakeDOMSink = xs.create();
    // const domSource = domDriver(fakeDOMSink);
    // const sink = mainFn({ DOM: domSource });
    // fakeDOMSink.imitate(sink.DOM);

    const fakeDOMSinks = {};
    Object.keys(drivers).forEach(k => {
        fakeDOMSinks[k] = xs.create();
    })

    const sources = {};
    Object.keys(drivers).forEach(k => {
        sources[k] = drivers[k](fakeDOMSinks[k]);
    })

    const sinks = mainFn(sources);

    Object.keys(fakeDOMSinks).forEach(k => {
        fakeDOMSinks[k].imitate(sinks[k]);
    })
}

run(main, {
    DOM: domDriver,
    log: logDriver
})