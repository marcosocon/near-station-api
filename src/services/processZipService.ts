import AdmZip from 'adm-zip'
import parse from 'csv-parse'
import {Station} from './../types/station'

export class ProcessZipService {
    public processZip(filePath: string) {
        return new Promise<Array<Station>>((resolve, reject) => {
            var output:Array<Station> = []
            const zip = new AdmZip(filePath);
            let zipEntries = zip.getEntries();
            let stopsFile = zipEntries.find((zipEntry) => zipEntry.entryName.includes("stops.txt"))
            if (stopsFile) {
                let contentString = stopsFile.getData().toString('utf8');
                parse(contentString,{ columns: true, skip_lines_with_error: true })
                    .on('data', (dataChunk) => {
                        output.push(dataChunk)
                    })
                    .on('end', () => {
                        resolve(output);
                    })
                    .on('error', () => {
                        reject(new Error('File failed on parsing.'))
                    })
            } else {
                reject(new Error('No stops file was provided'))
            }
        })
	};
}