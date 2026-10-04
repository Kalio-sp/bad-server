import { unlink } from 'fs'
import { join, resolve, sep } from 'path'

const publicDir = resolve(__dirname, '../public')

export default function safeUnlink(relativePath: string) {
    const target = resolve(join(publicDir, relativePath))

    if (!target.startsWith(publicDir + sep)) {
        return
    }

    unlink(target, (err) => {
        if (err) console.error(err.message)
    })
}
