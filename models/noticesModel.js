import notices from "../data/notices.js";

class Notice {
    getNotice(notice){
        console.log(`---> noticesModel::getNotice`);

        return notices.find(e => e.username == notice.username);
    }
}

export default new Notice();