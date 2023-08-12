import { ItemTypes } from "main/defintions/ItemTypes.e";
import { ICollection, IItem, ISearchItem } from "main/defintions/LibraryModel";
import React from "react";

function CSearchedItem({existsInCollection, collectionId, searchItemDetails, onSelectItem}){
    
    function handleValidate(success){
        if(success) {
            let itemAddButton = document.getElementById(`a${searchItemDetails.id}-addbutton`);
            if(itemAddButton){
                SetButtonStatus(true);
            }
        }
    }

    function SetButtonStatus(added){
        let itemAddButton = document.getElementById(`a${searchItemDetails.id}-addbutton`);
        if(added && itemAddButton){
            itemAddButton.classList.remove("btn-outline-secondary");
            itemAddButton.classList.add("btn-success");
            itemAddButton.textContent=("Added");
            itemAddButton.setAttribute("disabled", "false");
        } else if(itemAddButton) {
            itemAddButton.classList.remove("btn-success");
            itemAddButton.classList.add("btn-outline-secondary");           
            itemAddButton.textContent=("Add");
            itemAddButton.setAttribute("disabled", "true");
        }
    }

    return (
        <div className="card col-6">
            <img src={searchItemDetails.thumbnailURL} className="card-img-top"/>
            <div className="card-body">
            <h6 className="card-title">{searchItemDetails.name}</h6>
            </div>
            <div className="card-footer">
                <button id={`a${searchItemDetails.id}-addbutton`} className={`btn btn-sm${existsInCollection? "btn-success" : "btn-outline-secondary"}`} disabled={existsInCollection} onClick={() => {onSelectItem(searchItemDetails, handleValidate)}}>{existsInCollection? "U+2714" : "Add"}</button>
            </div>
        </div>
    )
}

export function CAddItemForm({collection, onSearch, onSelectItem}) {
    let [itemType, setItemType] = React.useState(ItemTypes.BOOK)
    let [searchTerm, setSearchTerm] = React.useState('');
    let [resultItems, setResultItems] = React.useState([]);

    function resetValues() {
        setSearchTerm('');
        setResultItems([]);
    }

    function handleResultsFound (results){
        setResultItems(results);
    }

    return (
        <>
        <button className="btn btn-outline-dark" type="button" data-bs-toggle="offcanvas" data-bs-target="#addItemForm" aria-controls="addItemForm">
        Add Item
        </button>
        <div className="offcanvas offcanvas-end" tabIndex={-1} id="addItemForm" aria-labelledby="addItemFormLabel">
            <div className="offcanvas-header">
                <h5 className="offcanvas-title" id="addItemFormLabel">Search</h5>
                <button type="button" onClick={resetValues} className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div className="offcanvas-body">
                <div className="input-group mb-3">
                    <input type="text" className="form-control" value={searchTerm} onChange={(e) => {setSearchTerm(e.target.value)}} aria-label="Text input with segmented dropdown button"/>
                    <button type="button" onClick={() =>{onSearch(itemType, searchTerm , handleResultsFound)}} className="btn btn-outline-secondary">Search {itemType}</button>
                    <button type="button" className="btn btn-outline-secondary dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown" aria-expanded="false">
                        <span className="visually-hidden">Toggle Dropdown</span>
                    </button>
                    <ul className="dropdown-menu">
                        <li><a className="dropdown-item" onClick={()=> {setItemType(ItemTypes.BOOK)}} href="#">Books</a></li>
                        <li><a className="dropdown-item" onClick={()=> {setItemType(ItemTypes.MOVIETV)}} href="#">Movies/TV</a></li>
                        <li><a className="dropdown-item" onClick={()=> {setItemType(ItemTypes.TABLETOPGAME)}} href="#">Boardgames</a></li>                        
                        <li><a className="dropdown-item" onClick={()=> {setItemType(ItemTypes.VIDEOGAME)}} href="#">Videogames</a></li>
                    </ul>
                </div>
                <div className="scrollable row">
                {resultItems.map((searchItemDetails, index) => {
                    let existsInCollection = collection.items.find((id) => {
                        return id === `${itemType}-${id}`}) !== undefined;
                    return <CSearchedItem key={index} existsInCollection={existsInCollection} collectionId={collection} searchItemDetails={searchItemDetails} onSelectItem={onSelectItem}/>
            })}
                </div>
            </div>
        </div>
        </>
    )
}

export function CConfirmDeleteItem({item, onRemoveItem}) {
    return (
        <div className="modal fade" id={`r${item.id}-removeModal`} data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby={`r${item.id}-removeModalLabel`} aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id={`r${item.id}-removeModalLabel`}>Are You Sure?</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                    Do you want to remove {item.name}?
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Keep</button>
                        <button onClick={() => {onRemoveItem(item.id)}} type="button" className="btn btn-danger" data-bs-dismiss="modal">Remove</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
