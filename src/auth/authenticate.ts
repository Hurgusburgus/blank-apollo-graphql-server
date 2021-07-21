import { verify } from 'jsonwebtoken';
import { UserModel } from '../user/user-provider';


export const authenticate = async (authorization: string, secrets: any, userModel: UserModel) => {
  const bearerLength = "Bearer ".length;
  if(authorization && authorization.length > bearerLength){
    const token = authorization.slice(bearerLength);
    const { ok, result } = await new Promise(resolve => 
      verify(token, secrets.JWT_SECRET, (err: any, result:any) => {
        if (err) {
          resolve({
            ok: false,
            result: err,
          });
        } else {
          resolve({
            ok: true,
            result,
          });
        }
      })
    );
    if (ok) {
      const user = await userModel.getUser(result.username, result.password);
      return user;
    }
  }
  return null;
}

export interface GraphQLWhitelistEntry {
  query: string;
  endpoint: string;
};

export const isRequestWhitelisted = (request: any, whiteList: GraphQLWhitelistEntry[]) => {
  if (request.body && request.body.query) {
    const bits = (request.body.query as string).split('{');
    const [first, second] = bits;
    const [query] = first.split(' ');
    const [endpoint] = second.trim().split('(');
    console.log(query, endpoint);
    if (whiteList.find(e => e.query === query && e.endpoint === endpoint)) {
      return true;
    } 
  }
  return false;
}

