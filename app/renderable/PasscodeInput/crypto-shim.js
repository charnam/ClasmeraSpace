/**
 * BcryptJS depends on `crypto`, but `crypto` is not an ESM module
 * in browser-like contexts, and is instead a global. This module
 * exists solely to provide `crypto` to BcryptJS without any sort
 * of module error.
 */

export default crypto;