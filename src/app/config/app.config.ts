import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AppConfigInterface } from './app-config.model';

@Injectable()
export class AppConfig {
  static settings: AppConfigInterface;

  private _config: any;
  private _env: any;

  constructor(private _httpClient: HttpClient) {  }

  load() {
    const jsonFile = `assets/config/config.${environment.name}.json`;
    return new Promise<void>((resolve, reject) => {
      this._httpClient.get(jsonFile).toPromise().then(response => {
        AppConfig.settings = <AppConfigInterface>(response);
        resolve();
      }).catch(response => {
        reject(`Could not load file '${jsonFile}': ${JSON.stringify(response)}`)
      });
    });
  }

  getEnv(key: any) {
    return this._env[key];
  }

  get(key: any) {
    return this._config[key];
  }

}
