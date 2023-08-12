import * as React from "react";
//import { useMediaQuery } from 'react-responsive';
//const isMobile = useMediaQuery({ query: `(max-width: 760px)` }); //needto move in function
import { ICollection, IEngagement, IItem, ISearchItem } from "main/defintions/LibraryModel";
import CLibrary from "./Library";
import CShelf from "./Shelf";
import CBook from "./Book";

// function FollowPath(collection: ICollection, location: Array<string>, start: number = 0) : ICollection {
//     start++;
//     let next = location[start];
//     let childCollection = collection.subCollections.get(next);
//     if(childCollection == undefined) return collection;
//     if(start >= location.length-1) return childCollection;
//     return FollowPath(childCollection, location, start);
// }

const View = {
    LIBRARY: 0,
    SHELF: 1,
    BOOK: 2,
    ERROR: 3,
    LOADING: 4,
}

const Operation = {
    CREATE: 0,
    READ: 1,
    UPDATE: 2,
    DELETE: 3
}

function CLibraryMap({collections, items, location, onChangeLocation}){   
    return(
        <nav className="nav">
            <ol className="breadcrumb" aria-label="breadcrumb">
                {location.map((locationId, index) => {
                        let collection = collections.get(locationId);
                        if(collection){
                            let view = index == 0 ? View.LIBRARY : View.SHELF;
                            if(index < (location.length -1)) return <li key={locationId} className="breadcrumb-item"><a href="#" onClick={()=>{onChangeLocation(location.slice(0, index+1),  view)}}>{collection.name}</a></li>
                            else return <li  key={locationId} className="breadcrumb-item active">{collection.name}</li>
                        } else {
                            let item = items.get(locationId);
                            if(item)return <li  key={locationId} className="breadcrumb-item active">{item.name}</li>
                        }
                    })
                }
            </ol>
        </nav>
    )
}

export default function CLibraryDoor() {
    const [view, setView] = React.useState(View.LOADING)
    const [error, setError] = React.useState("We've Encountered An Unhandled Error")
    const [location, setLocation] =React.useState<Array<string>>(["0"])
    const [collections, setCollections] = React.useState(new Map());
    const [items, setItems] = React.useState(new Map());

    //Loading Collections
    React.useEffect(() => {
        setView(View.LOADING);
        fetch(`${window.location.origin}/library`, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({event:"CRUDLibrary", operation: Operation.READ, collectionId:"0", arg: undefined})
          }).then((res)=>{
            let {master, collections, items } = res;
            setCollections(collections);
            setItems(items);
            setLocation([master.id]);
            setView(View.LIBRARY);
            
        }).catch(() =>{
            setView(View.ERROR);
            setError("Couldn't Load Collections");
        });
    }, []);

    //Handlers
    function handleChangeLocation(location, view){
        setLocation(location);
        setView(view);      
    }

    function handleAddCollection(id, name, description, onValidate){

        fetch(`${window.location.origin}/library`, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({event:"CRUDLibrary", operation: Operation.CREATE, collectionId:location[location.length-2], arg: {id:id, name:name, description:description}})
          }).then((response) => {
            if(response){
                let newCollections = new Map(collections);
                newCollections.set(response.collection.id, response.collection);
                newCollections.set(response.different.id, response.different);
                setCollections(newCollections);
                onValidate(true);
            }else {
                onValidate(false);
            }         
        });
    }

    function handleRemoveCollection(id) {
        window.library.CRUDLibrary(Operation.DELETE, location[location.length-1], id).then((response) => {
            if(response){
                let newCollections = new Map(collections);
                newCollections.set(response.collection.id, response.collection);
                if(response.different.parented <= 0) {
                    newCollections.delete(response.different.id);
                } else {
                    newCollections.set(response.different.id, response.different);
                }
                setCollections(newCollections);
            }else {
            }         
        });
    }

    function handleEditCollection(id, name, description, onValidate) {
        fetch(`${window.location.origin}/library`, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({event:"CRUDLibrary", operation: Operation.UPDATE, collectionId:location[location.length-1], arg: {id:id, name:name, description:description}})
          }).then((response) => {
            if(response){
                let newCollections = new Map(collections);
                newCollections.set(response.collection.id, response.collection);
                newCollections.set(response.different.id, response.different);
                setCollections(newCollections);
                onValidate(true);
            }else {
                onValidate(false); 
            }         
        });
    }

    function handleSearch(itemType, searchTerm, onResultsFound) {
        fetch(`${window.location.origin}/library`, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({event: "SearchLibrary", itemType, searchTerm})
        }).then((response) => {
            onResultsFound(response);
        })
    }

    function handleSelectItem(searchItemDetails, onValidate){
        fetch(`${window.location.origin}/library`, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({event: "CRUDItem", operation: Operation.READ, collectionId:location[location.length-1], arg: searchItemDetails })
        }).then((response) => {
            if(response) {
                handleAddItem(response, onValidate);                
            }else {
                onValidate(false)
            }
        })
    }

    function handleAddItem(itemDetails, onValidate){
        fetch(`${window.location.origin}/library`, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({event: "CRUDItem", operation: Operation.CREATE, collectionId:location[location.length-1], arg: itemDetails })
        }).then((response) => {
            if(response){
                let newItems = new Map(items);
                let newCollections = new Map(collections);
                newCollections.set(response.collection.id, response.collection);
                newItems.set(response.different.id, response.different);
                setCollections(newCollections);
                setItems(newItems);
                onValidate(true);
            }else {
                onValidate(false);
            }         
        })
    }

    function handleUpdateItem(id, wishlist, favourite, owned, engagement) {
        window.library.CRUDItem(Operation.UPDATE, location[location.length-2], {id, wishlist, favourite, owned, engagement}).then((response) => {
            if(response) {
                let newItems = new Map(items);
                newItems.set(response.different.id , response.different);
                setItems(newItems); 
            }
        })
    }

    function handleRemoveItem(itemId) {
        window.library.CRUDItem(Operation.DELETE, location[location.length-1], itemId).then((response) => {
            if(response){
                let newItems = new Map(items);
                let newCollections = new Map(collections);
                newCollections.set(response.collection.id, response.collection);
                if(response.different.parented <= 0) {
                    newItems.delete(response.different.id);
                } else {
                    newItems.set(response.different.id, response.different);
                }
                setCollections(newCollections);
                setItems(newItems);
            }else {
            }       
        })
    }

    //View Management
    let component;
    let master = collections.get(location[0]);
    let currentCollection = collections.get(location[location.length-1]);
    let currentItem = items.get(location[location.length-1]);
    switch(view){
        case View.BOOK:
            if(currentItem == undefined) {
                setView(View.ERROR);
                setError(`At Empty Book. ${JSON.stringify(location)}`);
                break;
            }
            component = <CBook item={currentItem} onUpdateItem={handleUpdateItem}/>
            break;
        case View.SHELF:
            if(currentCollection == undefined) {
                setView(View.ERROR);
                setError(`At Empty Shelf. ${JSON.stringify(location)}`);
                break;
            }
            component = <CShelf collection={currentCollection} collections={collections} items={items} onChangeLocation={handleChangeLocation} location={location} onSearch={handleSearch}onRemoveCollection={handleRemoveCollection} onEditCollection={handleEditCollection} onAddCollection={handleAddCollection} onSelectItem={handleSelectItem} onRemoveItem={handleRemoveItem} />
            break;
        case View.LIBRARY:
            if(master == undefined) {
                setView(View.ERROR);
                setError(`Library Master Collection does not exist`);
                break;
            }
            component = <CLibrary master={master} collections={collections} items={items} location={location} onChangeLocation={handleChangeLocation} onAddCollection={handleAddCollection} onRemoveCollection={handleRemoveCollection} onEditCollection={handleEditCollection}/>
            break;
        case View.ERROR:
            component = <CError message={error}/>
            break;
        default:
            component = <CLoading/>
            break;
    }

    return (
    <div className="container">
        <header>
            <h1>The Library</h1>
            {
                master ? <CLibraryMap collections={collections} items={items} location={location} onChangeLocation={handleChangeLocation}/> : <></>
            }            
        </header>
        {component}
    </div>
    )
}

function CLoading(){
    return <div>Loading</div>
}

function CError({message}) {
    return <div>{message}</div>
}







//     const [collections, setCollections] = React.useState<{[id: string] : ICollection}>({});
//     const [loaded, setLoaded] = React.useState(false); 
//     const [creatingCollection, setCreatingCollection] = React.useState(false);

//     function handleAddCollection(name: string) {
//         //create new and update business logic
//         console.log("handling AddCollection");
//         window.library.addCollection(name).then((response: any) => {
//             if(response.success){
//                 let newCollections : {[id: string] : ICollection} = Object.assign({}, collections);
//                 let addedCollection : ICollection = response.collection;
//                 newCollections[addedCollection.id] = addedCollection;
//                 setCollections(newCollections);
//                 setCreatingCollection(false);
//             }else{
//                 console.log(`Collection ${name} already Exists`);
//             }
             
//         });
       
//     }

//     function handleCreateCollection() {
//         console.log("handlingCreateCollection");
//         setCreatingCollection(true); 
//     }

//     function handleCancelCreateCollection() {
//         setCreatingCollection(false);
//     }

//     function handleRemoveCollection(id: string) {
//         let newCollections : {[id: string] : ICollection} = Object.assign({}, collections);
//         delete newCollections[id];
//         setCollections(newCollections);
//         window.library.removeCollection(id);
//     }

//     if(!loaded) {
//         requestCollections().then((response) => {
//                 setCollections(response);
//                 setLoaded(true);
//             });
//         return <div>Loading</div>;
//     }

//     if(creatingCollection){
//         return (
//             <CCreateCollectionForm onAddCollection={handleAddCollection} onCancelCreateCollection={handleCancelCreateCollection}/>
//         );
//     }

//     return (
//         <article>
//                 <CLibraryHeader onCreateCollection={handleCreateCollection}/>
//                 {Object.entries(collections).map(([id, collection]) => {
//                     return <CShelf key={id} onRemoveCollection={handleRemoveCollection} collection={collection}/>
//                 })}
//         </article>
//     );
// }

// async function requestCollections(){
//     let response = await window.library.loadCollections();
//     return response;
// }
