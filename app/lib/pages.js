class Button {
    constructor(anchor, img, task) {
        this.anchor = anchor;
        this.img = img;
        this.task = task;
    }
}

class PageBuilder {
    constructor(name, controller, layout, buttons) {
        this.name = name;
        this.controller = controller;
        this.layout = layout;
        this.buttons = buttons;
    }

    build(metadata = null) {
        const el = document.createElement('page');
        el.innerHTML =
            '<header><div class="left"></div><div class="right"></div></header><p class="nameP"></p><page-content></page-content>';

        const shadow = el
            .querySelector('page-content')
            .attachShadow({ mode: 'open' });

        el.querySelector('.nameP').textContent = this.name;

        const controller = new this.controller(shadow, metadata);

        this.buttons.forEach(button => {
            const btnEl = document.createElement('img');
            btnEl.src = button.img;

            if (button.task != null)
                btnEl.addEventListener('click', () => {
                    controller['task' + button.task]();
                });

            if (button.anchor == 'right') {
                el.querySelector('.right').appendChild(btnEl);
            } else {
                el.querySelector('.left').appendChild(btnEl);
            }
        });

        shadow.innerHTML = this.layout;

        return new Page(this.name, controller, el, shadow, this);
    }
}

class PageController {
    constructor(el, metadata) {
        this.el = el;
        this.metadata = metadata;
    }
    onEnter() {}
    onLeave() {}
    taskGoBack() {
        const newPage = PageManager.prevPage.builder.build();
        PageManager.setPage(newPage);
    }
}

class Page {
    constructor(name, controller, el, content, builder) {
        this.name = name;
        this.controller = controller;
        this.controller.page = this;
        this.el = el;
        this.content = content;
        this.builder = builder;
    }
}

if (!window.PageManager)
    window.PageManager = {
        page: null,
        prevPage: null,
        setPage(page) {
            if (this.page != null) {
                this.page.controller.onLeave();
                this.page.el.remove();
            }

            this.prevPage = this.page;
            this.page = page;

            this.page.controller.onEnter();
            document.body.appendChild(this.page.el);
        }
    };

if (!window.LayoutManager)
    window.LayoutManager = {
        layouts: {},
        promises: [],
        get(name) {
            return this.layouts[name];
        },
        async loadInternal(name, url) {
            const res = await fetch(url);
            const text = await res.text();

            this.layouts[name] = text;
        },
        load(name, url) {
            const prom = this.loadInternal(name, url);
            this.promises.push(prom);
            return prom;
        },
        onAllLoaded() {
            return Promise.all(this.promises);
        }
    };

export { Button, Page, PageBuilder, PageController };
