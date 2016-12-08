import { LoaderContext } from './LoaderContext';
import { URI } from './URI';

export type ResourceReplace = URI | string | ( (oldResource: string) => (URI | string | Promise<URI | string>) );
export type ResourcesReplace = Array<string | URI> | ( (oldResources: string[]) => (Array<string | URI> | Promise<Array<string | URI>>) );

export interface BasicComponent {
  selector: string;
  template?: ResourceReplace
  styles?: ResourcesReplace
}

export interface RestyleOptions {
  context?: string;
  components: BasicComponent[];
}



export interface RestyleLoaderContext extends LoaderContext<RestyleOptions> {

}

