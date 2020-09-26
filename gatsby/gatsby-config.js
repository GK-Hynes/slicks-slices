import dotenv from "dotenv";

dotenv.config({ path: ".env" });

export default {
  siteMetadata: {
    title: `Slick's Slices`,
    siteUrl: `https:/gatsby.pizza`,
    description: `The best pizza place in Hamilton!`
  },
  plugins: [
    `gatsby-plugin-styled-components`,
    {
      resolve: `gatsby-source-sanity`,
      options: {
        projectId: `gxxwawiz`,
        dataset: `production`,
        watch: true,
        token: process.env.SANITY_TOKEN
      }
    }
  ]
};
