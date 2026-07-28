import { ProviderAdapter } from './provider.interface.js';
import { SMMRUGAdapter } from './smmrug.adapter.js';

export class ProviderFactory {
  static createAdapter(type: string, apiUrl: string, apiKey: string, config: any = {}): ProviderAdapter {
    switch (type.toLowerCase()) {
      case 'smmrug':
        return new SMMRUGAdapter(apiUrl, apiKey);
      default:
        throw new Error('Unsupported provider type: ' + type);
    }
  }
}
