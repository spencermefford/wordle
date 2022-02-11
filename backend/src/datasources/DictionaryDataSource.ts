import { RESTDataSource } from 'apollo-datasource-rest';

interface DictionaryResponse {
  word: string;
  meanings: Record<string, string>[];
  phonetics: Record<string, string>[];
}

export default class DictionaryDataSource extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'https://api.dictionaryapi.dev/api/v2/';
  }

  async validateWord(word: string): Promise<boolean> {
    const response = await this.get<DictionaryResponse>(`entries/en/${word}`);
    return response?.word?.length > 0 && response?.meanings?.length > 0;
  }
}
