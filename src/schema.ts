import 'graphql-import-node';;
import { mergeSchemas } from 'graphql-tools';
import userSchema from  './user/schema';
import tableSchema from './table/schema';

const schema = mergeSchemas({
  schemas: [
    userSchema,
    tableSchema
  ],
});
export default schema;
