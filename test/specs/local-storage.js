import Storage from '../../src/local-storage'

describe('Local Storage', () => {
    it('test', () => {
        let storage1 = new Storage({namespace: 'my-space'})
        storage1.set('name', 'ok')
        let storage2 = new Storage({namespace: 'my-space'})
        let name = storage2.get('name')

        expect(name).toBe('ok')

        let storage3 = new Storage({namespace: 'no-space'})
        let that = storage3.get('name')

        expect(that).not.toBe(name)
        expect(that).toBe(undefined)
    })
})
