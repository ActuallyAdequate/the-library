import fs from "fs"

export default class FileStore {
    constructor(filename) {
        this.filename = filename;
    }

    LoadJSON() {
        let jsonString = fs.readFileSync(this.filename, "utf8");
        try{
            return JSON.parse(jsonString);
        } catch {
            return undefined;
        }
        
    }

    SaveJSON(JSONobj) {
        let JSONstring = JSON.stringify(JSONobj);
        fs.writeFileSync(this.filename, JSONstring);
    }
}