import { Crypto } from "@peculiar/webcrypto";

export const crypto = globalThis.crypto ?? new Crypto();