import { PageController } from '../lib/pages.js';
import dictation from '../lib/dictation.js';

class RecipesController extends PageController {
    async loadRecipes() {
        if ((await getStorage('recipes')) != null) {
            try {
                JSON.parse(await getStorage('recipes')).recipes;
            } catch (err) {
                await removeStorage('recipes');
            }
        }

        if ((await getStorage('recipes')) == null)
            await setStorage('recipes', JSON.stringify({ recipes: [] }));

        return JSON.parse(await getStorage('recipes')).recipes;
    }

    async saveRecipes() {
        await setStorage('recipes', JSON.stringify({ recipes: this.recipes }));
    }

    renderRecipes() {
        this.main.innerHTML = '';

        if (this.recipes.length == 0) {
            this.main.innerHTML = `<pre class="ThereAreNoRecipes">There are no recipes.\nTry adding some.</pre>`;
            return;
        }

        this.recipes.forEach((recipe, idx) => {
            const recipeEl = document.createElement('div');
            recipeEl.className = 'recipe';

            recipeEl.innerHTML = `<p>${recipe.name}</p>
                                  <div style="height: 70px; display: flex; align-items: center;">
                                    <img src="./images/view.png" class="view" />
                                    <img src="./images/cook.png" class="cook" />
                                  </div>`;

            recipeEl.querySelector('.view').addEventListener('click', () => {
                PageManager.setPage(viewRecipePage.build(idx));
            });

            recipeEl.querySelector('.cook').addEventListener('click', e => {
                const btn = e.target;

                if (btn.isPlaying == null) btn.isPlaying = false;

                if (!btn.isPlaying) {
                    btn.src = './images/pause.png';
                    btn.isPlaying = true;

                    dictation.stop();
                    dictation.start(recipe);

                    dictation.onEnd(() => {
                        btn.src = './images/cook.png';
                        btn.isPlaying = false;
                    });
                } else {
                    dictation.stop();
                }
            });

            this.main.appendChild(recipeEl);
            this.main.appendChild(document.createElement('hr'));
        });
    }

    async onEnter() {
        this.main = this.el.querySelector('main');
        this.recipes = await this.loadRecipes();
        this.renderRecipes();
    }

    onLeave() {
        dictation.stop();
    }

    taskAddRecipe() {
        PageManager.setPage(addRecipePage.build());
    }

    taskDebug() {
        PageManager.setPage(debugPage.build());
    }
}

export default RecipesController;
