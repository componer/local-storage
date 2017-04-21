import Storage from '../src/local-storage'
import './a'

const storage = new Storage()

var a = storage.get('a')
console.log(a)
console.log(window._$$storage)
