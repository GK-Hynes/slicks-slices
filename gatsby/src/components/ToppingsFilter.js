import React from "react";
import { useStaticQuery, graphql, Link } from "gatsby";
import styled from "styled-components";

const ToppingsStyles = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 4rem;
  a {
    display: grid;
    grid-template-columns: auto 1fr;
    grid-gap: 0 1rem;
    align-items: center;
    padding: 5px;
    background: var(--grey);
    border-radius: 2px;
    font-size: clamp(1.5rem, 1.5vw, 2.5rem);
    .count {
      background: white;
      padding: 2px 5px;
    }
    &[aria-current="page"] {
      background: var(--yellow);
    }
  }
`;

function countPizzasInToppings(pizzas) {
  const counts = pizzas
    .map((pizza) => pizza.toppings)
    .flat()
    .reduce((acc, topping) => {
      // Check for existing toppings and increment
      const existingTopping = acc[topping.id];
      if (existingTopping) {
        existingTopping.count += 1;
      } else {
        // Otherwise create new entry in acc and set to 1
        acc[topping.id] = {
          id: topping.id,
          name: topping.name,
          count: 1
        };
      }
      return acc;
    }, {});

  // Sort based on number of toppings
  const sortedToppings = Object.values(counts).sort(
    (a, b) => b.count - a.count
  );
  return sortedToppings;
}

export default function ToppingsFilter({ activeTopping }) {
  const { toppings, pizzas } = useStaticQuery(graphql`
    query {
      pizzas: allSanityPizza {
        nodes {
          toppings {
            name
            id
          }
        }
      }
    }
  `);

  const toppingsWithCounts = countPizzasInToppings(pizzas.nodes);

  return (
    <ToppingsStyles>
      <Link to="/pizzas">
        <span>All</span>
        <span className="count">{pizzas.nodes.length}</span>
      </Link>
      {toppingsWithCounts.map((topping) => (
        <Link key={topping.id} to={`/topping/${topping.name}`}>
          <span className="name">{topping.name}</span>
          <span className="count">{topping.count}</span>
        </Link>
      ))}
    </ToppingsStyles>
  );
}
