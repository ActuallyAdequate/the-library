export default class TableTopDB  {
    
    constructor({key, destination}) {
        this.apiDestination = destination;
        this.apiKey = key;
    }
    
    GetDetailed(id){
        let dbid = id;
        let url = `${this.apiDestination}search?client_id=${this.apiKey}&ids=${dbid}`;
        
        return new Promise((resolve, reject) => {
            fetch(url).then((response) => {
                response.json().then((results) => {
                    let result = results.games[0];
                    let name = result.name;
                    let thumbnailURL = result.thumb_url;
                    let bannerURL = result.image_url;
                    let year = result.year_published;
                    let author = [result.primary_publisher.name, result.primary_designer.name];
                    author = author.concat(...result.artists);
                    let description = result.description;
                    let genres = [result.type];
                    let itemType = ItemTypes.TABLETOPGAME;
                    let item  = {id, itemType, name, thumbnailURL, bannerURL, year, author, description, genres}
                    resolve(item);
                });
            });
        });
    }

    Search(searchTerms) {
        let searchString = searchTerms.join(" ").toLowerCase();
        let url = `${this.apiDestination}search?client_id=${this.apiKey}&name="${searchString}"&fuzzy_match=true`;

        return new Promise((resolve, reject) => {
            fetch(url).then((response) => {
                response.json().then((page) => {
                    let results = page.games;
                    let items = Array<{}>(results.length);
                    for(let i = 0; i < results.length; i++) {
                        let game = results[i];
                        let id = game.id
                        let itemType = ItemTypes.TABLETOPGAME;
                        let name = game.name;
                        let thumbnailURL = game.thumb_url;
                        items[i] = {id, itemType, name, thumbnailURL}
                    }

                    resolve(items);
                });
            });
        });
       
    }
}