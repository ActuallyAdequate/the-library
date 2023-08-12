import React from "react";
import { CShelfDisplay } from "./Displays";
import { CAddCollectionForm } from "./CollectionForms";



export default function CLibrary({master, collections, items, onChangeLocation, location, onAddCollection, onRemoveCollection, onEditCollection}) {
    
    return (
        <article>
            <CAddCollectionForm collections={collections} onAddCollection={onAddCollection}/>
            <h2>{master.name}</h2>
            {master.subCollections.map((id) => {
                let collection = collections.get(id);
                if(collection)return <CShelfDisplay key={id} items = {items} location={location} collection={collection} onChangeLocation={onChangeLocation} onRemoveCollection={onRemoveCollection} onEditCollection={onEditCollection}/>
            })}
        </article>
    );
}
