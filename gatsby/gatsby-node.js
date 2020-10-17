import { graphql } from "gatsby";
import path from "path";
import fetch from "isomorphic-fetch";

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

async function fetchBeersAndTurnIntoNodes({
  actions,
  createNodeId,
  createContentDigest
}) {
  // Fetch list of beers
  const res = await fetch("https://sampleapis.com/beers/api/ale");
  const beers = await res.json();
  // Loop over beers
  for (const beer of beers) {
    const nodeMeta = {
      id: createNodeId(`beer-${beer.name}`),
      parent: null,
      children: [],
      internal: {
        type: "Beer",
        mediaType: "application/json",
        contentDigest: createContentDigest(beer)
      }
    };
    // Create node per beer
    actions.createNode({
      ...beer,
      ...nodeMeta
    });
  }
}

async function turnSlicemastersIntoPages({ graphql, actions }) {
  // query all slciemasters
  const { data } = await graphql(`
    query {
      slicemasters: allSanityPerson {
        totalCount
        nodes {
          name
          id
          slug {
            current
          }
        }
      }
    }
  `);
  // TODO turn each into own page
  data.slicemasters.nodes.forEach((slicemaster) => {
    actions.createPage({
      component: path.resolve("./src/templates/Slicemaster.js"),
      path: `/slicemaster/${slicemaster.slug.current}`,
      context: {
        name: slicemaster.person,
        slug: slicemaster.slug.current
      }
    });
  });

  // Calculate number pages based on slicemasters
  const pageSize = parseInt(process.env.GATSBY_PAGE_SIZE);
  const pageCount = Math.ceil(data.slicemasters.totalCount / pageSize);
  // Loop from 1 to n
  Array.from({ length: pageCount }).forEach((_, i) => {
    actions.createPage({
      path: `/slicemasters/${i + 1}`,
      component: path.resolve("./src/pages/slicemasters.js"),
      // data passed to template on creation
      context: {
        skip: i * pageSize,
        currentPage: i + 1,
        pageSize
      }
    });
  });
}

export async function sourceNodes(params) {
  // fetch list of beers
  await Promise.all([fetchBeersAndTurnIntoNodes(params)]);
}

export async function createPages(params) {
  // create pages dynamically
  // 1. Pizzas
  // 2. Toppings
  // 3. Slicemasters
  // Wait for all promises to be resolved
  await Promise.all([
    turnPizzasIntoPages(params),
    turnToppingsIntoPages(params),
    turnSlicemastersIntoPages(params)
  ]);
}
