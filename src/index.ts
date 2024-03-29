import { juggler } from '@loopback/repository';
import { GridFSBucket, ObjectId } from 'mongodb';
import { Readable } from 'stream';

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

interface ErrorWithCode extends Error {
  code: string;
}

export class GridFSRepository {
  protected bucket: GridFSBucket;

  constructor(protected bucketName: string, protected dataSource: juggler.DataSource) {
    if (!this.dataSource.connector) {
      throw new Error('No connector');
    }
  }

  private getBucket(): GridFSBucket {
    if (!this.bucket) {
      this.bucket = new GridFSBucket(this.dataSource.connector!.db, {
        bucketName: this.bucketName,
      });
    }
    return this.bucket;
  }

  async upload(fileBuffer: Buffer, filename: string): Promise<GridFSFile> {
    return new Promise((resolve, reject) => {
      const fileDataStream = Readable.from(fileBuffer).pipe(this.getBucket().openUploadStream(filename));
      fileDataStream.on('finish', resolve);
      fileDataStream.on('error', reject);
    });
  }

  async uploadIgnoreDuplicate(fileBuffer: Buffer, filename: string): Promise<GridFSFile | undefined> {
    if (await this.exists(filename)) return;
    return this.upload(fileBuffer, filename);
  }

  async download(filename: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const data: Buffer[] = [];
      const stream = this.getBucket().openDownloadStreamByName(filename);
      stream.on('data', (chunk: Buffer) => data.push(chunk));
      stream.on('end', () => resolve(Buffer.concat(data)));
      stream.on('error', reject);
    });
  }

  async exists(filename: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const stream = this.getBucket().openDownloadStreamByName(filename);
      let isResolved = false;

      stream.on('data', () => {
        if (!isResolved) resolve(true);
        stream.destroy();
      });

      stream.on('end', () => {
        // only relevant when file is empty
        if (!isResolved) resolve(true);
      });

      stream.on('error', (e: ErrorWithCode) => {
        if (e.code === 'ENOENT') resolve(false);
        else reject(e);
      });
    });
  }
}
