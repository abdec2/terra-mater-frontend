export const prepareNftPath = (imageUri) => {
    let imageurl = imageUri
    if(imageUri?.startsWith('ipfs')) {
        imageurl = `https://ipfs.moralis.io:2053/ipfs/${imageUri.split('ipfs://')[1]}`
    }
    return imageurl
}