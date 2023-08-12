import React from "react";

export default function CBook({item, onUpdateItem}) {

    return (
        <article className= "">
            <div className="row">
            {item.itemType != ItemTypes.BOOK ? <img className="round" src={item.bannerURL}/> : <></>}
            <section className="col-sm-4">
               <h1>{item.name}</h1>
               {item.itemType == ItemTypes.BOOK ? <img className="round" src={item.bannerURL}/> : <></>}
               <div>
                <input type="checkbox" checked={item.owned} className="btn-check" id="btn_owned" autoComplete="off" onChange={(e) => {onUpdateItem(item.id, undefined, undefined, e.target.checked, undefined)} }/>
                <label className="btn btn-outline-primary" htmlFor="btn_owned">+</label>
                <input type="checkbox" checked={item.wishlisted} className="btn-check" id="btn-wishlist" autoComplete="off" onChange={(e) => {onUpdateItem(item.id, e.target.checked,undefined, undefined, undefined)}}/>
                <label className="btn btn-outline-danger" htmlFor="btn-wishlist">&hearts;</label>
                <input type="checkbox" checked={item.favourite} className="btn-check" id="btn-favourite" autoComplete="off" onChange={(e) => {onUpdateItem(item.id, undefined, e.target.checked, undefined, undefined)}}/>
                <label className="btn btn-outline-warning" htmlFor="btn-favourite">&#9733;</label>
                </div>
                <p>{item.author?.join(' & ')}</p>
                <p>{item.year}</p>
                <p>{item.genres?.join(', ')}</p>
            </section>
            <section className="col-sm-8">
                    <p dangerouslySetInnerHTML={{__html: item.description}}></p>
                    <button type="button" className="btn btn-outline-success" data-bs-toggle="modal" data-bs-target={`#e${item.id}-editModal`}>Add Engagement</button>
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Comment</th>
                            </tr>
                        </thead>
                    <tbody>
                        {item.engagement.map((engagement, index) => {
                            return <tr key={index}><td>{engagement.date.getDate()}/{engagement.date.getMonth()}/{engagement.date.getFullYear()}</td><td>{engagement.comment}</td></tr>
                        })}
                    </tbody>
                    </table>

                    
            </section> 
            </div>
            
            <CEditItemForm item={item} onEditItem={onUpdateItem}/>          
        </article>
    )
}

export function CEditItemForm({item, onEditItem}) {
    const [engagementDate, setEngagementDate] = React.useState<Date>(new Date());
    const dateInputRef = React.useRef(null);
    const [engagementComment, setEngagementComment] = React.useState<string>("");

    function handleResetValues(){
        setEngagementDate(new Date());
        setEngagementComment("");
    }

    return (
        <div className="modal fade" id={`e${item.id}-editModal`} data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby={`e${item.id}-editModalLabel`} aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id={`${item.id}-editModalLabel`}>Add Engagement for {item.name}</h5>
                        <button type="button"  onClick={()=> {handleResetValues()}} className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <div className="input-group mb-3">
                            <span className="input-group-text" id="basic-addon1">Date:</span>
                            <input type="date" id={`e${item.id}-editDate`} className="form-control" ref={dateInputRef} onChange={(e) => {setEngagementDate(new Date(e.target.value));}}  required={true}/>
                        </div>
                        <div className="input-group">
                            <span className="input-group-text">Comment</span>
                            <textarea id={`e${item.id}-editComment`} className="form-control"  onChange={(e) => {setEngagementComment(e.target.value);}} required={true}></textarea>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button onClick={()=> {handleResetValues()}} type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button onClick={() => {onEditItem(item.id, undefined, undefined, undefined, {date: engagementDate, comment: engagementComment})}} type="button" className="btn btn-success" data-bs-dismiss="modal">Add Engagement</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

