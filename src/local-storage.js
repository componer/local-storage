import md5 from 'md5'
import {isTrue} from 'local-utils'

function getValue(data, parse = true) {
    if(!isTrue(data)) return

    data = parse ? JSON.parse(data) : data
    if(data.expires) {
        let currentTime = new Date().getTime() / 1000
        if(currentTime - data.time > data.expires) {
            return null
        }
    }

    var value = data.data
    return value
}
function setValue(value, expires, stringify = true) {
    if(!isTrue(value)) return null

    var data = {
        time : new Date().getTime() / 1000,
        expires : expires || false,
        data : value,
    }
    data = stringify ? JSON.stringify(data) : data
    return data
}

function store(storage) {
    return (key, value, expires) => {
        // get
        if(value === undefined) {
            let data = storage.getItem(key)
            let result = getValue(data)
            if(result === null) {
                storage.removeItem(key)
            }
            return result
        }

        // delete
        if(value === null) {
            return storage.removeItem(key)
        }

        // set
        let data = setValue(value, expires)
        storage.setItem(key, data)
    }
}

export default class Storage {
    constructor(options = {}) {
        window._$$storage = window._$$storage || {}

        this.options = options
        this.namespace = options.namespace || 'storage'

        return this.initialize(options) || this
    }
    initialize(options) {}
    store(key, value, expires) {
        return store(window.localStorage)(md5(this.namespace + key), value, expires)
    }
    session(key, value, expires) {
        return store(window.sessionStorage)(md5(this.namespace + key), value, expires)
    }
    get(key) {
        let name = md5(this.namespace + key)
        let data = window._$$storage[name]

        if(!isTrue(data)) return

        let value = getValue(data, false)
        if(value === null) {
            window._$$storage[name] = null
        }

        return value
    }
    set(key, value, expires) {
        let name = md5(this.namespace + key)
        let data = setValue(value, expires, false)
        window._$$storage[name] = data
        return this
    }
    remove(key) {
        delete window._$$storage[md5(this.namespace + key)]
        return this
    }
}
