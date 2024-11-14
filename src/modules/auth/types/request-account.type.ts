import { Roles } from '#/shared/constants/user-roles.constants';

export interface RequestAccount {
  accountId: string;
  accountEmail: string;
  accountRole: Roles;
}
