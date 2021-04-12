import { SHA256 } from "crypto-js";
import EDDSA from "elliptic";
import { v1 as uuidv1 } from 'uuid'

export const eddsa: EDDSA.eddsa = new EDDSA.eddsa("ed25519")

export class ChainUtil {
  static genKeyPair = (secret: EDDSA.eddsa.Bytes): EDDSA.eddsa.KeyPair =>
    eddsa.keyFromSecret(secret)

  static id = (): string => uuidv1()

  static hash = (data: any): string => SHA256(JSON.stringify(data)).toString()

  static verifySignature = (
      publicKey: EDDSA.eddsa.Bytes | EDDSA.eddsa.KeyPair | EDDSA.curve.base.BasePoint,
      signature: EDDSA.eddsa.Bytes | EDDSA.eddsa.Signature,
      dataHash: string
  ): boolean => eddsa.keyFromPublic(publicKey).verify(dataHash, signature)
}