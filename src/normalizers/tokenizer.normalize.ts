import { Encryptor } from '@cmmv/encryptor';
import { TokenizerOptions } from '../interfaces';

export function Tokenizer(options: TokenizerOptions) {
    return (data: string | object) => {
        if (typeof data == 'object') data = JSON.stringify(data);
        const encrypted = Encryptor.encryptPayload(options.publicKey, data);
        return JSON.stringify(encrypted);
    };
}
