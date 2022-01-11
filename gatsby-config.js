module.exports = {
  pathPrefix: "/brain-backup",
  siteMetadata: {
    title: "Brain Backup"
  },
  plugins: [
    `gatsby-plugin-postcss`,
    `gatsby-plugin-sharp`,
    `gatsby-remark-images`,
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        extensions: [`.md`, `.mdx`],
        remarkPlugins: [
          require("remark-math"),
        ],
        rehypePlugins: [
          require("rehype-katex")
        ],
        gatsbyRemarkPlugins: [
          `gatsby-remark-foam-links`,
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 561
            }
          },
          `gatsby-remark-copy-linked-files`,
          {
            resolve: `gatsby-remark-autolink-headers`,
            options: {
              icon: false
            }
          }
        ]
      }
    },
    {
      resolve: `gatsby-philipps-foam-theme`,
      options: {
        mdxOtherwiseConfigured: true,
        contentPath: "content/garden",
        rootNote: "home"
      }
    }
  ]
}
