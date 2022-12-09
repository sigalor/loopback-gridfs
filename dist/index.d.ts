/// <reference types="node" />
import { juggler } from '@loopback/repository';
import { GridFSBucket, ObjectId } from 'mongodb';
export interface GridFSFile {
    _id: ObjectId;
    length: number;
    chunkSize: number;
    uploadDate: Date;
    filename: string;
    md5?: string;
    metadata?: {
        container: string;
        mimetype: string;
        extension: string;
    };
}
export declare class GridFSRepository {
    protected bucketName: string;
    protected dataSource: juggler.DataSource;
    protected bucket: GridFSBucket;
    constructor(bucketName: string, dataSource: juggler.DataSource);
    upload(fileBuffer: Buffer, filename: string): Promise<GridFSFile>;
    uploadIgnoreDuplicate(fileBuffer: Buffer, filename: string): Promise<GridFSFile | undefined>;
    download(filename: string): Promise<Buffer>;
    exists(filename: string): Promise<boolean>;
}
