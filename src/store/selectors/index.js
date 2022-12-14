import { createSelector, createStructuredSelector } from "reselect";


//Store Selectors
export const nftBreakdownState = (state) => state.NFT.nftBreakdown;
export const nftShowcaseState = (state) => state.NFT.nftShowcase;
export const nftDetailState = (state) => state.NFT.nftDetail;
export const hotCollectionsState = (state) => state.hotCollection.hotCollections;
export const authorsState = (state) => state.authors.authorList;
export const authorRankingsState = (state) => state.authors.authorRanking;
export const collectionState = (state) => state.collectionReducer.selectedCollection;
export const collectionNft = (state) => state.collectionReducer.selectedNfts.data;
export const newCollection = (state) => state.collectionReducer.newCollection.data;
export const categoriesState = (state) => state.misc.categories.data;
export const nftStatusesState = (state) => state.misc.nftStatus.data;
export const ComingSoonCollectionState = (state) => state.hotCollection.ComingSoonCollection;

//blogs
export const blogsState = (state) => state.blogs.blogPosts;
export const recentPostsState = (state) => state.blogs.recentPosts;
export const tagsState = (state) => state.blogs.tags;
export const commentsState = (state) => state.blogs.comments;

export const auctionedNfts = createSelector(nftBreakdownState, ( nfts ) => {
    if(!nfts.data) {
        return [];
    }
    const acutioned = nfts.data.filter(nft => !!nft.deadline);
    return acutioned;
});

export const nftFilter = createStructuredSelector({
    categories: (state) => state.filters.selectedCategories,
    status: (state) => state.filters.selectedStatus,
    itemsType: (state) => state.filters.selectedItemsType,
    collections: (state) => state.filters.selectedCollections,
    nftTitle: (state) => state.filters.filterNftTitle
});

export const nftItems = createSelector(nftFilter, nftBreakdownState, ( filters, nfts ) => {
    let { data } = nfts;
    const meta = data ? data.meta : null;
    data = data ? data.data : null;
    const { categories, status, itemsType, collections, nftTitle } = filters;
    if(!data) {
        return [];
    }
    if(categories.size) {
        data = data.filter( nft => categories.has(nft.collection.category.id.toString()));
    }
    if(status.size) {
        data = data.filter( nft => status.has(nft.nft_status.id.toString()));
    }
    if(itemsType.size) {
        data = data.filter( nft => itemsType.has(nft.item_type));
    }
    if(collections.size) {
        data = data.filter( nft => collections.has(nft.collection.id.toString()));
    }
    if(nftTitle.trim().length) {
        let pattern = new RegExp(`${nftTitle.trim()}`, 'gi');
        console.log(pattern)
        data = data.filter( nft => nft.title.match(pattern));
    }

    return {data, meta};
});