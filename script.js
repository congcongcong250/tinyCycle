// h
const h = (tagName, children) => ({ tagName, children });
const span = (children) => h('span', children);
const h1 = (children) => h('h1', children);
const h2 = (children) => h('h2', children);

// Logic
function main(sources) {
    const click$ = sources.DOM.selectEvents('span', 'click');
    return {
        DOM: click$.startWith(null)
            .map(() =>
                xs.periodic(1000)
                    .fold(prev => prev + 1, 0)
            )
            .flatten()
            .map(i =>
                h2([
                    span([`Seconds elapsed: ${i}`])
                ])
            ),
        log: xs.periodic(2000)
    }
}

// source = input (read) effect
// sink = output (write) effect

// Effects
function makeDOMDriver(rootId) {
    return function domDriver(obj$) {
        function createElement(obj) {
            const el = document.createElement(obj.tagName);
            obj.children.forEach(child => {
                let childEl;
                if (typeof child === 'string') {
                    childEl = document.createTextNode(child);;
                } else if (child.tagName) {
                    childEl = createElement(child);
                }
                childEl && el.appendChild(childEl);
            })
            return el;
        }

        obj$.subscribe({
            next: obj => {
                const el = document.querySelector(rootId);
                el.textContent = '';
                el.appendChild(createElement(obj));
            }
        })

        const domSource = {
            selectEvents:
                (tagName, ev) => {
                    return fromEvent(document, ev)
                        .filter(ev => ev.target.tagName.toUpperCase() === tagName.toUpperCase());
                }
        };
        return domSource;
    }
}

function logDriver(msg$) {
    msg$.subscribe({
        next: msg => {
            console.log(msg);
        }
    });
}

Cycle.run(main, {
    DOM: makeDOMDriver('#app'),
    log: logDriver
});

// Bootstrap
/*
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
*/