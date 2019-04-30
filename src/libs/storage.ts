class AppStorage {

  public storageKey: string;
  public data: { [name: string]: any };

  constructor() {
    this.storageKey = 'minimanstudio';
    this.data = this.retrieveStorage();
  }

  public setItem(key: string, value: any) {
    this.data[key] = value;
    this.saveStorage();
  }

  public getItem(key: string, value: any) {
    return this.data[key] || null;
  }

  public saveStorage() {
    window.localStorage.setItem(this.storageKey, JSON.stringify(this.data));
  }

  public removeItem(key: string) {
    const target = this.data[key];
    if (target) {
      delete this.data[key];
      this.saveStorage();
    }
  }

  private retrieveStorage() {
    const currentStorage = window.localStorage.getItem(this.storageKey);
    if (currentStorage) {
      return JSON.parse(currentStorage);
    } else {
      return {};
    }
  }
}

const storageInstance = new AppStorage();
export default storageInstance;
