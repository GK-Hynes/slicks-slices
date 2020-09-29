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

export async function createPages(params) {
  // create pages dynamically
  // 1. Pizzas
  await turnPizzasIntoPages(params);
  // 2. Toppings
  // 3. Slicemasters
}
