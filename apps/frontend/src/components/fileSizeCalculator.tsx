/**
 * Calculates the file size of an imported .csv file
 * @param bytes : raw file byte amount to be converted to actual amount
 * @param decimals : file string size to tenths place
 */
function fileSizeCalculator(bytes: number, decimals = 2): string {
  // Base case when the size is 0
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;

  //Array of possible sizes (should be to bytes, kb, mb, worst case gb)
  const sizes = ["bytes", "kb", "mb", "gb"];

  // Calculate appropriate size unit index based on the file size
  // Takes logarithm of file size / k
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  // Calculate formatted size with the specified number of decimals
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

export default fileSizeCalculator;
