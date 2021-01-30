import { IDbClient } from '@chunchun-db/shared';

import { FileDbClient } from './db/FileDbClient';

export const dbClient: IDbClient = new FileDbClient();
