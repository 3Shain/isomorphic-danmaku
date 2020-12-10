/** 
 * 请先编译（确保dist文件夹有内容）
 * npm run build
**/
const { connectBilibiliLiveWs } = require('../');
const { getBilibiliRoomInfo } = require('../server');

const { program } = require('commander');

program.option('-r, --roomid <id>', 'room id');

program.parse(process.argv);

if (!program.roomid) {
    console.error('Please give a room id');
    return;
}

const id = parseInt(program.roomid);

(async () => {
    const roominfo = await getBilibiliRoomInfo(id,{
        fetchGift:true,
        fetchHistoryDanmaku: true
    });
    console.log(roominfo);
    for await (let msg of connectBilibiliLiveWs({
        roomId: id,
        host: `wss://${roominfo.danmuInfo.host_list[0].host}/sub`,
        token: roominfo.danmuInfo.token
    })) {
        console.log(msg);
    }
})().catch(console.error);