/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @return {Promise}
 */
export const preloadHandlebarsTemplates = async function() {

    // Define template paths to load
    const templatePaths = [
  
      // Actor Sheet Partials
      //"systems/tftloop/templates/actors/parts/partial.hbs",
      
  
      // Item Sheet Partials
      //"systems/tftloop/templates/items/parts/item-partial.hbs",
      

    ];
  
    // Load the template parts
    return loadTemplates(templatePaths);
  };