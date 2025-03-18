// eslint-disable-next-line import/no-cycle
import { CoreModule } from '@app/core/core.module';

export function throwIfAlreadyLoaded(parentModule: CoreModule, moduleName: string): never | void {
  if (parentModule) {
    throw new Error(`${moduleName} has already been loaded. Import Core modules in the AppModule only.`);
  }
}
