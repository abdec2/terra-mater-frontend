const api = {
    // baseUrl: 'http://ec2-52-45-224-73.compute-1.amazonaws.com:5000', http://localhost:5000
    baseUrl: 'http://localhost:5000',
    nfts: '/api/nfts',
    "nft-v1s": '/api/nft-v1s', 
    nftShowcases: '/api/nft_showcases',
    authors: '/api/authors',
    authorsSales: '/api/author_ranks',
    hotCollections: '/api/hot-collections',
    collections: '/api/collection',
    contactUs: '/api/contact-forms',
    blogs: '/api/blog-posts',
    recent: '/api/blog-posts/posts/recents',
    comments: '/api/blog-posts/comments',
    tags: '/api/blog-posts/tags',
}

export const openseaApi = {
    base: 'https://testnets.opensea.io',
    api: 'https://testnets-api.opensea.io',
}

export default api;