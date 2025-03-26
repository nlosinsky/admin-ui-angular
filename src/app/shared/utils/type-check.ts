export class TypeCheck {
  public static isWebsiteUrl(value: string): boolean {
    const regEx = /^https?:\/\/(www\.)?[a-z0-9]+([-.][a-z0-9]+)*\.[a-z]{2,5}(:\d{1,5})?(\/.*)?$/;
    return regEx.test(value);
  }
}
