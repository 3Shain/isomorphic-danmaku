import got from 'got';
import { BilibiliDanmuInfo, BilibiliGetDanmuInfoResponse, BilibiliGetHistoryResponse, BilibiliGiftConfig, BilibiliGiftConfigResponse, BilibiliHistoryDanmaku, BilibiliRoomInfo, BilibiliRoomInitResponse } from './types';

export async function getBilibiliRoomInfo(roomId: number, options?: {
    fetchGift: boolean,
    fetchHistoryDanmaku: boolean
}) {
    //Todo: error control
    const roomInfo = (await got.get(`https://api.live.bilibili.com/room/v1/Room/room_init?id=${roomId}`, {
        responseType: 'json'
    })).body as BilibiliRoomInitResponse;

    const danmuInfo = (await got.get(`https://api.live.bilibili.com/xlive/web-room/v1/index/getDanmuInfo?id=${roomId}&type=0`,
        {
            responseType: 'json'
        })).body as BilibiliGetDanmuInfoResponse;

    let ret: {
        roomInfo: BilibiliRoomInfo,
        danmuInfo: BilibiliDanmuInfo,
        giftInfo?: {
            list: BilibiliGiftConfig[]
        },
        history?: {
            admin: BilibiliHistoryDanmaku[],
            room: BilibiliHistoryDanmaku[]
        }
    } = {
        roomInfo: roomInfo.data,
        danmuInfo: danmuInfo.data,
    };

    if (options?.fetchGift) {
        const giftInfo = (await got.get(`https://api.live.bilibili.com/xlive/web-room/v1/giftPanel/giftConfig?platform=pc&room_id=${roomId}`, {
            responseType: 'json'
        })).body as BilibiliGiftConfigResponse;
        ret = {
            ...ret,
            giftInfo: giftInfo.data
        }
    }
    if (options?.fetchHistoryDanmaku) {
        const history = (await got.get(`https://api.live.bilibili.com/xlive/web-room/v1/dM/gethistory?roomid=${roomId}`, {
            responseType: 'json'
        })).body as BilibiliGetHistoryResponse;
        ret = {
            ...ret,
            history: history.data
        }
    }

    return ret;
}
