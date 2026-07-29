import { SMMRUGAdapter } from './smmrug.adapter.js';
export class ProviderFactory {
    static createAdapter(type, apiUrl, apiKey, config = {}) {
        switch (type.toLowerCase()) {
            case 'smmrug':
                return new SMMRUGAdapter(apiUrl, apiKey);
            default:
                throw new Error('Unsupported provider type: ' + type);
        }
    }
}
