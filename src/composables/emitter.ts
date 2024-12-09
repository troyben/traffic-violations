import mitt from 'mitt'

type Events = {
    'refresh-violations': void;
}

export const emitter = mitt<Events>() 