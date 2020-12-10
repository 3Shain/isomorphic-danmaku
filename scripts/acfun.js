/** 
 * 请先编译（确保dist文件夹有内容）
 * npm run build
**/
const { connectAcfunLiveWs } = require('../');
const { getAcfunRoomInfo } = require('../server');

const { program } = require('commander');

program.option('-r, --roomid <id>', 'room id');

program.parse(process.argv);

if (!program.roomid) {
    console.error('Please give a room id');
    return;
}

const id = parseInt(program.roomid);

(async () => {
    console.log(id);
    const roominfo = await getAcfunRoomInfo(id);

    for await (let msg of connectAcfunLiveWs({
        roomId: id,
        acSecurity: roominfo.acSecurity,
        tickets: roominfo.tickets,
        serviceToken: roominfo.serviceToken,
        liveId: roominfo.liveId,
        userId: roominfo.userId,
        enterRoomAttach: roominfo.enterRoomAttach,
    })) {
        console.log(msg);
    }
})().catch(console.error);