import { PageController } from '../lib/pages.js';

class DebugPageController extends PageController {
    async onEnter() {
        this.saveButton = this.el.querySelector('button');
        this.input = this.el.querySelector('input');

        this.input.value = await getStorage('recipes');

        this.input.addEventListener('input', () => {
            this.saveButton.disabled = false;
        });

        this.saveButton.addEventListener('click', async () => {
            this.saveButton.disabled = true;

            await setStorage('recipes', this.input.value);
        });
    }
}

export default DebugPageController;
