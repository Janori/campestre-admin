export class MembersData {
    public Id: number;
    public id_member: number;
    public code: string;
    public tipo_membresia: string;
    public email: string;
    public direccion: string;
    public rfc: string;
    public fecha_nacimiento: string;
    public tipo_sangre: string;
    public celular: string;
    public telefono: string;
    public status: string;

    constructor(obj ?: any) {
        this.Id = obj && obj.Id || null;
        this.id_member = obj && obj.id_member || null;
        this.code = obj && obj.code || '';
        this.tipo_membresia = obj && obj.tipo_membresia || 'INDIVIDUAL';
        this.email = obj && obj.email || '';
        this.direccion = obj && obj.direccion || '';
        this.rfc = obj && obj.rfc || 'XAXX010101000';
        this.fecha_nacimiento = obj && obj.fecha_nacimiento || '2017-04-04 00:00:00';
        this.tipo_sangre = obj && obj.tipo_sangre || 'O+';
        this.celular = obj && obj.celular || '';
        this.telefono = obj && obj.telefono || '0';
        this.status = obj && obj.status || 'ACTIVO';
    }
}
