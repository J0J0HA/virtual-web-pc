class FileStorage {
  constructor (name, autosave=true) {
    this.name = name;
    this.autosave = autosave;
    this.data = {
      "": {
        type: "system-root"
      }
    };
    if (this.autosave) this.loadFS();
  }

  saveFS () {
    localStorage.setItem(
      this.name,
      JSON.stringify(this.data)
    );
  }

  loadFS () {
    this.data = JSON.parse(
      localStorage.getItem(this.name)
    );
    if (!(this.data[""] && this.data[""].type == "system-root")) {
      this.data[""] = {
        type: "system-root"
      };
    }
  }

  deleteFS () {
    localStorage.removeItem(this.name)
  }

  _getParent (path) {
    var pieces = path.split("/");
    var path_depth = pieces.length;
    var lastPiceRemoved = pieces.slice(0, path_depth -1);
    var parent_path = lastPiceRemoved.join("/");
    return parent_path;
  }

  _getValue (path) {
    var data = this.data[path];
    if (!data) {
      data = {
        type: "none",
        parent: this._getParent(path)
      }
    };
    return data;
  }

  _setValue (path, data) {
    this.data[path] = data
    if (this.autosave) this.saveFS();
  }

  writeFile (path, content) {
    var data = this._getValue(path);
    if (data.type != "file") {
      if (data.type == "none") {
        this.makeFile(path);
      } else {
        throw new Error("Not a file");
      }
    }
    content = {
      content: content,
      type: "file"
    };
    this._setValue(path, content);
  }

  makeFile (path) {
    var data = this._getValue(path);
    if (data.type != "none") {
      throw new Error("Not empty");
    }
    if (this._getValue(data.parent).type == "none") {
      throw new Error("No parent");
    }
    content = {
      content: undefined,
      type: "file"
    };
    this._setValue(path, content);
  }

  makeDir (path) {
    var data = this._getValue(path);
    if (data.type != "none") {
      throw new Error("Not empty");
    }
    if (this._getValue(data.parent).type == "none") {
      throw new Error("No parent");
    }
    content = {
      content: {},
      type: "dir"
    }
    this._setValue(path, content)
  }

  remove (path) {
    var data = this._getValue(path);
    if (data.type == "none") {
      throw new Error("Already empty");
    }
    content = {
      type: "none"
    }
    this._setValue(path, content)
  }

  readFile (path) {
    var data = this._getValue(path);
    if (data.type != "file") {
      throw new Error("Not a file")
    }
    return data.content;
  }

  listDir (path) {
    var data = this._getValue(path);
    if (data.type != "dir" && data.type != "system-root") {
      throw new Error("Not a dir")
    }
    var filenames = [];
    for (const filename in this.data) {
      filenames.push(filename);
    }
    return filenames.filter(
      function (filename) {
        return filename.startsWith(path + "/")
      }
    );
  }

  delete (path, content) {
    return System.deleteValue(this.module, path, content);
  }
}

class TempFile {
  constructor (path) {
    this.path = path;
    this.content = content;
  }

  write(content) {
    this.content = content;
  }

  read() {
    return this.content;
  }
}

class RealFile {
  constructor (storage, path) {
    this.storage = storage;
    this.path = path;
  }

  write(content) {
    this.storage.write(this.path, content);
  }

  read() {
    return this.storage.read(this.path);
  }
}

function open(path, storage) {
  if (!storage) {
    return new TempFile(path);
  }
  else {
    return new RealFile(storage, path);
  }
}
