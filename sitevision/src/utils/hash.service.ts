import endecUtil from "@sitevision/api/server/EndecUtil";
import messageDigesterFactory from "@sitevision/api/server/MessageDigesterFactory";

export const getHash = (
  user: string,
  assistant_id: string,
  app: string,
  salt: string
) => {
  const input = `${user}${assistant_id}${app}${salt}`;

  const messageDigester = messageDigesterFactory.getSHA256();

  const hashStringBase64 = endecUtil.base64encode(input);
  const bytes = endecUtil.base64decodeToBytes(hashStringBase64) as unknown[];
  messageDigester.updateBytes(bytes);
  const hashBytes = messageDigester.digest() as unknown[];
  const hash = endecUtil.base64encodeToString(hashBytes);
  return hash;
};
