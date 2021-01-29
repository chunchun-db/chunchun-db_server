import { IDbClient } from '@chunchun-db/shared/dist/IDbClient';

import { FileDbClient } from './db/FileDbClient';

export const dbClient: IDbClient = new FileDbClient();
