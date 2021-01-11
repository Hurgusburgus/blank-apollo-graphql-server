import { verify } from 'jsonwebtoken';
import { UserModel } from '../user/user-provider';


export default async (authorization: string, secrets: any, userModel: UserModel) => {
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