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
        this.bucket = new mongodb_1.GridFSBucket(this.dataSource.connector.db, {
            bucketName: this.bucketName,
        });
    }
    async upload(fileBuffer, filename) {
        return new Promise((resolve, reject) => {
            const fileDataStream = stream_1.Readable.from(fileBuffer).pipe(this.bucket.openUploadStream(filename));
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
            const stream = this.bucket.openDownloadStreamByName(filename);
            stream.on('data', (chunk) => data.push(chunk));
            stream.on('end', () => resolve(Buffer.concat(data)));
            stream.on('error', reject);
        });
    }
    async exists(filename) {
        return new Promise((resolve, reject) => {
            const stream = this.bucket.openDownloadStreamByName(filename);
            stream.on('data', () => {
                resolve(true);
                stream.destroy();
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