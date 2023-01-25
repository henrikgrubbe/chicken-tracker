import {Configuration, EggEventControllerApi} from '@/api/chicken-data';

const config = new Configuration({
      basePath: 'https://chicken-data.private.fantastiskefroe.dk/'
    }
);

export const EggEventApi = new EggEventControllerApi(config);
