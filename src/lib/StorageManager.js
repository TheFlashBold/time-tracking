import mpath from "mpath"

class StorageManager {

    constructor() {
        this.data = {};
        const storage = localStorage.getItem("storage");
        if (storage) {
            this.data = JSON.parse(storage);
        }
    }

    get(path, fallback) {
        return mpath.get(path, this.data) || fallback;
    }

    set(path, value) {
        mpath.set(path, value, this.data);
        localStorage.setItem("storage", JSON.stringify(this.data));
    }
}

export default new StorageManager();