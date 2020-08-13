//Scrappers

function supichkaScraper(html) {
    const recipe = {};

    //Name
    recipe.name = html.querySelector("[property='name'] > h1").textContent;

    //Ingredients
    recipe.ingredients = [];
    html.querySelectorAll('.single-recipe-ingredients > ul > li').forEach(
        node => {
            const ingredient = node.querySelector('.ingredient').textContent;
            const amount = node.querySelector('.qt').textContent;
            const amountNotes = node.querySelector('.qt-notes').textContent;
            if (amountNotes == '') {
                recipe.ingredients.push(amount + ' ' + ingredient);
            } else {
                recipe.ingredients.push(
                    `${amount} ${amountNotes} ${ingredient}`
                );
            }
        }
    );

    //Steps
    recipe.steps = [];
    html.querySelectorAll('.recipe-content > ol > li').forEach(node => {
        recipe.steps.push(node.textContent);
    });

    //Clean-up
    recipe.ingredients = recipe.ingredients.filter(
        e => e.replace(/[\s\n]+/g, '').length != 0
    );

    recipe.steps = recipe.steps.filter(
        e => e.replace(/[\s\n]+/g, '').length != 0
    );

    return recipe;
}

function gotvachScraper(html) {
    const recipe = {};

    //Name
    recipe.name = html.querySelector('h1').textContent;

    //Change ingredient seperators
    html.querySelectorAll('.sub').forEach(node => {
        if (!node.textContent.toLowerCase().includes('за '))
            node.textContent = 'За ' + node.textContent;
    });

    //Ingredients
    recipe.ingredients = [];
    html.querySelectorAll('.products > ul > li').forEach(node => {
        recipe.ingredients.push(node.textContent);
    });

    //Steps
    recipe.steps = [];
    html.querySelectorAll('.text > p').forEach(node => {
        recipe.steps.push(node.textContent);
    });

    recipe.steps.pop(); //Remove the last paragraph (it`s unneeded)

    //Clean-up
    recipe.ingredients = recipe.ingredients.filter(
        e => e.replace(/[\s\n]+/g, '').length != 0
    );

    recipe.steps = recipe.steps.filter(
        e => e.replace(/[\s\n]+/g, '').length != 0
    );

    return recipe;
}

function kulinarScraper(html) {
    const recipe = {};

    //Name
    recipe.name = html.querySelector('.recipeDetails > .title').textContent;

    //Ingredients
    recipe.ingredients = [];
    html.querySelectorAll('.productsList > .item').forEach(node => {
        recipe.ingredients.push(
            node.querySelector('span').textContent +
                ' ' +
                node.querySelector('a').textContent
        );
    });

    //Steps
    recipe.steps = [];
    html.querySelectorAll('.making > .item > p').forEach(node => {
        recipe.steps.push(node.textContent);
    });

    //Clean-up
    recipe.ingredients = recipe.ingredients.filter(
        e => e.replace(/[\s\n]+/g, '').length != 0
    );

    recipe.steps = recipe.steps.filter(
        e => e.replace(/[\s\n]+/g, '').length != 0
    );

    return recipe;
}

function _1001receptiScraper(html) {
    const recipe = {};

    const json = JSON.parse(
        html.querySelector("script[type='application/ld+json']").innerText
    );

    //Name
    recipe.name = json.name;

    //Ingredients
    recipe.ingredients = json.recipeIngredient;

    //Steps
    recipe.steps = json.recipeInstructions.map(step => step.text);

    //Clean-up
    recipe.ingredients = recipe.ingredients.filter(
        e => e.replace(/[\s\n]+/g, '').length != 0
    );

    recipe.steps = recipe.steps.filter(
        e => e.replace(/[\s\n]+/g, '').length != 0
    );

    return recipe;
}

function receptiteScraper(html) {
    const recipe = {};

    //Name
    recipe.name = html.querySelector("[itemprop='name']").innerText;

    //Ingredients
    recipe.ingredients = Array.from(
        html.querySelectorAll("[itemprop='ingredients']")
    ).map(el => {
        if (el.querySelector('.prod_za')) return el.innerText;
        return el.innerText.slice(2);
    });

    //Steps
    recipe.steps = html
        .querySelector("[itemprop='recipeInstructions']")
        .innerHTML.split('<br>');

    //Clean-up
    recipe.ingredients = recipe.ingredients.filter(
        e => e.replace(/[\s\n]+/g, '').length != 0
    );

    recipe.steps = recipe.steps.filter(
        e => e.replace(/[\s\n]+/g, '').length != 0
    );

    return recipe;
}

function bonapetiScraper(html) {
    const recipe = {};

    //Name
    recipe.name = html.querySelector('h1').innerText;

    //Extra
    html.querySelectorAll('.recipeProductsContainer b').forEach(el => {
        const span = document.createElement('span');
        span.innerText = el.innerText;
        el.replaceWith(span);
    });

    //Ingredients
    recipe.ingredients = Array.from(
        html.querySelectorAll('.recipeProductsContainer span')
    ).map(el => el.innerText);

    //Steps
    recipe.steps = Array.from(html.querySelectorAll('.stepDescription')).map(
        el => el.textContent
    );

    //Clean-up
    recipe.ingredients = recipe.ingredients.filter(
        e => e.replace(/[\s\n]+/g, '').length != 0
    );

    recipe.steps = recipe.steps.filter(
        e => e.replace(/[\s\n]+/g, '').length != 0
    );

    return recipe;
}

function ezineScraper(html) {
    const recipe = {};

    //Name
    recipe.name = html.querySelector('h1').textContent;

    //Change ingredient seperators
    html.querySelectorAll('.sub').forEach(node => {
        if (!node.textContent.toLowerCase().includes('за '))
            node.textContent = 'За ' + node.textContent;
    });

    //Ingredients
    recipe.ingredients = [];
    html.querySelectorAll('.products > ul > li').forEach(node => {
        recipe.ingredients.push(node.textContent);
    });

    //Steps
    recipe.steps = Array.from(html.querySelectorAll('.desc')).map(
        el => el.innerText
    );

    //Clean-up
    recipe.ingredients = recipe.ingredients.filter(
        e => e.replace(/[\s\n]+/g, '').length != 0
    );

    recipe.steps = recipe.steps.filter(
        e => e.replace(/[\s\n]+/g, '').length != 0
    );

    return recipe;
}

//Validator

function validate(url, scrappers) {
    const hostname = new URL(url).hostname;
    const scrapper = scrappers[hostname];

    const err = new Error(`${hostname} is not supported!`);
    err.name = 'NotSupportedWebsiteError';
    err.hostname = hostname;

    if (scrapper == null) throw err;

    return [scrapper, hostname];
}

//Fetcher

async function fetchSite(url, charSet) {
    const res = await fetch(`${window.corsProxy}${url}`);
    let text = '';

    if (charSet == null) {
        text = await res.text();
    } else {
        text = new TextDecoder(charSet).decode(await res.arrayBuffer());
    }

    return new DOMParser().parseFromString(text, 'text/html');
}

//Translator

async function fromBGtoEN(text) {
    return (await translate(text, { from: 'bg', to: 'en', tld: 'com' })).data;
}

async function translateRecipe(recipe, cb) {
    const newRecipe = { name: recipe.name, ingredients: [], steps: [] };

    for (let i = 0; i < recipe.ingredients.length; i++) {
        if (
            cb(
                'translating',
                i + 1,
                recipe.ingredients.length + recipe.steps.length
            ) == true
        ) {
            return;
        }
        newRecipe.ingredients.push(await fromBGtoEN(recipe.ingredients[i]));
    }

    for (let i = 0; i < recipe.steps.length; i++) {
        if (
            cb(
                'translating',
                recipe.ingredients.length + i + 1,
                recipe.ingredients.length + recipe.steps.length
            ) == true
        ) {
            return;
        }
        newRecipe.steps.push(await fromBGtoEN(recipe.steps[i]));
    }

    return newRecipe;
}

//Extra

const scrappers = {
    'www.supichka.com': supichkaScraper,
    'supichka.com': supichkaScraper,
    'recepti.gotvach.bg': gotvachScraper,
    'm.kulinar.bg': kulinarScraper,
    'kulinar.bg': kulinarScraper,
    '1001recepti.com': _1001receptiScraper,
    'www.1001recepti.com': _1001receptiScraper,
    'm.1001recepti.com': _1001receptiScraper,
    'www.receptite.com': receptiteScraper,
    'receptite.com': receptiteScraper,
    'www.bonapeti.bg': bonapetiScraper,
    'bonapeti.bg': bonapetiScraper,
    'recepti.ezine.bg': ezineScraper
};

const charSets = {
    '1001recepti.com': 'windows-1251',
    'www.1001recepti.com': 'windows-1251',
    'm.1001recepti.com': 'windows-1251'
};

async function scrapeRecipe(url, cb) {
    if (cb('validating') == true) return;
    const [scrapper, hostname] = validate(url, scrappers);
    if (cb('fetching') == true) return;
    const html = await fetchSite(url, charSets[hostname]);
    if (cb('scrapping') == true) return;
    const recipe = scrapper(html);
    return await translateRecipe(recipe, cb);
}

export { scrapeRecipe, validate, scrappers };
