import { User } from 'src/user/models/user.model';
import { LangEnum } from 'src/user/user.enum';
export interface GqlContext {
  currentUser?: User;
  req: Request;
  lang: LangEnum;
  country: string;
}
