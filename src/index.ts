import express from 'express'
import upload, { UploadedFile } from 'express-fileupload'
import { ProcessZipService } from './services/processZipService'
import { Station } from './types/station'

const app = express()
app.use(upload())

let globalStops: Array<Station> = []

app.listen('3000', () => console.log('server started on port 3000'))

app.post('/importstops', (req, res) => {
    if (req.files && req.files.file) {
        let gtfsFeed = req.files.file as UploadedFile;
        var fileName = `${__dirname}/../uploads/gtfs-${Date.now()}.zip`
        gtfsFeed.mv(fileName, (err:Error) => {
            if (err) {
                return res.status(500).send({error: 'Error while trying to upload the file.'})
            }
            const processZipService = new ProcessZipService()
            processZipService.processZip(fileName)
                .then((output: Array<Station>) => {
                    globalStops = output
                    return res.status(200).send('OK')
                }).catch((err: Error) => {
                    return res.status(500).send({error: err.message})
                })
        })
    } else {
        return res.status(400).send({ error: 'File not found' })
    }
})

app.get('/stops', (req, res) => {
    res.json(globalStops)
})
