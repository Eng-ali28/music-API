export class Auth {
  validEmail: boolean;
  gmailId: string;
  facebookId: string;
  constructor(validEmail: boolean, gmailId: string, facebookId: string) {
    this.validEmail = validEmail;
    this.gmailId = gmailId;
    this.facebookId = facebookId;
  }
}
