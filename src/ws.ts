import * as WebSocket from 'isomorphic-ws'

export class AsyncWebSocket {

    private ws: WebSocket;

    private bufferQueue: any[] = [];

    async connect(url: string): Promise<void> {
        if (this.ws != null) {
            throw 'CONNECTED!';
        }
        await new Promise((res, rej) => {
            this.ws = new WebSocket(url);
            this.ws.binaryType = "arraybuffer";
            this.ws.onopen = res;
            this.ws.onerror = rej;
        });
        this.ws.onopen = null;
        this.ws.onmessage = this.onmessage.bind(this);
        this.ws.onerror = this.onerror.bind(this);
        this.ws.onclose = () => {
            if (this.resolveCursor) {
                this.resolveCursor[1]('CLOSED');
            }
            this.ws.onmessage = null;
            this.ws.onerror = null;
            this.ws.onclose = null;
            this.ws = null;
        }
    }

    send(src: ArrayBuffer | ArrayBufferView) {
        this.ws.send(src);
    }

    private resolveCursor: [(res: any) => void, any] | null;

    receive<T = ArrayBuffer>(): Promise<T> {
        if (this.ws.readyState != this.ws.OPEN) {
            throw 'NOT_OPEN';
        }
        if (this.bufferQueue.length > 0) {
            return Promise.resolve(this.bufferQueue.shift());
        }
        const toBeResole = new Promise<T>((res, rej) => {
            this.resolveCursor = [res, rej];
        });
        return toBeResole;
    }

    close(code?: number, reason?: string) {
        this.ws.close(code, reason);
    }

    private onmessage(data: WebSocket.MessageEvent) {
        if (this.resolveCursor) {
            this.resolveCursor[0](data.data);
            this.resolveCursor = null;
        } else {
            this.bufferQueue.push(data.data);
        }
    }

    private onerror(error: any) {
        if (this.resolveCursor) {
            this.resolveCursor[1](error);
            this.resolveCursor = null;
        }
    }
}