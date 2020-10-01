import { graphql } from "gatsby";
import path from "path";

async function turnPizzasIntoPages({ graphql, actions }) {
  // Get template
  const pizzaTemplate = path.resolve("./src/templates/Pizza.js");
  // Query all pizzas
  const { data } = await graphql(`
    query {
      pizzas: allSanityPizza {
        nodes {
          name
          slug {
            current
          }
        }
      }
    }
  `);
  // Loop over pizzas and create pages
  data.pizzas.nodes.forEach((pizza) => {
    actions.createPage({
      // url for new page
      path: `pizza/${pizza.slug.current}`,
      component: pizzaTemplate,
      context: {
        slug: pizza.slug.current
      }
    });
  });
}

async function turnToppingsIntoPages({ graphql, actions }) {
  // Get template
  const toppingsTemplate = path.resolve("./src/pages/pizzas.js");
  const { data } = await graphql(`
    query {
      toppings: allSanityTopping {
        nodes {
          name
          id
        }
      }
    }
  `);

  data.toppings.nodes.forEach((topping) => {
    actions.createPage({
      path: `topping/${topping.name}`,
      component: toppingsTemplate,
      context: {
        topping: topping.name,
        toppingRegex: `/${topping.name}/i`
      }
    });
  });
}

export async function createPages(params) {
  // create pages dynamically
  // 1. Pizzas
  // 2. Toppings
  // 3. Slicemasters
  // Wait for all promises to be resolved
  await Promise.all([
    turnPizzasIntoPages(params),
    turnToppingsIntoPages(params)
  ]);
}
