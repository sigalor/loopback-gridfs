# loopback-gridfs

[![GitHub license](https://img.shields.io/github/license/sigalor/loopback-gridfs)](https://github.com/sigalor/loopback-gridfs/blob/main/LICENSE) [![npm](https://img.shields.io/npm/v/loopback-gridfs)](https://www.npmjs.com/package/loopback-gridfs)

Uses MongoDB's [GridFS](https://www.mongodb.com/docs/manual/core/gridfs/) to manage binary contents of your LoopBack 4 application. Full TypeScript support. Works simply with Node.js `Buffer` objects.

## Installation

Add the loopback-gridfs dependency to your project:

```bash
npm install loopback-gridfs
```

## Usage

Simply create a new LoopBack 4 repository which inherits from `GridFSRepository`. The first parameter to `super` in the constructor is the bucket name, the second one is your existing Mongo data source. The following code would go into `src/repositories/document-contents.repository.ts` and that repository can then be injected into LoopBack 4 controllers, services etc. like any other.

```typescript
import { juggler } from '@loopback/repository';
import { GridFSRepository } from 'loopback-gridfs';

export class MyFilesRepository extends GridFSRepository {
  constructor(@inject('datasources.mongo') dataSource: juggler.DataSource) {
    super('MyFiles', dataSource);
  }
}
```

## Reference

### GridFSRepository

| Method signature                                                                                      | Description                                                                                                          |
| ----------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `async upload(fileBuffer: Buffer, filename: string): Promise<GridFSFile>`                             | Uploads the specified buffer to the bucket using the specified filename and returns details about the uploaded file. |
| `async uploadIgnoreDuplicate(fileBuffer: Buffer, filename: string): Promise<GridFSFile \| undefined>` | Same as `upload`, but does nothing and returns `undefined` if any file with the given name already exists.           |
| `async download(filename: string): Promise<Buffer>`                                                   | Downloads a file using its filename.                                                                                 |
| `async exists(filename: string): Promise<boolean>`                                                    | Returns a boolean indicating whether any file with the specified name exists.                                        |

### GridFSFile

```typescript
interface GridFSFile {
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
```

## License

MIT
