import { PageBuilder, Button } from './lib/pages.js';
import RecipesController from './controllers/Recipes.js';
import AddRecipeController from './controllers/AddRecipe.js';
import ViewRecipeController from './controllers/ViewRecipe.js';
import DebugPageController from './controllers/Debug.js';

const { CapacitorKeepScreenOn, Storage, StatusBar } = Capacitor.Plugins;

CapacitorKeepScreenOn.enable().catch(console.log);

StatusBar.setBackgroundColor({
    color: '#454545'
}).catch(console.log);

window.setStorage = async (key, value) => {
    return await Storage.set({
        key,
        value
    });
};

window.getStorage = async key => {
    return (await Storage.get({ key })).value;
};

window.removeStorage = async key => {
    return await Storage.remove({ key });
};

LayoutManager.load('recipes', './layouts/recipes.html');
LayoutManager.load('addRecipe', './layouts/addRecipe.html');
LayoutManager.load('viewRecipe', './layouts/viewRecipe.html');
LayoutManager.load('debug', './layouts/debug.html');

LayoutManager.onAllLoaded().then(() => {
    window.recipesPage = new PageBuilder(
        'All Recipes',
        RecipesController,
        LayoutManager.get('recipes'),
        [
            new Button('left', './images/favicon.png', 'Debug'),
            new Button('right', './images/add.png', 'AddRecipe')
        ]
    );

    window.addRecipePage = new PageBuilder(
        'Add Recipe',
        AddRecipeController,
        LayoutManager.get('addRecipe'),
        [new Button('left', './images/back.png', 'GoBack')]
    );

    window.viewRecipePage = new PageBuilder(
        'View Recipe',
        ViewRecipeController,
        LayoutManager.get('viewRecipe'),
        [new Button('left', './images/back.png', 'GoBack')]
    );

    window.debugPage = new PageBuilder(
        'Debug',
        DebugPageController,
        LayoutManager.get('debug'),
        [new Button('left', './images/back.png', 'GoBack')]
    );

    document.querySelector('.loading').remove();

    PageManager.setPage(recipesPage.build());
});
