import { createClient } from 'redis';

export const pub = createClient();
export const sub = createClient();

await pub.connect();
await sub.connect();
