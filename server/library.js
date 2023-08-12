import { nanoid } from "nanoid";
import BookDB from "./bookDB.js";
import MovieDB from "./movieDB.js";
import VideoGameDB from "./videogameDB.js";
import TableTopDB from "./tabletopDB.js";

const Operation = {
    CREATE: 0,
    READ: 1,
    UPDATE: 2,
    DELETE: 3
}

class Item {

    constructor({name, id, itemType, thumbnailURL, bannerURL, author, year, description, genres}) {
        this.name = name;
        this.id = id;
        this.itemType = itemType;
        this.thumbnailURL = thumbnailURL;
        this.bannerURL = bannerURL;
        this.author = author;
        this.description = description;
        this.year = year;
        this.parented = 0;
        this.genres = genres;
        this.wishlisted = false;
        this.owned = false;
        this.favourite = false;
        this.engagement = new Array();
    }   
}

class Collection {

    constructor(name, description, id) {
        this.name = name;
        this.description = description;
        this.id = id;
        this.items = new Array();
        this.subCollections = new Array();
        this.parented = 0;
    }   
}

export class Library{
    actions = {
        ["CRUDLibrary"]: ({operation, collectionId, arg})=> this.CRUDCollection(operation, collectionId, arg),
        ["SearchLibrary"] : ({itemType, searchTerm}) => this.SearchLibrary(itemType, searchTerm),
        ["CRUDItem"] : ({operation, collectionId, arg})=> this.CRUDItem(operation, collectionId, arg),
    };


    constructor(libraryStore, api){
        this.bookDB = new BookDB(api.books);
        this.movieDB = new MovieDB(api.moviestv);
        this.videogameDB = new VideoGameDB(api.videogames);
        this.tabletopDB = new TableTopDB(api.tabletopgames);

        this.libraryStore = libraryStore;
        let loadedLibrary = libraryStore.LoadJSON();
        this.items = new Map(loadedLibrary.items) ?? new Map();
        this.collections = new Map(loadedLibrary.collections) ?? new Map();
        let master = this.collections.get("0");
        if(master){
            this.masterCollection = master;
        } else {
            this.masterCollection = new Collection("Book Shelves", "The Master Collection", "0");
            this.collections.set(this.masterCollection.id, this.masterCollection); 
        }
    }


    SearchLibrary(itemType, searchTerm) {
        let searchTerms = searchTerm.split(' ');
        switch(itemType){
            case ItemTypes.BOOK:
                return this.bookDB.Search(searchTerms);
            case ItemTypes.MOVIETV:
                return this.movieDB.Search(searchTerms);
            case ItemTypes.VIDEOGAME:
                return this.videogameDB.Search(searchTerms);
            case ItemTypes.TABLETOPGAME:
                return this.tabletopDB.Search(searchTerms);
            default:
                throw new Error("Undefined Item type in searchLibrary")
        }

    }

    CRUDItem(operation, collectionId, arg) {
        let collection = this.collections.get(collectionId);
        if(collection) {
            let different;
            switch(operation) {
                case Operation.CREATE:
                    different = this.AddItem(collection, arg);
                    this.SignalStateChange();
                    break;
                case Operation.READ:
                    return different = this.GetItem(arg);
                case Operation.UPDATE:
                    different = this.UpdateItem(arg);
                    this.SignalStateChange();
                    break;
                case Operation.DELETE:
                    different = this.RemoveItem(collection, arg);
                    this.SignalStateChange();
                    break;
            }
            
            return {collection: collection, different:different};

        } 
        throw new Error(`collection ${collectionId} does not exist when CRUD Item`)
    }

    
    CRUDCollection(operation, collectionId, arg) {
        let collection = this.collections.get(collectionId);
        if(collection) {
            let different = undefined;
            switch(operation){
                case Operation.CREATE:
                    different = this.AddCollection(collection, arg);
                    this.SignalStateChange();
                    break;
                case Operation.READ:
                    return this.GetCollections();
                case Operation.UPDATE:
                    different = this.UpdateCollection(arg);
                    this.SignalStateChange();
                    break;
                case Operation.DELETE:
                    different = this.RemoveCollection(collection, arg);
                    this.SignalStateChange(); 
                    break;              
            }
            return {collection: collection, different:different};
        }       
    }

    AddItem(parentCollection, itemDetails ){
        let id = `${itemDetails.itemType}-${itemDetails.id}`;
        let item = this.items.get(id);
        if(item == undefined) {
            itemDetails.id = id;
            item = new Item(itemDetails);
            this.items.set(id, item);
        }

        let index = parentCollection.items.findIndex((value) => {return id === value})
        if(index === -1) {
            parentCollection.items.push(id);
            item.parented++;
        }
       
        return item;
    }

    AddCollection(parentCollection, {id, name, description}) {
        let collection = undefined;
        if(id !== undefined){ // the collection exists already
            collection = this.collections.get(id)    
        }
        if(id == undefined || collection == undefined){ // must create a new collection
            id = nanoid();
            collection = new Collection(name, description, id);
            this.collections.set(id, collection);
        }        
        // enusre the collection is added to its parent collection
        collection.parented++;
        parentCollection.subCollections.push(id);
        return collection;
     }   
     
    GetCollections() {
        return {master: this.masterCollection, collections: this.collections, items: this.items};
    }

    GetItem(searchDetails) {
        switch(searchDetails.itemType){
            case ItemTypes.BOOK:
                return this.bookDB.GetDetailed(searchDetails.id);
            case ItemTypes.MOVIETV:
                return this.movieDB.GetDetailed(searchDetails.id);
            case ItemTypes.VIDEOGAME:
                return this.videogameDB.GetDetailed(searchDetails.id);
            case ItemTypes.TABLETOPGAME:
                return this.tabletopDB.GetDetailed(searchDetails.id);
            default:
                throw new Error("Undefined ItemType in GetItem");
        }
    }

    UpdateCollection({id, name, description}) {
        let collection = this.collections.get(id);
        if(collection == undefined){
            return undefined
        }
        if(name !== undefined){
            collection.name = name;
        }
        if(description !== undefined) {
            collection.description = description;
        }
        return collection;
    }

    UpdateItem({id, wishlist, owned, favourite, engagement}){
        let item = this.items.get(id);
        if(item == undefined) {
            return undefined;
        }
        if(wishlist !== undefined) {
            item.wishlisted = wishlist;
        }
        if(owned !== undefined) {
            item.owned = owned;
        }
        if(favourite !== undefined) {
            item.favourite = favourite;
        }
        if(engagement !== undefined) {
            console.log(item);
            item.engagement.push(engagement);
        }
        return item;

    }

    RemoveCollection(parentCollection, id){
        let index = parentCollection.subCollections.findIndex((value) => {
            return value == id;
        });
        if(index === -1) return;
        let deletedIdArr = parentCollection.subCollections.splice(index,1);
        let deletedId = deletedIdArr[0];
        let deleted = this.collections.get(deletedId);
        if(deleted) {
            deleted.parented--;
            if(deleted.parented <= 0) {
                for(let subItem of deleted.items){
                    this.RemoveItem(deleted, subItem);
                }
                for(let subCol of deleted.subCollections){
                    this.RemoveCollection(deleted, subCol);
                }
                this.collections.delete(deletedId);

            }
        }

        return deleted;

    }

    RemoveItem(parentCollection, id) {
        let index = parentCollection.items.findIndex((value) => {
            return value == id;
        });
        if(index === -1) return;
        let deletedIdArr = parentCollection.items.splice(index,1);
        let deletedId = deletedIdArr[0];
        let deleted = this.items.get(deletedId);
        if(deleted) {
            deleted.parented--;
            if(deleted.parented <= 0) this.items.delete(deletedId);
        }

        return deleted;
    }

    SignalStateChange() {
        let collections = [...this.collections];
        let items = [...this.items];
        this.libraryStore.SaveJSON({collections: collections, items: items});
    }



    
}