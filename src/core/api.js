const api = {
    // baseUrl: 'http://localhost:5000', 
    baseUrl: 'https://api.terramaternfts.com',
    nfts: '/api/nfts',
    "nft-v1s": '/api/nft-v1s', 
    nftShowcases: '/api/nft_showcases',
    authors: '/api/authors',
    authorsSales: '/api/author_ranks',
    hotCollections: '/api/hot-collections',
    collection: '/api/collections',
    contactUs: '/api/contact-forms',
    blogs: '/api/blog-posts',
    recent: '/api/blog-posts/posts/recents',
    comments: '/api/blog-posts/comments',
    tags: '/api/blog-posts/tags',
    categories: '/api/categories',
    status: '/api/nft-statuses'
}

export const openseaApi = {
    base: 'https://testnets.opensea.io',
    api: 'https://testnets-api.opensea.io',
}

export default api;