"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridFSRepository = void 0;
const mongodb_1 = require("mongodb");
const stream_1 = require("stream");
class GridFSRepository {
    constructor(bucketName, dataSource) {
        this.bucketName = bucketName;
        this.dataSource = dataSource;
        if (!this.dataSource.connector) {
            throw new Error('No connector');
        }
    }
    getBucket() {
        if (!this.bucket) {
            this.bucket = new mongodb_1.GridFSBucket(this.dataSource.connector.db, {
                bucketName: this.bucketName,
            });
        }
        return this.bucket;
    }
    async upload(fileBuffer, filename) {
        return new Promise((resolve, reject) => {
            const fileDataStream = stream_1.Readable.from(fileBuffer).pipe(this.getBucket().openUploadStream(filename));
            fileDataStream.on('finish', resolve);
            fileDataStream.on('error', reject);
        });
    }
    async uploadIgnoreDuplicate(fileBuffer, filename) {
        if (await this.exists(filename))
            return;
        return this.upload(fileBuffer, filename);
    }
    async download(filename) {
        return new Promise((resolve, reject) => {
            const data = [];
            const stream = this.getBucket().openDownloadStreamByName(filename);
            stream.on('data', (chunk) => data.push(chunk));
            stream.on('end', () => resolve(Buffer.concat(data)));
            stream.on('error', reject);
        });
    }
    async exists(filename) {
        return new Promise((resolve, reject) => {
            const stream = this.getBucket().openDownloadStreamByName(filename);
            let isResolved = false;
            stream.on('data', () => {
                if (!isResolved)
                    resolve(true);
                stream.destroy();
            });
            stream.on('end', () => {
                // only relevant when file is empty
                if (!isResolved)
                    resolve(true);
            });
            stream.on('error', (e) => {
                if (e.code === 'ENOENT')
                    resolve(false);
                else
                    reject(e);
            });
        });
    }
}
exports.GridFSRepository = GridFSRepository;
//# sourceMappingURL=index.js.map