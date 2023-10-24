function failedCraftFeedback(bot, name, item, craftingTable) { // function failed craft feedback bot name item crafting Table
    const recipes = bot.recipesAll(item.id, null, craftingTable); // recipes = bot.recipesAll item.id null, craftingTable
    if (!recipes.length) { // daca nu avem recipes posibile
        throw new Error(`No crafting table nearby`); // se pare ca nu avem un crating table?
    } else {
        const recipes = bot.recipesAll( // idk recipes again but with craftig table id frm mcdata
            item.id,
            null,
            mcData.blocksByName.crafting_table.id
        );
        // find the recipe with the fewest missing ingredients
        var min = 999; // min 999
        var min_recipe = null; //min_recipe
        for (const recipe of recipes) { // for recipe in recipes
            const delta = recipe.delta; // delta 
            var missing = 0; // missing 
            for (const delta_item of delta) { // item
                if (delta_item.count < 0) { // if count delta_items < 0
                    const inventory_item = bot.inventory.findInventoryItem(  // inventory item
                        mcData.items[delta_item.id].name, // get name but delta item
                        null
                    );
                    if (!inventory_item) { //daca nu avem inventry item
                        missing += -delta_item.count; // we need the full pack for inventory
                    } else {
                        missing += Math.max( // math max
                            -delta_item.count - inventory_item.count, // missing is only what we need minus what we have 
                            0
                        );
                    }
                }
            }
            if (missing < min) { // if missing ingredients are less than the last less
                min = missing; // new min is current missing 
                min_recipe = recipe; // keep the simplest reciepie
            }
        } // get out of min reciepie search
        const delta = min_recipe.delta; // delta  min reciepie
        let message = "";
        for (const delta_item of delta) {
            if (delta_item.count < 0) {
                const inventory_item = bot.inventory.findInventoryItem(
                    mcData.items[delta_item.id].name,
                    null
                ); // get intentory item for that 
                if (!inventory_item) { // if we have inventory item
                    message += ` ${-delta_item.count} more ${ // message what we need
                        mcData.items[delta_item.id].name
                    }, `;
                } else {
                    if (inventory_item.count < -delta_item.count) { // if we have some items
                        message += `${
                            -delta_item.count - inventory_item.count
                        } more ${mcData.items[delta_item.id].name}`; // still need difference mode 
                    }
                }
            }
        }
        bot.chat(`I cannot make ${name} because I need: ${message}`); // print list of messages for needed ingredients for that reciepie
    }
}
