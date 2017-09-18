export class MembersRel {
    public id: number;
    public id_member: number;
    public pin: string;
    public rfid: string;
    public fmd: string;
    public code: string;

    constructor(obj ?: any) {
        this.id = obj && obj.id || null;
        this.id_member = obj && obj.id_member || null;
        this.pin = obj && obj.pin || '';
        this.rfid = obj && obj.rfid || '';
        this.fmd = obj && obj.fmd || '';
        this.code = obj && obj.code || '';
    }
}
