import got from 'got';

export async function getBilibiliRoomInfo(roomId:number){
    //Todo: error control
    const roomInfo = (await got.get(`https://api.live.bilibili.com/room/v1/Room/room_init?id=${roomId}`,{
        responseType: 'json'
    })).body as BilibiliRoomInitResponse;

    const danmuInfo = (await got.get(`https://api.live.bilibili.com/xlive/web-room/v1/index/getDanmuInfo?id=${roomId}&type=0`,
    {
        responseType:'json'
    })).body as GetDanmuInfoResponse;

    return {
        roomInfo: roomInfo.data,
        danmuInfo: danmuInfo.data
    };
}

interface BilibiliRoomInitResponse {
    code:number;
    msg:string;
    message:string;
    data: {
        room_id: number;
        short_id:number;
        uid: number;
        need_p2p: number;
        is_hidden: boolean;
        is_locked: boolean;
        is_portrait: boolean;
        live_status: number;
        hidden_till: number;
        lock_till:number;
        encrypted: boolean;
        pwd_verified: boolean;
        live_time: number;
        room_shield: number;
        special_type: number;
    };
}

interface GetDanmuInfoResponse {
    code:number;
    message: string;
    ttl: number;
    data: {
        group:string;
        busness_id:number;
        refresh_row_factor: number;
        refresh_Rate: number;
        max_delay: number;
        token: string;
        host_list:{
            host: string;
            port:number;
            wss_port:number;
            ws_port:number;
        }[];
    }
}