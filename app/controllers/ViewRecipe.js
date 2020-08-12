import { PageController } from '../lib/pages.js';

class ViewRecipeController extends PageController {
    textBox(element) {
        this.textBoxEvent = e => {
            e.target.querySelectorAll('span').forEach(el => {
                el.replaceWith(document.createTextNode(el.textContent));
            });

            e.target.querySelectorAll('br').forEach(el => {
                if (el.parentElement.textContent != '') {
                    el.remove();
                }
            });

            Array.from(e.target.childNodes).forEach(el => {
                if (el.nodeType == Node.TEXT_NODE) {
                    e.target.innerHTML = '';
                    document.execCommand(
                        'insertHTML',
                        false,
                        `<p>${el.data}</p>`
                    );
                }
            });

            Array.from(e.target.children).forEach(el => {
                el.style['margin-top'] = '15px';
            });

            try {
                e.target.children[0].style['margin-top'] = '0px';
            } catch (err) {}

            this.saveButton.disabled = false;
        };

        element.addEventListener('input', this.textBoxEvent);

        this.textBoxEvent({ target: element });

        this.saveButton.disabled = true;
    }

    renderRecipe() {
        this.el.querySelector(
            "[prop='name']"
        ).innerHTML = `<p>${this.recipe.name}</p>`;

        let ingredientString = '';

        this.recipe.ingredients.forEach(ingredient => {
            ingredientString += `<p>${ingredient}</p>`;
        });

        this.el.querySelector(
            "[prop='ingredients']"
        ).innerHTML = ingredientString;

        let stepString = '';

        this.recipe.steps.forEach(step => {
            stepString += `<p>${step}</p>`;
        });

        this.el.querySelector("[prop='steps']").innerHTML = stepString;
    }

    async onEnter() {
        document.execCommand('defaultParagraphSeperator', false, 'p');

        this.recipe = JSON.parse(await getStorage('recipes')).recipes[
            this.metadata
        ];

        this.saveButton = this.el.querySelector('#save');

        this.renderRecipe();

        this.el.querySelector('#delete').addEventListener('click', async () => {
            const recipes = JSON.parse(await getStorage('recipes')).recipes;
            recipes.splice(this.metadata, 1);
            await setStorage('recipes', JSON.stringify({ recipes }));
            PageManager.setPage(recipesPage.build());
        });

        this.el.querySelector('#save').addEventListener('click', async () => {
            const newRecipe = {};

            newRecipe.name = this.el.querySelector("[prop='name']").textContent;

            newRecipe.ingredients = [];

            this.el
                .querySelector("[prop='ingredients']")
                .querySelectorAll('p')
                .forEach(el => {
                    if (el.textContent.replace(/[\s\n]+/g, '') != '')
                        newRecipe.ingredients.push(el.textContent);
                });

            newRecipe.steps = [];

            this.el
                .querySelector("[prop='steps']")
                .querySelectorAll('p')
                .forEach(el => {
                    if (el.textContent.replace(/[\s\n]+/g, '') != '')
                        newRecipe.steps.push(el.textContent);
                });

            this.recipe = newRecipe;

            this.renderRecipe();

            this.textBoxEvent({
                target: this.el.querySelectorAll("[contenteditable='true']")[0]
            });
            this.textBoxEvent({
                target: this.el.querySelectorAll("[contenteditable='true']")[1]
            });
            this.textBoxEvent({
                target: this.el.querySelectorAll("[contenteditable='true']")[2]
            });

            const recipes = JSON.parse(await getStorage('recipes')).recipes;
            recipes[this.metadata] = newRecipe;
            await setStorage('recipes', JSON.stringify({ recipes }));

            this.saveButton.disabled = true;
        });

        this.textBox(this.el.querySelectorAll("[contenteditable='true']")[0]);
        this.textBox(this.el.querySelectorAll("[contenteditable='true']")[1]);
        this.textBox(this.el.querySelectorAll("[contenteditable='true']")[2]);
    }
}

export default ViewRecipeController;
