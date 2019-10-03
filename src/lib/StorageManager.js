import mpath from "mpath"

class StorageManager {

    constructor() {
        this.data = {};
        const storage = sessionStorage.getItem("storage");
        if (storage) {
            this.data = JSON.parse(storage);
        }
    }

    get(path, fallback) {
        return mpath.get(path, this.data) || fallback;
    }

    set(path, value) {
        mpath.set(path, value, this.data);
        sessionStorage.setItem("storage", JSON.stringify(this.data));
    }
}

export default new StorageManager();