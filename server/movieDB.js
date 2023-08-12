export default class MovieDB {
    
    constructor({key, destination}) {
        this.apiDestination = destination;
        this.apiKey = key;
        this.apiType = ItemTypes.MOVIETV;
    }

    GetDetailed(id){
        let dbid = id;
        let url = `${this.apiDestination}movie/${dbid}?api_key=${this.apiKey}`;
        return new Promise((resolve, reject) => {
            fetch(url).then((response) => {
                response.json().then((result) => {
                    let name = result.title;
                    let thumbnailURL = `https://image.tmdb.org/t/p/w500/${result.poster_path}`;
                    let bannerURL = `https://image.tmdb.org/t/p/w500/${result.backdrop_path}`;
                    let year = result.release_date.split("-")[0];
                    let author = result.production_companies.map((value) => {
                        return value.name;
                    });
                    let description = result.overview;
                    let genres = result.genres.map((value) => {
                        return value.name;
                    });
                    let itemType = ItemTypes.MOVIETV;
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
        let url = `${this.apiDestination}search/movie?api_key=${this.apiKey}&query=${searchString}`;
        return new Promise((resolve, reject) => {
            fetch(url).then((response) => {
                response.json().then((page) => {
                    let results = page.results;
                    let items = Array<{}>(results.length);
                    for(let i = 0; i < results.length; i++) {
                        let movie = results[i];
                        let id = movie.id
                        let itemType = this.apiType;
                        let name = movie.title;
                        let year = movie.release_date.split("-")[0]
                        let thumbnailURL = `https://image.tmdb.org/t/p/w500/${movie.poster_path}`;
                        items[i] = {id, itemType, name, thumbnailURL}
                    }

                    resolve(items);
                });
            });
        });
       
    }
}