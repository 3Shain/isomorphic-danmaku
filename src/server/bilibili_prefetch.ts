import got from 'got';
import { BilibiliGetDanmuInfoResponse, BilibiliGiftConfigResponse, BilibiliRoomInitResponse } from '../types';

export async function getBilibiliRoomInfo(roomId:number){
    //Todo: error control
    const roomInfo = (await got.get(`https://api.live.bilibili.com/room/v1/Room/room_init?id=${roomId}`,{
        responseType: 'json'
    })).body as BilibiliRoomInitResponse;

    const danmuInfo = (await got.get(`https://api.live.bilibili.com/xlive/web-room/v1/index/getDanmuInfo?id=${roomId}&type=0`,
    {
        responseType:'json'
    })).body as BilibiliGetDanmuInfoResponse;

    const giftInfo = (await got.get(`https://api.live.bilibili.com/xlive/web-room/v1/giftPanel/giftConfig?platform=pc&room_id=${roomId}`,{
        responseType: 'json'
    })).body as BilibiliGiftConfigResponse;

    return {
        roomInfo: roomInfo.data,
        danmuInfo: danmuInfo.data,
        giftInfo: giftInfo.data
    };
}
