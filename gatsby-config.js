module.exports = {
  pathPrefix: '/brain-backup',
  siteMetadata: {
    title: 'Brain Backup',
  },
  plugins: [
    {
      resolve: 'gatsby-philipps-foam-theme',
      options: {
        contentPath: 'content/garden',
        rootNote: "home",
      },
    },
  ],
};
