/**
 * @description: converts a byte array into its hex string value
 * @param byteArray 
 * @returns 
 */
export function toHexString(byteArray: Uint8Array):string {
  return Array.from(byteArray, byte => {
    return ('0' + (byte & 0xFF).toString(16)).slice(-2);
  }).join('');
}