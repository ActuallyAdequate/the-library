export default class BookDB {
    
    constructor({key, destination}) {
        this.apiDestination = destination;
        this.apiKey = key;
        this.apiType = ItemTypes.BOOK;
    }

    GetDetailed(id){
        let dbid = id;
        console.log(dbid);
        let url = `${this.apiDestination}v1/volumes/${dbid}?key=${this.apiKey}`;
        console.log(url);
        return new Promise((resolve, reject) => {
            fetch(url).then((response) => {
                response.json().then((result) => {
                    let name = result.volumeInfo?.title;
                    let thumbnailURL = result.volumeInfo?.imageLinks?.thumbnail;
                    let bannerURL = result.volumeInfo?.imageLinks?.small;
                    let year = result.volumeInfo?.publishedDate?.split("-")[0];
                    let author = result.volumeInfo?.authors;
                    let description = result.volumeInfo?.description;
                    let genres = result.volumeInfo?.categories;
                    let itemType = ItemTypes.BOOK;
                    let item  = {id, itemType, name, thumbnailURL, bannerURL, year, author, description, genres}
                    resolve(item);
                });
            });
        });
    }

    Search(searchTerms) {
        let startIndex = 0; //this is for pagination of results if wanted.
        let maxResults = 40;
        let searchString = searchTerms.join("+");
        let url = `${this.apiDestination}v1/volumes/?q=${searchString}&startIndex=${startIndex}&maxResults=${maxResults}&key=${this.apiKey}`
        return new Promise((resolve, reject) => {
            fetch(url).then((response) => {
                response.json().then((results) => {
                    let returned = results.items.length;
                    let items = Array<{}>(returned);
                    for(let i = 0; i < returned; i++) {
                        let book = results.items[i];
                        let id = book.id
                        let itemType = this.apiType;
                        let name = book.volumeInfo?.title;
                        let thumbnailURL = book.volumeInfo?.imageLinks?.thumbnail;
                        items[i] = {id, itemType, name, thumbnailURL}
                    }
                    resolve(items);
                });
            });
        });
       
    }
}