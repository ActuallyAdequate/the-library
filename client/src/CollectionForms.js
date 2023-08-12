import React from "react";

export function CAddCollectionForm({collections, onAddCollection}){
    const [collectionName, setCollectionName] = React.useState('');
    const [collectionDescription, setcollectionDescription] = React.useState('');
    const [matches, setMatches] = React.useState<Array<ICollection>>(new Array());

    function handleNameValidation(success) {
        let collectioNameInput = document.getElementById('collectionName');
        if(collectioNameInput){
            if(success === false) {
                collectioNameInput.classList.remove("is-valid");
                collectioNameInput.classList.add("is-invalid");
            }
            else if(success === true) {
                collectioNameInput.classList.remove("is-invalid");
                collectioNameInput.classList.add("is-valid");
                setCollectionName('');
                setcollectionDescription('');
                setMatches([]);
            } else {
                collectioNameInput.classList.remove("is-invalid");
                collectioNameInput.classList.remove("is-valid");
            }
        }  
    }

    function matchCollections(collections, term){
        let matches = [];
        if(term.trim() !== ""){
            var reg = new RegExp(term, 'i')
            for(let [id, collection] of collections.entries()) {
                if(id === "0") {continue;}
                let match = collection.name.match(reg)
                match = match ?? collection.description.match(reg);
                if(match) {matches.push(collection)}
            }
        }        
        setMatches(matches);        
    }

    return (
        <>
            <button className="btn btn-sm btn-outline-dark" type="button" data-bs-toggle="collapse" data-bs-target="#addCollectionForm" aria-expanded="false" aria-controls="addCollectionForm">
                Create Collection
            </button>
            <div className="row">
                <div className="collapse col-md-6" id="addCollectionForm">            
                    <div className="card card-body">
                        <div className="mb-3">
                        <label htmlFor="collectioName" className="form-label">Collection Name</label>
                        <input type="text" id="collectionName" className="form-control" value={collectionName} onChange={(e) => {setCollectionName(e.target.value); handleNameValidation(undefined); matchCollections(collections, e.target.value)}}></input>
                            <ul className="list-group">
                                {
                                    matches.map((matchCollection) => {
                                        return  <li key={matchCollection.id} className="list-group-item"><small>{matchCollection.name} : {matchCollection.description.substring(0, 40)}...</small> <button className="btn btn-small btn-primary" onClick={()=>{onAddCollection(matchCollection.id, matchCollection.name, matchCollection.description, handleNameValidation)}}>Add</button></li>
                                    })
                                }
                            </ul>                        
                        <label htmlFor="collectionDescription" className="form-label">Collection Description</label>
                        <textarea id="collectionDescription" className="form-control" value={collectionDescription} onChange={(e) => {setcollectionDescription(e.target.value);}}></textarea>
                        <div className="invalid-feedback">Failed to Add</div>
                        <div className="valid-feedback">Successfully Added Collection</div>
                        </div>
                        <div className="btn-group">
                            <button onClick={() => {onAddCollection(undefined, collectionName, collectionDescription, handleNameValidation)}} className="btn btn-sm btn-primary">Add</button>
                            <button onClick={() => {handleNameValidation(true)}} className="btn btn-sm btn-secondary" type="button" data-bs-toggle="collapse" data-bs-target="#addCollectionForm" aria-expanded="false" aria-controls="addCollectionForm">Cancel</button>
                        </div>
                    </div>
               </div>
            </div>
        </>
    )
}

export function CEditForm({collection, onEditCollection}) {
    let [collectionName, setCollectionName] = React.useState<string|undefined>(collection.name);
    let [collectionDescription, setCollectionDescription] = React.useState<string|undefined>(collection.description);

    function handleNameValidation(success) {
        console.log("Validating");
        let collectionNameInput = document.getElementById(`e${collection.id}-editCollectionName`);
        let collectionDescriptionInput = document.getElementById(`e${collection.id}-editCollectionDescription`)
        if(collectionNameInput && collectionDescriptionInput){
            if(success === false) {
                collectionNameInput.classList.add("is-invalid");
                collectionNameInput.classList.remove("is-valid");
                collectionDescriptionInput.classList.remove("is-valid");
            }
            else if(success === true) {
                collectionNameInput.classList.remove("is-invalid");
                collectionNameInput.classList.add("is-valid");
                collectionDescriptionInput.classList.add("is-valid");
            } else {
                collectionNameInput.classList.remove("is-invalid");
                collectionNameInput.classList.remove("is-valid");
                collectionDescriptionInput.classList.remove("is-valid");
            }
            console.log("foudn componenets");
        }  
    }

    function handleResetValues(){
        setCollectionDescription(collection.description);
        setCollectionName(collection.name);
    }

    return (
        <div className="modal fade" id={`e${collection.id}-editModal`} data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby={`e${collection.id}-editModalLabel`} aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id={`${collection.id}-editModalLabel`}>Make Changes to {collection.name}</h5>
                        <button type="button"  onClick={()=> {handleNameValidation(undefined); handleResetValues()}} className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <div className="input-group mb-3">
                            <span className="input-group-text" id="basic-addon1">New Name:</span>
                            <input type="text" id={`e${collection.id}-editCollectionName`} className="form-control" value={collectionName} onChange={(e) => {setCollectionName(e.target.value); handleNameValidation(undefined)}} placeholder={collection.name} aria-label="Username" aria-describedby="basic-addon1" required={true}/>
                        </div>
                        <div className="input-group">
                            <span className="input-group-text">Description</span>
                            <textarea id={`e${collection.id}-editCollectionDescription`} className="form-control" value={collectionDescription} onChange={(e) => {setCollectionDescription(e.target.value); handleNameValidation(undefined)}} placeholder={collection.description} aria-label="With textarea" required={true}></textarea>
                            <div className="valid-feedback">Changes Accepted</div>
                            <div className="invalid-feedback">Could Not Make Changes</div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button onClick={()=> {handleNameValidation(undefined); handleResetValues()}} type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button onClick={() => {onEditCollection(collection.id, collectionName, collectionDescription, handleNameValidation)}} type="button" className="btn btn-warning">Update</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export function CConfirmDelete({collection, onRemoveCollection}) {
    return (
        <div className="modal fade" id={`r${collection.id}-removeModal`} data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby={`r${collection.id}-removeModalLabel`} aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id={`r${collection.id}-removeModalLabel`}>Are You Sure?</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                    Do you want to remove {collection.name}?
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Keep</button>
                        <button onClick={() => {onRemoveCollection(collection.id)}} type="button" className="btn btn-danger" data-bs-dismiss="modal">Remove</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
