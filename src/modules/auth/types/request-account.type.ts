import { Roles } from '#/shared/constants/user-roles.constant';

export interface RequestAccount {
  accountId: string;
  accountEmail: string;
  accountRole: Roles;
}
