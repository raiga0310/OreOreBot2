import type { VersionFetcher } from '../../service/command/version.js';
import pkg from '../../../package.json';

export class GenVersionFetcher implements VersionFetcher {
  public readonly version: string;

  constructor() {
    this.version = pkg.version;
  }
}
