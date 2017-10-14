import { MembersRel, MembersData } from './';

export class Member {
    public id: number;
    public nombre: string;
    public tipo: string;
    public info: MembersRel;
    public data: MembersData;
    public assoc: Member[] = [];
    public father: Member | number;

    public static KIND = {
        OWNER: 'T',
        PARTNER: 'A',
        EMPLOYEE: 'E',
        GUEST: 'I'
    };

    // public static status = {
    //     A: 'ACTIVO',
    //     PP: 'PENDIENTE DE PAGO',
    //     D: 'DEUDOR'
    // };

    public static status = ['ACTIVO', 'PENDIENTE DE PAGO', 'DEUDOR'];

    constructor(obj ?: any) {
        this.id = obj && obj.id || null;
        this.nombre = obj && obj.nombre || null;
        this.tipo = obj && obj.tipo || Member.KIND.OWNER;

        this.info = obj && 'info' in obj ? new MembersRel(obj.info) : new MembersRel();
        this.data = obj && 'data' in obj ? new MembersData(obj.data) : new MembersData();

        this.father = obj && obj.father || null;

        if(obj && Array.isArray(obj.assoc) && obj.assoc.length > 0)
            obj.assoc.forEach(member => this.assoc.push(new Member(member)));
    }

    is = (kind: string): boolean => {
        switch(kind) {
            case 'titular': return this.tipo == Member.KIND.OWNER;
            case 'asociado': return this.tipo == Member.KIND.PARTNER;
            case 'empleado': return this.tipo == Member.KIND.EMPLOYEE;
            case 'invitado': return this.tipo == Member.KIND.GUEST;
            default: return false;
        }
    }
}
