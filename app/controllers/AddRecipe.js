import { PageController } from '../lib/pages.js';
import { validate, scrappers, scrapeRecipe } from '../lib/scraper.js';

class AddRecipeController extends PageController {
    onEnter() {
        this.shouldStop = false;
        this.isDone = false;

        this.errorText = this.el.querySelector('.errorText');
        this.linkText = this.el.querySelector('.linkText');
        this.corsText = this.el.querySelector('.corsText');
        this.statusText = this.el.querySelector('.statusText');
        this.button = this.el.querySelector('button');

        this.button.addEventListener('click', () => {
            if (this.isDone) {
                this.taskGoBack();
                return;
            }
            this.addRecipe();
        });

        this.el.querySelector('.linkText').addEventListener('input', () => {
            try {
                validate(this.linkText.value, scrappers);
                this.errorText.textContent = '';
                this.button.disabled = false;
            } catch (err) {
                if (err.name == 'NotSupportedWebsiteError') {
                    this.errorText.textContent = `${
                        err.hostname.slice(0, 1).toUpperCase() +
                        err.hostname.slice(1)
                    } is not supported!`;
                } else {
                    this.errorText.textContent = 'The Link is not valid!';
                }
                this.button.disabled = true;
            }
        });

        this.el.querySelector('.corsLabel').addEventListener('click', () => {
            this.corsText.value = 'http://192.168.31.159:12321/';
        });
    }

    taskGoBack() {
        PageManager.setPage(PageManager.prevPage.builder.build());
        this.shouldStop = true;
    }

    addRecipe() {
        this.button.style.visibility = 'hidden';
        this.el.querySelector('.centered').style.visibility = 'hidden';

        this.statusText.classList.remove('red');

        window.corsProxy = this.corsText.value;

        scrapeRecipe(this.linkText.value, (status, current, total) => {
            if (this.shouldStop) return true;

            if (status == 'fetching')
                this.statusText.textContent = 'Fetching...';

            if (status == 'translating')
                this.statusText.textContent = `Translating ${current}/${total}...`;
        })
            .then(async recipe => {
                if (this.shouldStop) return;

                this.statusText.textContent = 'Recipe was successfully added!';

                this.isDone = true;

                this.button.style.visibility = 'visible';
                this.button.textContent = 'Ok';

                const obj = JSON.parse(await getStorage('recipes'));
                obj.recipes.push(recipe);
                await setStorage('recipes', JSON.stringify(obj));
            })
            .catch(err => {
                this.statusText.classList.add('red');
                this.statusText.textContent =
                    'Something went wrong! Try again in a few minutes.';

                this.button.style.visibility = 'visible';
                this.button.textContent = 'Retry';
            });
    }
}

export default AddRecipeController;
