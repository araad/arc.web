export namespace ServiceManager {
    let map: Map<string, any> = new Map<string, any>();

    export function addService(name: string, instance: any) {
        if(map.get(name)) {
            throw new Error('Service already exists');
        }

        map.set(name, instance);
    }

    export function getService(name: string) {
        return map.get(name);
    }
}