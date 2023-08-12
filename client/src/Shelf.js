import React from "react";
import { CItemDisplay, CShelfDisplay } from "./Displays";
import { CAddCollectionForm } from "./CollectionForms";
import { CAddItemForm } from "./ItemForms";


export default function CShelf({collection, collections, items, onChangeLocation, location, onSearch, onSelectItem, onRemoveCollection, onRemoveItem, onEditCollection, onAddCollection}) {
    return (
        <article>
            <CAddCollectionForm collections={collections} onAddCollection={onAddCollection}/>
            <CAddItemForm onSelectItem={onSelectItem} collection={collection} onSearch={onSearch}/>
            <h2>{collection.name}</h2>
            <div className="row">
            {collection.items.map((id) => {
                let item = items.get(id);
                if(item) return <CItemDisplay key={id}  item={item} shelf={collection.id} onChangeLocation={onChangeLocation} location={location} onRemoveItem={onRemoveItem}/>
            })}
            </div>
            <div className="row">
            {collection.subCollections.map((id) => {
                let collection = collections.get(id);
                if(collection) return <CShelfDisplay key={id} items={items}  location={location} collection={collection} onChangeLocation={onChangeLocation} onRemoveCollection={onRemoveCollection} onEditCollection={onEditCollection}/>
            })}
            </div>
        </article>
    )
}